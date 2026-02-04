const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const reset = document.getElementById("reset");
const download = document.getElementById("download");

let img = new Image();
let original = null;

upload.addEventListener("change", () => {
  const file = upload.files[0];
  if (!file) return;

  img.src = URL.createObjectURL(file);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    original = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };
});

function applyFilters() {
  if (!original) return;

  const data = new ImageData(
    new Uint8ClampedArray(original.data),
    original.width,
    original.height
  );

  const b = +brightness.value;
  const c = +contrast.value;
  const f = (259 * (c + 255)) / (255 * (259 - c));

  for (let i = 0; i < data.data.length; i += 4) {
    data.data[i] = f * (data.data[i] - 128) + 128 + b;
    data.data[i + 1] = f * (data.data[i + 1] - 128) + 128 + b;
    data.data[i + 2] = f * (data.data[i + 2] - 128) + 128 + b;
  }

  ctx.putImageData(data, 0, 0);
}

brightness.addEventListener("input", applyFilters);
contrast.addEventListener("input", applyFilters);

reset.addEventListener("click", () => {
  if (!original) return;
  ctx.putImageData(original, 0, 0);
  brightness.value = 0;
  contrast.value = 0;
});

download.addEventListener("click", () => {
  if (!original) return;
  const a = document.createElement("a");
  a.download = "pixelease.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
});
