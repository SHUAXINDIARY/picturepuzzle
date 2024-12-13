import { useEffect, useRef, useState } from "react";
import "./libary/packery.js";
import Drawer from "./components/Drawer.js";

function App() {
  const imgContainer = useRef(null);
  let timer: null;
  const [ImgList, setImgList] = useState<File[]>([]);
  useEffect(() => {
    if (imgContainer.current) {
      setTimeout(() => {
        // @ts-ignore
        new Packery(imgContainer.current, {
          itemSelector: ".imgItem",
          percentPosition: true,
          horizontal: true,
        });
      }, 100);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [imgContainer.current]);
  return (
    <div className="w-screen h-screen flex justify-center items-center overflow-hidden">
      <div className="absolute top-2 left-2 z-50">
        <Drawer
          onSave={(files) => {
            files && files.length && setImgList(files);
          }}
        />
      </div>
      <div ref={imgContainer} className="w-full h-full">
        {ImgList.map((item) => {
          const url = URL.createObjectURL(item);
          return (
            <img
              src={url}
              key={url + Math.random() * 1000}
              className={`absolute object-cover h-1/5 w-auto imgItem`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
