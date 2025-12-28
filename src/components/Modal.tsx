const Modal = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h3 className="font-bold text-lg mb-4">声明!</h3>
        <p className="text-base">
          所有图片均在本地处理，不会上传云端，放心使用！如果喜欢点个
          <a
            className="btn btn-ghost btn-sm mx-1"
            target="_blank"
            href="https://github.com/SHUAXINDIARY/picturepuzzle"
          >
            star
          </a>
          支持一下
        </p>
      </div>
    </div>
  );
};

export default Modal;
