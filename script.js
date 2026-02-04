const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const brightnessSlider = document.getElementById("brightness");
const contrastSlider = document.getElementById("contrast");
const resetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("download");

let img = new Image();
let originalData = null;

upload.addEventListener("change", () => {
  const file = upload.files[0];
  if (!file) return;

  img.src = URL.createObjectURL(file);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };
});

function applyFilters() {
  if (!originalData) return;

  const imageData = new ImageData(
    new Uint8ClampedArray(originalData.data),
    originalData.width,
    originalData.height
  );

  const b = parseInt(brightnessSlider.value);
  const c = parseInt(contrastSlider.value);
  const factor = (259 * (c + 255)) / (255 * (259 - c));

  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = factor * (imageData.data[i] - 128) + 128 + b;
    imageData.data[i + 1] = factor * (imageData.data[i + 1] - 128) + 128 + b;
    imageData.data[i + 2] = factor * (imageData.data[i + 2] - 128) + 128 + b;
  }

  ctx.putImageData(imageData, 0, 0);
}

brightnessSlider.addEventListener("input", applyFilters);
contrastSlider.addEventListener("input", applyFilters);

resetBtn.addEventListener("click", () => {
  if (!originalData) return;
  ctx.putImageData(originalData, 0, 0);
  brightnessSlider.value = 0;
  contrastSlider.value = 0;
});

downloadBtn.addEventListener("click", () => {
  if (!originalData) return;
  const link = document.createElement("a");
  link.download = "pixelease-image.png";
  link.href = canvas.toDataURL();
  link.click();
});
