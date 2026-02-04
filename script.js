const fileInput = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = new Image();
let originalImage = null;

let brightness = 0;
let contrast = 0;

fileInput.addEventListener("change", (e) => {
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

  const data = new ImageData(
    new Uint8ClampedArray(originalImage.data),
    originalImage.width,
    originalImage.height
  );

  for (let i = 0; i < data.data.length; i += 4) {
    data.data[i] = clamp(data.data[i] + brightness);     // R
    data.data[i + 1] = clamp(data.data[i + 1] + brightness); // G
    data.data[i + 2] = clamp(data.data[i + 2] + brightness); // B

    data.data[i] = clamp((data.data[i] - 128) * contrast + 128);
    data.data[i + 1] = clamp((data.data[i + 1] - 128) * contrast + 128);
    data.data[i + 2] = clamp((data.data[i + 2] - 128) * contrast + 128);
  }

  ctx.putImageData(data, 0, 0);
}

function clamp(value) {
  return Math.max(0, Math.min(255, value));
}

/* Sliders */
document.getElementById("brightness").addEventListener("input", e => {
  brightness = parseInt(e.target.value);
  applyFilters();
});

document.getElementById("contrast").addEventListener("input", e => {
  contrast = e.target.value / 50;
  applyFilters();
});

/* Reset */
document.getElementById("reset").addEventListener("click", () => {
  if (!originalImage) return;
  ctx.putImageData(originalImage, 0, 0);
  brightness = 0;
  contrast = 0;
});

/* Download */
document.getElementById("download").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "pixelease.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
