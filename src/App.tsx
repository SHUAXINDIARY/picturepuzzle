import { useEffect, useRef } from "react";
import "./libary/packery.js";

import a from "./assets/testImage/006bAzwAgy1hpi6dijal4j35ie2q2b2c.jpg";
import b from "./assets/testImage/0074J156ly1hplq1w0odrj31vw3pce82.jpg";
import c from "./assets/testImage/008rZrLhgy1hr0jn3g09aj31mz17r7wh.jpg";
import d from "./assets/testImage/20240613-121606.jpeg";

const IMG_LIST = [a, b, c, d, a, b, c, d, a, b, c, d] as string[];

function App() {
  const imgContainer = useRef(null);
  useEffect(() => {
    if (imgContainer.current) {
      setTimeout(() => {
        // @ts-ignore
        new Packery(imgContainer.current, {
          itemSelector: ".imgItem",
          gutter: 0,
          percentPosition: true,
        });
      }, 100);
    }
  }, [imgContainer.current]);
  return (
    <div className="w-screen h-screen bg-red-50 flex justify-center items-center overflow-hidden">
      <div className="card bg-white w-10/12 h-5/6 shadow-xl">
        <div
          className="card-body relative w-full h-auto overflow-hidden imageContainer"
          ref={imgContainer}
        >
          {IMG_LIST.map((item) => {
            return (
              <img
                src={item}
                key={item + Math.random() * 1000}
                className="absolute h-1/4 object-cover imgItem"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
