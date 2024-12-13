import { useEffect, useRef } from "react";
import "./libary/packery.js";

import a from "./assets/testImage/006bAzwAgy1hpi6dijal4j35ie2q2b2c.jpg";
import b from "./assets/testImage/0074J156ly1hplq1w0odrj31vw3pce82.jpg";
import c from "./assets/testImage/008rZrLhgy1hr0jn3g09aj31mz17r7wh.jpg";
import d from "./assets/testImage/20240613-121606.jpeg";
import Drawer from "./components/Drawer.js";

const IMG_LIST = [
  a,
  b,
  c,
  d,
  a,
  b,
  c,
  d,
  a,
  b,
  c,
  d,
  a,
  b,
  d,
  c,
  d,
  c,
  d,
  a,
  b,
  c,
  a,
  b,

  b,
  b,
  c,
  a,
  b,
  b,

  b,
  b,
  c,
  a,
  b,
  b,
  c,
  a,
  d,
] as string[];

function App() {
  const imgContainer = useRef(null);
  let timer: null;
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
        <Drawer />
      </div>
      <div ref={imgContainer} className="w-full h-full">
        {IMG_LIST.map((item) => {
          return (
            <img
              src={item}
              key={item + Math.random() * 1000}
              className={`absolute object-cover h-1/5 w-auto imgItem`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
