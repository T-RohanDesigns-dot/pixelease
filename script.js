const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const sharpenBtn = document.getElementById("sharpen");
const upscaleSelect = document.getElementById("upscale");
const resetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("download");

let img = new Image();
let original = null;

upload.addEventListener("change", e => {
  const reader = new FileReader();
  reader.onload = () => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      original = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

function applyBC() {
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
    data.data[i+1] = f * (data.data[i+1] - 128) + 128 + b;
    data.data[i+2] = f * (data.data[i+2] - 128) + 128 + b;
  }
  ctx.putImageData(data, 0, 0);
}

brightness.oninput = applyBC;
contrast.oninput = applyBC;

sharpenBtn.onclick = () => {
  const kernel = [
     0, -1,  0,
    -1,  5, -1,
     0, -1,  0
  ];
  const w = canvas.width;
  const h = canvas.height;
  const src = ctx.getImageData(0, 0, w, h);
  const dst = ctx.createImageData(w, h);

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let i = (y * w + x) * 4 + c;
        let sum = 0, k = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            let idx = ((y + ky) * w + (x + kx)) * 4 + c;
            sum += src.data[idx] * kernel[k++];
          }
        }
        dst.data[i] = Math.min(255, Math.max(0, sum));
      }
      dst.data[(y * w + x) * 4 + 3] = 255;
    }
  }
  ctx.putImageData(dst, 0, 0);
};

upscaleSelect.onchange = () => {
  const factor = +upscaleSelect.value;
  if (!original) return;

  canvas.width = original.width * factor;
  canvas.height = original.height * factor;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

resetBtn.onclick = () => {
  if (!original) return;
  canvas.width = original.width;
  canvas.height = original.height;
  ctx.putImageData(original, 0, 0);
  brightness.value = 0;
  contrast.value = 0;
  upscaleSelect.value = 1;
};

downloadBtn.onclick = () => {
  const a = document.createElement("a");
  a.download = "PixelEase.png";
  a.href = canvas.toDataURL();
  a.click();
};
