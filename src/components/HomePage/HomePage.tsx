import "./styles.scss";
import { useState, ChangeEvent } from "react";

const HomePage = () => {
  const [topTextInput, setTopText] = useState<string>("");
  const [bottomTextInput, setBottomText] = useState<string>("");
  const [imageInstance, setImageInstance] = useState<HTMLImageElement>(new Image());
  let canvas = document.querySelector("[data-canvas]") as HTMLCanvasElement;
  let image: HTMLImageElement;

  const handleTopTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if(!canvas) return
    setTopText(event.target.value);
    updateMemeCanvas(
      canvas as HTMLCanvasElement,
      imageInstance,
      event.target.value,
      bottomTextInput
    );
  };

  const handleBottomTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBottomText(event.target.value);
    updateMemeCanvas(
      canvas as HTMLCanvasElement,
      imageInstance,
      topTextInput,
      event.target.value
    );
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      alert("Something went wrong, please upload a different file");
      return;
    }
    const imageDataUrl = URL.createObjectURL(event.target.files[0]);

    image = new Image();

    image.src = imageDataUrl;
    
    canvas = document.querySelector("[data-canvas]") as HTMLCanvasElement;

    setImageInstance(image);

    image.addEventListener(
      "load",
      () => {
        updateMemeCanvas(
          canvas as HTMLCanvasElement,
          image,
          topTextInput,
          bottomTextInput
        );
      },
      { once: true }
    );
  };

  const findLongestString = (arr: string[]) => {
   return arr.reduce((max,name)=>{
        return name.length > max.length? name: max
    },arr[0])
}

  const getFontSizeToFit = (
    topText: string,
    bottomText: string,
    fontFace: string,
    maxWidth: number
  ) => {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return;
    ctx.font = `1px ${fontFace}`;
    const text = [...topText.split("\n"), ...bottomText.split("\n")]
    const longestString = findLongestString(text);
    
    const calculatedFontsize = maxWidth / ctx.measureText(longestString).width;
    
    const maxFontSize = Math.floor(maxWidth / 10);
    return calculatedFontsize > maxFontSize ? maxFontSize : calculatedFontsize;
  };

  const updateMemeCanvas = (
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    topText: string,
    bottomText: string
  ) => {
    const ctx = canvas.getContext("2d");
    const width = image.width;
    const height = image.height;

    // Update canvas background
    canvas.width = width;
    canvas.height = height;
    if (!ctx) return;
    ctx.drawImage(image, 0, 0);
    const yOffset = height / 25;

    // Prepare text
    const fontSize = getFontSizeToFit(topText, bottomText, "sans-serif", canvas.width) as number;
    ctx.lineWidth = Math.floor(fontSize / 10);
    ctx.shadowColor = "black";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    const lineHeight = fontSize + 10;
    ctx.font = `${fontSize}px sans-serif`;

    // Add top text
    ctx.textBaseline = "top";
    const splitTopText = topText.split("\n");
    splitTopText.map((fragment, index) => {
      ctx.strokeText(
        fragment,
        width / 2,
        yOffset + index * lineHeight,
        width - 50
      );
      ctx.fillText(
        fragment,
        width / 2,
        yOffset + index * lineHeight,
        width - 50
      );
    });

    // Add bottom text
    ctx.textBaseline = "bottom";
    const splitBottomText = bottomText.split("\n").reverse();
    splitBottomText.map((fragment, index) => {
      ctx.strokeText(
        fragment,
        width / 2,
        height - index * lineHeight - 20,
        width - 50
      );
      ctx.fillText(
        fragment,
        width / 2,
        height - index * lineHeight - 20,
        width - 50
      );
    });
  };

  const handleClick = (): void => {
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "filename.png";
    link.href = url;
    link.click();
  };

  return (
    <div className="home-page">
      <label className="home-page__label">Select an Image</label>
      <input
        className="home-page__file-input"
        onChange={handleChange}
        type="file"
        accept="image/*"
      />

      <label>Top Text</label>
      <textarea
        onChange={handleTopTextChange}
        className="home-page__top-text-input"
      />

      <label>Bottom Text</label>
      <textarea
        onChange={handleBottomTextChange}
        className="home-page__bottom-text-input"
      />
      <button onClick={handleClick} className="href">
        Download btn
      </button>
      <canvas data-canvas className="home-page__canvas" />
    </div>
  );
};

export default HomePage;
