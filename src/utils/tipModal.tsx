import { createRoot, Root } from "react-dom/client";

interface TipModalOptions {
    title?: string;
    buttonText?: string;
}

let modalRoot: Root | null = null;
let containerEl: HTMLDivElement | null = null;

const TipModalContent = ({
    message,
    title = "提示",
    buttonText = "知道了",
    onClose,
}: {
    message: string;
    title?: string;
    buttonText?: string;
    onClose: () => void;
}) => {
    return (
        <div className="modal modal-open" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-bold text-lg text-warning">{title}</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <button className="btn btn-primary" onClick={onClose}>
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const getContainer = () => {
    if (!containerEl) {
        containerEl = document.createElement("div");
        containerEl.id = "tip-modal-container";
        document.body.appendChild(containerEl);
    }
    if (!modalRoot) {
        modalRoot = createRoot(containerEl);
    }
    return modalRoot;
};

const close = () => {
    const root = getContainer();
    root.render(null);
};

export const showTip = (message: string, options?: TipModalOptions) => {
    const root = getContainer();
    root.render(
        <TipModalContent
            message={message}
            title={options?.title}
            buttonText={options?.buttonText}
            onClose={close}
        />
    );
};

