import { memo, useRef, useState, useEffect } from "react";

const Drawer = (props: {
    onSave?: (Files?: File[], shouldGenerate?: boolean) => void;
    onExport?: () => void;
    onClear?: () => void;
    onDelete?: (file: File) => void;
}) => {
    const FileRef = useRef(null);
    const [FileList, setFileList] = useState<File[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<File | null>(null);
    const fileUrlsRef = useRef<Map<File, string>>(new Map());
    const [invalidFiles, setInvalidFiles] = useState<string[]>([]);
    const [showInvalidModal, setShowInvalidModal] = useState(false);

    // 检查文件是否为图片格式
    const isImageFile = (file: File): boolean => {
        // 检查文件扩展名
        const validExtensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".webp",
            ".bmp",
            ".svg",
        ];

        const fileName = file.name.toLowerCase();
        const hasValidExtension = validExtensions.some((ext) =>
            fileName.endsWith(ext)
        );

        // 首先检查扩展名，如果扩展名无效直接拒绝
        if (!hasValidExtension) {
            return false;
        }

        // 然后检查 MIME 类型
        // 如果 MIME 类型存在，必须以 "image/" 开头
        if (file.type && !file.type.startsWith("image/")) {
            return false;
        }

        return true;
    };

    // 为文件生成稳定的 URL
    const getFileUrl = (file: File): string => {
        if (!fileUrlsRef.current.has(file)) {
            const url = URL.createObjectURL(file);
            fileUrlsRef.current.set(file, url);
        }
        return fileUrlsRef.current.get(file)!;
    };

    // 清理已删除文件的 URL
    useEffect(() => {
        const currentFiles = new Set(FileList);
        fileUrlsRef.current.forEach((url, file) => {
            if (!currentFiles.has(file)) {
                URL.revokeObjectURL(url);
                fileUrlsRef.current.delete(file);
            }
        });
    }, [FileList]);

    const hanldeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        console.log("选择的文件:", newFiles.map((f) => ({ name: f.name, type: f.type })));

        if (newFiles.length > 0) {
            // 过滤出有效的图片文件
            const validImageFiles = newFiles.filter((file) => {
                const isValid = isImageFile(file);
                console.log(`文件 ${file.name} (${file.type}): ${isValid ? "有效" : "无效"}`);
                return isValid;
            });
            const invalidImageFiles = newFiles.filter(
                (file) => !isImageFile(file)
            );

            console.log("有效文件:", validImageFiles.length, "无效文件:", invalidImageFiles.length);

            // 如果有无效文件，显示提示
            if (invalidImageFiles.length > 0) {
                setInvalidFiles(
                    invalidImageFiles.map((file) => file.name)
                );
                setShowInvalidModal(true);
            }

            // 只处理有效的图片文件
            if (validImageFiles.length > 0) {
                // 将新选择的文件累积到 Drawer 的列表中（用于预览）
                setFileList((old) => [...(old || []), ...validImageFiles]);
                // 自动累积到 App 中，但不触发生成
                props?.onSave?.(validImageFiles, false);
            }
        }
        // @ts-ignore
        if (FileRef.current) FileRef.current.value = "";
    };

    // 移除自动清空逻辑，由用户手动点击清空按钮来控制

    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <label
                    htmlFor="my-drawer"
                    className="btn btn-ghost drawer-button"
                >
                    选择图片
                </label>
            </div>
            <div className="drawer-side">
                <label
                    htmlFor="my-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                />
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <li>
                        <input
                            ref={FileRef}
                            onChange={hanldeFiles}
                            type="file"
                            multiple
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/svg+xml"
                            className="file-input file-input-ghost w-full max-w-xs"
                        />
                    </li>
                    <li className="m-2">
                        <div className="flex justify-center">
                            <div
                                className={`w-1/3 btn btn-error`}
                                onClick={() => {
                                    setShowConfirmModal(true);
                                }}
                            >
                                清空
                            </div>
                            <div
                                className="w-1/3 btn btn-ghost"
                                onClick={() => {
                                    console.log("点击生成按钮");
                                    // 触发布局计算
                                    props?.onSave?.([], true);
                                }}
                            >
                                生成
                            </div>
                        </div>
                    </li>
                    {FileList!.map((item) => {
                        const url = getFileUrl(item);
                        return (
                            <li key={url} className="m-2 relative group">
                                <img
                                    src={url}
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => {
                                        setFileToDelete(item);
                                    }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                    <span className="text-white text-sm font-bold">
                                        点击删除
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {/* 确认清空对话框 */}
            <div className={`modal ${showConfirmModal ? "modal-open" : ""}`}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">确认清空</h3>
                    <p className="py-4">
                        确定要清空所有图片吗？此操作不可恢复。
                    </p>
                    <div className="modal-action">
                        <button
                            className="btn btn-error"
                            onClick={() => {
                                setFileList([]);
                                props?.onClear?.();
                                setShowConfirmModal(false);
                            }}
                        >
                            确认
                        </button>
                        <button
                            className="btn btn-ghost"
                            onClick={() => {
                                setShowConfirmModal(false);
                            }}
                        >
                            取消
                        </button>
                    </div>
                </div>
            </div>
            {/* 确认删除对话框 */}
            <div
                className={`modal ${fileToDelete ? "modal-open" : ""}`}
                onClick={() => {
                    setFileToDelete(null);
                }}
            >
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-bold text-lg">确认删除</h3>
                    <p className="py-4">
                        确定要删除这张图片吗？此操作不可恢复。
                    </p>
                    {fileToDelete && (
                        <div className="mb-4">
                            <img
                                src={getFileUrl(fileToDelete)}
                                className="max-w-full max-h-48 mx-auto rounded"
                                alt="预览"
                            />
                            <p className="text-sm text-base-content/70 mt-2 text-center">
                                {fileToDelete.name}
                            </p>
                        </div>
                    )}
                    <div className="modal-action">
                        <button
                            className="btn btn-error"
                            onClick={() => {
                                if (fileToDelete) {
                                    // 从列表中移除
                                    setFileList((prev) =>
                                        prev.filter(
                                            (file) => file !== fileToDelete
                                        )
                                    );
                                    // 通知父组件
                                    props?.onDelete?.(fileToDelete);
                                    setFileToDelete(null);
                                }
                            }}
                        >
                            确认
                        </button>
                        <button
                            className="btn btn-ghost"
                            onClick={() => {
                                setFileToDelete(null);
                            }}
                        >
                            取消
                        </button>
                    </div>
                </div>
            </div>
            {/* 无效文件提示对话框 */}
            <div
                className={`modal ${showInvalidModal ? "modal-open" : ""}`}
                onClick={() => {
                    setShowInvalidModal(false);
                    setInvalidFiles([]);
                }}
            >
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-bold text-lg text-warning">文件格式不支持</h3>
                    <p className="py-4">
                        以下文件不是图片格式，已自动过滤：
                    </p>
                    <div className="mb-4 max-h-48 overflow-y-auto">
                        <ul className="list-disc list-inside">
                            {invalidFiles.map((fileName, index) => (
                                <li key={index} className="text-sm text-base-content/70">
                                    {fileName}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-sm text-base-content/60 mb-4">
                        支持的格式：JPEG、JPG、PNG、GIF、WebP、BMP、SVG
                    </p>
                    <div className="modal-action">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setShowInvalidModal(false);
                                setInvalidFiles([]);
                            }}
                        >
                            知道了
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Drawer);
