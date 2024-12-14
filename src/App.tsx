import { useCallback, useEffect, useRef, useState } from "react";
import Drawer from "./components/Drawer.tsx";
// @ts-ignore
import "./libary/packery.js";

function App() {
  const imgContainer = useRef(null);
  const [ImgData, setImgData] = useState<File[]>([]);
  useEffect(() => {
    if (imgContainer.current && ImgData.length) {
      setTimeout(() => {
        // @ts-ignore
        new Packery(imgContainer.current, {
          itemSelector: ".imgItem",
          percentPosition: true,
          horizontal: true,
        });
      }, 1000);
    }
  }, [ImgData]);

  const handleSave = useCallback((files?: File[]) => {
    files && files.length && setImgData(files);
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center overflow-y-hidden overflow-x-scroll">
      <div className="absolute top-2 left-2 z-50">
        <Drawer onSave={handleSave} />
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
                  className={`absolute object-cover h-1/5  imgItem`}
                />
              );
            })
          : ""}
      </div>
    </div>
  );
}

export default App;
