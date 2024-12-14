import { useEffect, useRef } from "react";

const Modal = () => {
  const ModalRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (ModalRef.current) {
      ModalRef.current.showModal();
    }
  }, []);
  return (
    <>
      <dialog id="my_modal_1" className="modal" ref={ModalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">声明!</h3>
          <p className="py-4">
            所有图片均在本地处理，不会上传云端，放心使用！如果喜欢点个
            <a
              className="btn btn-ghost"
              target="_blank"
              href="https://github.com/SHUAXINDIARY/picturepuzzle"
            >
              star
            </a>
            支持一下
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">我已知晓</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
