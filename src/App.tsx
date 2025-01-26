import { useCallback, useEffect, useRef, useState } from "react";
import Drawer from "./components/Drawer.tsx";
// @ts-ignore
import * as Packery from "packery";
import { savePngByCanvas } from "./utils/index.ts";

const H_MAP = {
  1: "h-full",
  2: "h-1/2",
  3: "h-1/3",
  4: "h-1/4",
  5: "h-1/5",
  6: "h-1/6",
} as Record<string, string>;

function App() {
  const imgContainer = useRef(null);
  const [ImgData, setImgData] = useState<File[]>([]);
  const [RowVal, setRowVal] = useState(4);
  useEffect(() => {
    if (imgContainer.current && ImgData.length) {
      setTimeout(() => {
        // @ts-ignore
        const obj = new Packery(imgContainer.current, {
          itemSelector: ".imgItem",
          horizontal: true,
          resize: true,
        });
        console.log(obj);
      }, 1000);
    }
  }, [ImgData, RowVal]);

  const handleSave = useCallback((files?: File[]) => {
    files && setImgData(files);
  }, []);

  const hanldeExport = () => {
    // @ts-ignore
    // 关闭弹窗
    document.querySelector("#my-drawer").click();
    // 开始下载
    setTimeout(() => {
      try {
        const targetDom = document.querySelector("#imgContainer")!;
        // const width = targetDom?.style?.width?.split?.("px")?.[0];
        // const height = targetDom?.style?.height?.split?.("px")?.[0];
        // console.log("调试width", width);
        savePngByCanvas(
          true,
          // document.querySelector("#imgContainer")!
          imgContainer.current!
          // Number(width || 0),
          // Number(height || 0)
        );
      } catch (error) {
        console.log(error);
      }
    }, 1000);
  };

  const handleSetRow = useCallback((val?: number) => {
    val && val > 0 && setRowVal(val);
  }, []);

  return (
    <div
    // id="imgList"
    // className="h-screen overflow-y-hidden w-auto"
    >
      <div className="absolute top-2 left-2 z-50 flex">
        <Drawer
          onSave={handleSave}
          onExport={hanldeExport}
          onSetRow={handleSetRow}
        />
      </div>
      <div
        ref={imgContainer}
        id="imgContainer"
        className="w-full h-screen overflow-y-hidden 
      "
      >
        {ImgData.length
          ? ImgData.map((item) => {
              const url =
                typeof item === "string" ? item : URL.createObjectURL(item);
              return (
                <img
                  src={url}
                  key={url + Math.random() * 1000}
                  className={`absolute object-cover ${
                    H_MAP[String(RowVal)]
                  } imgItem`}
                />
              );
            })
          : ""}
      </div>
    </div>
  );
}

export default App;
