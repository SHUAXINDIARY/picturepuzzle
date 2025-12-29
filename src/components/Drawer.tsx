import { memo, useRef, useState } from "react";

const Drawer = (props: {
    onSave?: (Files?: File[], shouldGenerate?: boolean) => void;
    onExport?: () => void;
    onClear?: () => void;
}) => {
    const FileRef = useRef(null);
    const [FileList, setFileList] = useState<File[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const hanldeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length > 0) {
            // 将新选择的文件累积到 Drawer 的列表中（用于预览）
            setFileList((old) => [...(old || []), ...newFiles]);
            // 自动累积到 App 中，但不触发生成
            props?.onSave?.(newFiles, false);
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
                        const url = URL.createObjectURL(item);
                        return (
                            <li key={url} className="m-2">
                                <img src={url} />
                            </li>
                        );
                    })}
                </ul>
            </div>
            {/* 确认清空对话框 */}
            <div className={`modal ${showConfirmModal ? "modal-open" : ""}`}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">确认清空</h3>
                    <p className="py-4">确定要清空所有图片吗？此操作不可恢复。</p>
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
        </div>
    );
};

export default memo(Drawer);
