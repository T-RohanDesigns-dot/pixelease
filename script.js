const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("upload");
const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");

const sharpenBtn = document.getElementById("sharpen");
const resetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("download");

let img = new Image();
let originalData = null;

upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

function applyFilters() {
  if (!originalData) return;

  const data = new ImageData(
    new Uint8ClampedArray(originalData.data),
    originalData.width,
    originalData.height
  );

  const b = parseInt(brightness.value);
  const c = parseInt(contrast.value);
  const factor = (259 * (c + 255)) / (255 * (259 - c));

  for (let i = 0; i < data.data.length; i += 4) {
    data.data[i]     = factor * (data.data[i] - 128) + 128 + b;
    data.data[i + 1] = factor * (data.data[i + 1] - 128) + 128 + b;
    data.data[i + 2] = factor * (data.data[i + 2] - 128) + 128 + b;
  }

  ctx.putImageData(data, 0, 0);
}

brightness.oninput = applyFilters;
contrast.oninput = applyFilters;

sharpenBtn.onclick = () => {
  ctx.filter = "contrast(115%)";
  ctx.drawImage(canvas, 0, 0);
  ctx.filter = "none";
};

resetBtn.onclick = () => {
  if (originalData) ctx.putImageData(originalData, 0, 0);
  brightness.value = 0;
  contrast.value = 0;
};

downloadBtn.onclick = () => {
  const link = document.createElement("a");
  link.download = "pixelease.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};
