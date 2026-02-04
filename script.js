const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");

const resetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("download");

let img = new Image();
let originalImage = null;

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

function applyFilters() {
  if (!originalImage) return;

  const imageData = new ImageData(
    new Uint8ClampedArray(originalImage.data),
    originalImage.width,
    originalImage.height
  );

  const b = Number(brightness.value);
  const c = Number(contrast.value);

  const factor = (259 * (c + 255)) / (255 * (259 - c));

  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] =
      factor * (imageData.data[i] - 128) + 128 + b;
    imageData.data[i + 1] =
      factor * (imageData.data[i + 1] - 128) + 128 + b;
    imageData.data[i + 2] =
      factor * (imageData.data[i + 2] - 128) + 128 + b;
  }

  ctx.putImageData(imageData, 0, 0);
}

brightness.addEventListener("input", applyFilters);
contrast.addEventListener("input", applyFilters);

resetBtn.addEventListener("click", () => {
  if (!originalImage) return;
  ctx.putImageData(originalImage, 0, 0);
  brightness.value = 0;
  contrast.value = 0;
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "pixelease.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
