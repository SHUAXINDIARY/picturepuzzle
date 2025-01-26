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
        new Packery(imgContainer.current, {
          itemSelector: ".imgItem",
          horizontal: true,
          resize: true,
        });
      }, 1000);
    }
  }, [ImgData, RowVal]);

  const handleSave = useCallback((files?: File[]) => {
    files && setImgData(files);
  }, []);

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

  const handleSetRow = useCallback((val?: number) => {
    val && val > 0 && setRowVal(val);
  }, []);

  useEffect(() => {
    console.log("调试行数", RowVal);
  }, [RowVal]);

  return (
    <div
      id="imgList"
      className="h-screen flex justify-center items-center overflow-y-hidden"
    >
      <div className="absolute top-2 left-2 z-50 flex">
        <Drawer
          onSave={handleSave}
          onExport={hanldeExport}
          onSetRow={handleSetRow}
        />
      </div>
      <div ref={imgContainer} className="w-full h-full">
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
