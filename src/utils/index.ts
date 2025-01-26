import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { UAParser } from "ua-parser-js";

const userDevice = UAParser(window.navigator.userAgent);
const waitFrames = (frameCount: number, callback: () => void) => {
  let currentFrame = 0;

  const frameStep = () => {
    currentFrame++;
    if (currentFrame >= frameCount) {
      callback(); // 达到指定帧数后执行回调
    } else {
      requestAnimationFrame(frameStep); // 继续下一帧
    }
  };

  requestAnimationFrame(frameStep); // 开始第一帧
};

export const isApple = () => {
  return (
    userDevice.os.name === "iOS" ||
    userDevice.browser.name?.includes("Safari") ||
    window.navigator.userAgent.includes("Safari")
  );
};

export const savePngByCanvas = async (isDown = false, domElement: Node, width?: number, height?: number) => {
  const svgString = await domtoimage.toSvg(domElement, {
    // width,
    // height
  });

  return new Promise((res, rej) => {
    // 超采样倍率
    const scaleFactor = 3;
    // 创建 Canvas 元素
    const canvas = new OffscreenCanvas(
      document.body.clientWidth * scaleFactor,
      document.body.clientHeight * scaleFactor
    );
    const ctx = canvas.getContext("2d");
    ctx?.scale(scaleFactor, scaleFactor);
    // 创建图像对象
    const img = new Image();
    img.id = "result";
    // img.crossOrigin = "anonymous"; // 设置跨域
    img.onload = async (e) => {
      try {
        if (e.target) {
          ctx!.drawImage(img, 0, 0);
          if (isApple()) {
            waitFrames(5, async () => {
              if (isDown) {
                saveAs(await canvas.convertToBlob(), "result.png");
              }
            });
          } else {
            console.log("开始下载");
            saveAs(await canvas.convertToBlob(), "result.png");
          }

          res(true);
        }
        res(true);
      } catch (error) {
        rej(`图片保存失败${String(error)}`);
      }
    };

    img.onerror = (err) => {
      rej(`图片导出失败：渲染失败,${err.toString()}`);
    };

    // 加载 SVG 数据到图像对象
    img.src = svgString;
  });
};
