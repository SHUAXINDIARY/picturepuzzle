import { useCallback, useEffect, useRef, useState } from "react";
import Drawer from "./components/Drawer.tsx";
import Modal from "./components/Modal.tsx";
import { savePngByCanvas } from "./utils/index.ts";

interface ImageLayout {
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

function App() {
    const imgContainer = useRef<HTMLDivElement>(null);
    const [ImgData, setImgData] = useState<File[]>([]);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [imageLayouts, setImageLayouts] = useState<ImageLayout[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState<
        Map<string, { width: number; height: number }>
    >(new Map());
    const imageUrlsRef = useRef<Map<File, string>>(new Map());
    const [shouldCalculateLayout, setShouldCalculateLayout] = useState(false);

    // 为文件生成稳定的 URL
    const getImageUrl = useCallback((file: File): string => {
        if (!imageUrlsRef.current.has(file)) {
            const url = URL.createObjectURL(file);
            imageUrlsRef.current.set(file, url);
        }
        return imageUrlsRef.current.get(file)!;
    }, []);

    // 计算容器尺寸
    useEffect(() => {
        const updateSize = () => {
            if (imgContainer.current) {
                const rect = imgContainer.current.getBoundingClientRect();
                setContainerSize({ width: rect.width, height: rect.height });
            }
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    // 计算最佳行数
    const calculateOptimalRows = (
        imageCount: number,
        containerAspectRatio: number,
        avgImageAspectRatio: number
    ) => {
        if (imageCount === 0) return 1;

        // 尝试不同的行数，找到最接近容器宽高比的布局
        let bestRows = 1;
        let bestScore = Infinity;

        const maxRows = Math.min(
            imageCount,
            Math.ceil(Math.sqrt(imageCount) * 1.5)
        );

        for (let rows = 1; rows <= maxRows; rows++) {
            const avgImagesPerRow = imageCount / rows;
            const estimatedRowWidth = avgImagesPerRow * avgImageAspectRatio;
            const estimatedLayoutRatio = estimatedRowWidth / rows;

            // 计算与容器宽高比的差异
            const score = Math.abs(estimatedLayoutRatio - containerAspectRatio);

            if (score < bestScore) {
                bestScore = score;
                bestRows = rows;
            }
        }

        return bestRows;
    };

    // 计算图片布局
    useEffect(() => {
        if (
            !shouldCalculateLayout ||
            containerSize.height === 0 ||
            containerSize.width === 0 ||
            ImgData.length === 0
        ) {
            console.log("布局计算条件不满足", {
                shouldCalculateLayout,
                containerSize,
                imgCount: ImgData.length,
            });
            return;
        }

        // 等待所有图片加载完成
        if (imagesLoaded.size !== ImgData.length) {
            console.log("等待图片加载", {
                loaded: imagesLoaded.size,
                total: ImgData.length,
            });
            return;
        }

        console.log("开始计算布局");

        const urls = ImgData.map((item) =>
            typeof item === "string" ? item : getImageUrl(item)
        );

        // 获取所有图片的宽高比
        const imageInfos = urls.map((url) => {
            const dimensions = imagesLoaded.get(url);
            return {
                url,
                aspectRatio: dimensions
                    ? dimensions.width / dimensions.height
                    : 1,
            };
        });

        // 计算平均宽高比和最佳行数
        const avgAspectRatio =
            imageInfos.reduce((sum, img) => sum + img.aspectRatio, 0) /
            imageInfos.length;
        const containerAspectRatio = containerSize.width / containerSize.height;
        const optimalRows = calculateOptimalRows(
            imageInfos.length,
            containerAspectRatio,
            avgAspectRatio
        );

        console.log(
            "自动计算行数:",
            optimalRows,
            "平均宽高比:",
            avgAspectRatio.toFixed(2),
            "容器宽高比:",
            containerAspectRatio.toFixed(2)
        );

        // 将图片分配到各行（贪心算法：每次分配到宽高比总和最小的行）
        const rows: { url: string; aspectRatio: number }[][] = Array.from(
            { length: optimalRows },
            () => []
        );
        imageInfos.forEach((info) => {
            // 找到宽高比总和最小的行
            let minRowIndex = 0;
            let minRowWidth = rows[0].reduce(
                (sum, img) => sum + img.aspectRatio,
                0
            );

            for (let i = 1; i < rows.length; i++) {
                const rowWidth = rows[i].reduce(
                    (sum, img) => sum + img.aspectRatio,
                    0
                );
                if (rowWidth < minRowWidth) {
                    minRowWidth = rowWidth;
                    minRowIndex = i;
                }
            }

            rows[minRowIndex].push(info);
        });

        // 计算布局
        const layouts: ImageLayout[] = [];
        const gutter = 4; // 图片之间的间距
        const padding = 20; // 容器内边距
        const availableWidth = containerSize.width - padding * 2;
        const availableHeight = containerSize.height - padding * 2;
        const totalVerticalGutter = gutter * (optimalRows - 1);
        const baseRowHeight =
            (availableHeight - totalVerticalGutter) / optimalRows;

        // 第一步：计算每行的实际宽度和所需高度
        const rowLayouts = rows.map((row) => {
            if (row.length === 0)
                return {
                    images: [],
                    totalWidth: 0,
                    rowHeight: baseRowHeight,
                    totalAspectRatio: 0,
                };

            const totalAspectRatio = row.reduce(
                (sum, img) => sum + img.aspectRatio,
                0
            );
            const totalGutterWidth = gutter * (row.length - 1);

            // 计算这一行的图片宽度总和（使用基础行高）
            const totalImageWidth = totalAspectRatio * baseRowHeight;
            const totalRowWidth = totalImageWidth + totalGutterWidth;

            return {
                images: row,
                totalWidth: totalRowWidth,
                rowHeight: baseRowHeight,
                totalAspectRatio,
            };
        });

        // 第二步：找出最宽的行，用于计算缩放比例
        const maxRowWidth = Math.max(...rowLayouts.map((r) => r.totalWidth));
        const scale =
            maxRowWidth > availableWidth ? availableWidth / maxRowWidth : 1;

        console.log(
            "缩放比例:",
            scale.toFixed(3),
            "最大行宽:",
            maxRowWidth.toFixed(2),
            "可用宽度:",
            availableWidth
        );

        // 第三步：应用缩放并计算每张图片的位置
        let currentY = 0;
        rowLayouts.forEach((rowLayout, rowIndex) => {
            if (rowLayout.images.length === 0) return;

            const scaledRowHeight = rowLayout.rowHeight * scale;
            const scaledGutter = gutter * scale;
            const totalGutterWidth =
                scaledGutter * (rowLayout.images.length - 1);

            // 计算这一行图片的总宽度
            let rowTotalWidth = 0;
            const imageWidths: number[] = [];
            rowLayout.images.forEach((img) => {
                const width = img.aspectRatio * scaledRowHeight;
                imageWidths.push(width);
                rowTotalWidth += width;
            });
            rowTotalWidth += totalGutterWidth;

            // 计算水平居中偏移
            const offsetX = (availableWidth - rowTotalWidth) / 2;

            // 布局这一行的图片
            let currentX = offsetX;
            rowLayout.images.forEach((img, imgIndex) => {
                const width = imageWidths[imgIndex];
                layouts.push({
                    url: img.url,
                    x: currentX,
                    y: currentY,
                    width,
                    height: scaledRowHeight,
                });
                currentX +=
                    width +
                    (imgIndex < rowLayout.images.length - 1 ? scaledGutter : 0);
            });

            console.log(
                `第${rowIndex + 1}行: ${
                    rowLayout.images.length
                }张图片, 行高=${scaledRowHeight.toFixed(
                    2
                )}, 总宽度=${rowTotalWidth.toFixed(
                    2
                )}, 水平偏移=${offsetX.toFixed(2)}`
            );

            currentY +=
                scaledRowHeight +
                (rowIndex < rows.length - 1 ? scaledGutter : 0);
        });

        // 计算垂直居中偏移
        const totalHeight = currentY;
        const offsetY = (availableHeight - totalHeight) / 2;

        // 应用偏移（包含 padding）
        layouts.forEach((layout) => {
            layout.x += padding;
            layout.y += offsetY + padding;
        });

        console.log(
            "布局计算完成，共",
            layouts.length,
            "张图片, 总高度:",
            totalHeight.toFixed(2),
            "垂直偏移:",
            offsetY.toFixed(2)
        );
        setImageLayouts(layouts);
        setShouldCalculateLayout(false); // 计算完成后重置标志
    }, [ImgData, containerSize, imagesLoaded, getImageUrl, shouldCalculateLayout]);

    const handleSave = useCallback((files?: File[], shouldGenerate?: boolean) => {
        if (files && files.length > 0) {
            console.log("接收到新文件:", files.length);
            
            // 将新文件累积到现有文件列表中
            setImgData((prevFiles) => {
                // 创建文件唯一标识（名称+大小+修改时间）来去重
                const existingKeys = new Set(
                    prevFiles.map(
                        (f) => `${f.name}-${f.size}-${f.lastModified}`
                    )
                );
                
                // 过滤掉已存在的文件
                const newFiles = files.filter(
                    (f) =>
                        !existingKeys.has(
                            `${f.name}-${f.size}-${f.lastModified}`
                        )
                );
                
                if (newFiles.length > 0) {
                    console.log("添加新文件:", newFiles.length, "总文件数:", prevFiles.length + newFiles.length);
                    return [...prevFiles, ...newFiles];
                } else {
                    console.log("所有文件已存在，未添加新文件");
                    return prevFiles;
                }
            });
        }
        
        // 只有点击生成按钮时才触发布局计算
        if (shouldGenerate) {
            console.log("触发布局计算");
            // 不重置 imagesLoaded，保留已加载的图片信息
            setImageLayouts([]); // 清空现有布局
            setShouldCalculateLayout(true); // 设置标志，允许计算布局
        }
    }, []);

    // 清空所有文件
    const handleClear = useCallback(() => {
        console.log("清空所有文件");
        // 清理所有 URL
        imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        imageUrlsRef.current.clear();
        
        setImgData([]);
        setImagesLoaded(new Map());
        setImageLayouts([]);
        setShouldCalculateLayout(false);
    }, []);

    const handleImageLoad = useCallback(
        (url: string, img: HTMLImageElement) => {
            console.log(
                "图片加载完成:",
                url,
                img.naturalWidth,
                img.naturalHeight
            );
            setImagesLoaded((prev) => {
                const newMap = new Map(prev);
                newMap.set(url, {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                });
                console.log("已加载图片数量:", newMap.size);
                return newMap;
            });
        },
        []
    );

    const hanldeExport = useCallback(() => {
        // @ts-ignore
        document.querySelector("#my-drawer").click();
        setTimeout(() => {
            try {
                savePngByCanvas(true, imgContainer.current!);
            } catch (error) {
                console.log(error);
            }
        }, 1000);
    }, []);

    return (
        <div
            id="imgList"
            className="h-screen w-screen overflow-hidden"
            style={{ padding: 0, margin: 0 }}
        >
            <div className="absolute top-2 left-2 z-50 flex">
                <Drawer
                    onSave={handleSave}
                    onExport={hanldeExport}
                    onClear={handleClear}
                />
            </div>
            <div
                ref={imgContainer}
                className="w-full h-full overflow-hidden"
                style={{
                    padding: 0,
                    margin: 0,
                    position: "relative",
                    boxSizing: "border-box",
                }}
            >
                {ImgData.length === 0 ? (
                    <Modal />
                ) : (
                    <>
                        {/* 隐藏的图片用于预加载 */}
                        {ImgData.map((item, index) => {
                            const url =
                                typeof item === "string"
                                    ? item
                                    : getImageUrl(item);
                            
                            // 如果图片还没有布局信息，渲染隐藏的图片来触发加载
                            const layout = imageLayouts.find(
                                (l) => l.url === url
                            );
                            
                            if (!layout) {
                                return (
                                    <img
                                        src={url}
                                        key={`preload-${index}-${url}`}
                                        onLoad={(e) =>
                                            handleImageLoad(url, e.currentTarget)
                                        }
                                        style={{
                                            position: "absolute",
                                            opacity: 0,
                                            pointerEvents: "none",
                                            width: "1px",
                                            height: "1px",
                                        }}
                                    />
                                );
                            }
                            
                            return null;
                        })}
                        
                        {/* 实际显示的图片 */}
                        {imageLayouts.map((layout, index) => {
                            return (
                                <img
                                    src={layout.url}
                                    key={`display-${index}-${layout.url}`}
                                    className="imgItem"
                                    style={{
                                        position: "absolute",
                                        left: `${layout.x}px`,
                                        top: `${layout.y}px`,
                                        width: `${layout.width}px`,
                                        height: `${layout.height}px`,
                                        maxWidth: "none",
                                        maxHeight: "none",
                                        margin: 0,
                                        padding: 0,
                                        objectFit: "contain",
                                        display: "block",
                                    }}
                                />
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
