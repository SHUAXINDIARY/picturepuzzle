import { memo, useCallback, useEffect, useRef, useState } from "react";
import Select, { SelectProps } from "./Select";
import Dropdown from "./Dropdown";
// import { savePngByCanvas } from "../utils";

const Drawer = (
  props: {
    onSave?: (Files?: File[]) => void;
    onExport?: () => void;
  } & SelectProps
) => {
  const FileRef = useRef(null);
  const [FileList, setFileList] = useState<File[]>([]);

  const hanldeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileList((old) => {
      return [...(e.target.files || []), ...(old || [])];
    });
    // @ts-ignore
    if (FileRef.current) FileRef.current.value = "";
  };

  useEffect(() => {
    if (FileList.length === 0) {
      props.onSave?.([]);
    }
  }, [FileList]);

  const handleDel = useCallback((item: File) => {
    setFileList((old) => {
      return old.filter((oldItem) => oldItem !== item);
    });
  }, []);

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
            <Select onSetRow={props.onSetRow} />
          </li>
          <li className="m-2">
            <div className="flex justify-center">
              <div
                className={`w-1/3 btn btn-primary ${
                  FileList.length === 0 && "btn-disabled"
                }`}
                onClick={() => {
                  props?.onSave?.(FileList);
                }}
              >
                生成
              </div>
              <div
                className={`w-1/3 btn btn-error ${
                  FileList.length === 0 && "btn-disabled"
                }`}
                onClick={() => {
                  setFileList([]);
                }}
              >
                清空
              </div>
            </div>
          </li>

          <li className="m-2 inline-flex justify-between">
            <div
              className={`btn btn-ghost ${
                FileList.length === 0 && "btn-disabled"
              }`}
              onClick={props.onExport}
            >
              导出结果
            </div>
          </li>
          {FileList!.map((item) => {
            const url = URL.createObjectURL(item);
            return (
              <li key={url} className="m-2">
                <Dropdown
                  dom={<img src={url} />}
                  onDel={() => handleDel(item)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default memo(Drawer);
