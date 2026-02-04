const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const editor = document.getElementById("editor");

let img = new Image();
let originalData;

upload.onchange = e => {
  const file = e.target.files[0];
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img,0,0);
    originalData = ctx.getImageData(0,0,canvas.width,canvas.height);
    editor.classList.remove("hidden");
  };
};

function applyFilters() {
  let b = +brightness.value;
  let c = +contrast.value;
  let d = new ImageData(new Uint8ClampedArray(originalData.data), canvas.width, canvas.height);
  let factor = (259 * (c + 255)) / (255 * (259 - c));

  for (let i=0;i<d.data.length;i+=4){
    d.data[i] = factor*(d.data[i]-128)+128+b;
    d.data[i+1] = factor*(d.data[i+1]-128)+128+b;
    d.data[i+2] = factor*(d.data[i+2]-128)+128+b;
  }
  ctx.putImageData(d,0,0);
}

brightness.oninput = contrast.oninput = applyFilters;

document.getElementById("sharpen").onclick = () => {
  ctx.filter = "contrast(120%) saturate(110%)";
  ctx.drawImage(canvas,0,0);
  ctx.filter = "none";
};

document.getElementById("denoise").onclick = () => {
  ctx.filter = "blur(0.6px)";
  ctx.drawImage(canvas,0,0);
  ctx.filter = "none";
};

document.getElementById("reset").onclick = () => {
  ctx.putImageData(originalData,0,0);
};

document.getElementById("download").onclick = () => {
  const a = document.createElement("a");
  a.download = "PixelEase_Enhanced.png";
  a.href = canvas.toDataURL();
  a.click();
};
