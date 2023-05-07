import { ChangeEvent } from "react";
import "./styles.scss";

const HomePage = () => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      alert("Something went wrong, please upload a different file");
      return;
    }
    const imageDataUrl = URL.createObjectURL(event.target.files[0]);

    const image = new Image();
    image.src = imageDataUrl;
    const canvas = document.querySelector("[data-canvas]");

    image.addEventListener(
      "load",
      () => {
        updateMemeCanvas(canvas as HTMLCanvasElement, image);
      },
      { once: true }
    );
  };

  const updateMemeCanvas = (
    canvas: HTMLCanvasElement,
    image: HTMLImageElement
  ) => {
    const ctx = canvas.getContext("2d");
    const width = image.width;
    const height = image.height;
    const fontSize = Math.floor(width / 10);

    // Update canvas background
    canvas.width = width;
    canvas.height = height;
    if (!ctx) return;
    ctx.drawImage(image, 0, 0);

    // Prepare text
    ctx.strokeStyle = "black";
    ctx.lineWidth = Math.floor(fontSize / 4);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    ctx.font = `${fontSize}px sans-serif`;
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

      <canvas data-canvas className="home-page__canvas" />
    </div>
  );
};

export default HomePage;
