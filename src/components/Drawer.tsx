import { memo, useRef, useState } from "react";

const Drawer = (props: { onSave?: (Files?: File[]) => void }) => {
  const FileRef = useRef(null);
  const [FileList, setFileList] = useState<File[]>([]);

  const hanldeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.files?.length &&
      setFileList((old) => {
        return [...(e.target.files || []), ...(old || [])];
      });
    // @ts-ignore
    if (FileRef.current) FileRef.current.value = "";
  };
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
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
          <li className="m-2 inline-flex justify-between">
            <div
              className="btn btn-ghost"
              onClick={() => {
                props?.onSave?.(FileList);
              }}
            >
              生成
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
    </div>
  );
};

export default memo(Drawer);
