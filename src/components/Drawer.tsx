import { useEffect, useRef, useState } from "react";

const Drawer = (props: { onSave?: (Files: File[]) => void }) => {
  const [FileList, setFileList] = useState<File[]>([]);
  const FileRef = useRef(null);
  useEffect(() => {
    if (FileRef.current) {
      // @ts-ignore
      FileRef.current.value = "";
    }
  }, [FileList]);
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
          上传图片
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
              onChange={(e) => {
                e.target.files &&
                  setFileList((old) => {
                    return e.target.files?.[0]
                      ? [...old, ...e.target.files]
                      : old;
                  });
              }}
              type="file"
              multiple
              className="file-input file-input-ghost w-full max-w-xs"
            />
          </li>
          <li className="m-2 inline-flex justify-between">
            <div
              className="btn"
              onClick={() => {
                props?.onSave?.(FileList);
              }}
            >
              生成
            </div>
          </li>
          {FileList.map((item) => {
            const url = URL.createObjectURL(item);
            return (
              <li key={url} className="m-2">
                <img src={url} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
