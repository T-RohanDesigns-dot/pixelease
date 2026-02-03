const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
  img.src = URL.createObjectURL(file);
});
function increaseBrightness() {
  adjustBrightness(10);
}

function decreaseBrightness() {
  adjustBrightness(-10);
}

function adjustBrightness(value) {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] += value;     // R
    data[i + 1] += value; // G
    data[i + 2] += value; // B
  }
  ctx.putImageData(imgData, 0, 0);
}

function sharpenImage() {
  ctx.filter = "contrast(120%) saturate(110%)";
  ctx.drawImage(canvas, 0, 0);
  ctx.filter = "none";
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = "pixelease.png";
  link.href = canvas.toDataURL();
  link.click();
}
function cropCenter() {
  const w = canvas.width;
  const h = canvas.height;
  const size = Math.min(w, h);

  const imageData = ctx.getImageData(
    (w - size) / 2,
    (h - size) / 2,
    size,
    size
  );

  canvas.width = size;
  canvas.height = size;
  ctx.putImageData(imageData, 0, 0);
}

function resizeImage() {
  const tempCanvas = document.createElement("canvas");
  const tctx = tempCanvas.getContext("2d");

  tempCanvas.width = canvas.width * 0.5;
  tempCanvas.height = canvas.height * 0.5;

  tctx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

  canvas.width = tempCanvas.width;
  canvas.height = tempCanvas.height;
  ctx.drawImage(tempCanvas, 0, 0);
}
