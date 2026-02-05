const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let originalImage = null;
let img = new Image();

let brightness = 0;
let contrast = 0;

upload.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0);
      originalImage = ctx.getImageData(0,0,canvas.width,canvas.height);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
};

function applyBasic() {
  if (!originalImage) return;
  const data = new ImageData(
    new Uint8ClampedArray(originalImage.data),
    originalImage.width,
    originalImage.height
  );

  const b = brightness;
  const c = (contrast + 100) / 100;

  for (let i=0;i<data.data.length;i+=4){
    for (let j=0;j<3;j++){
      let v = data.data[i+j];
      v = v + b;
      v = (v - 128) * c + 128;
      data.data[i+j] = Math.max(0,Math.min(255,v));
    }
  }

  ctx.putImageData(data,0,0);
}

document.getElementById("brightness").oninput = e=>{
  brightness = +e.target.value;
  applyBasic();
};
document.getElementById("contrast").oninput = e=>{
  contrast = +e.target.value;
  applyBasic();
};

document.getElementById("sharpen").onclick = ()=>{
  const w = canvas.width, h = canvas.height;
  const src = ctx.getImageData(0,0,w,h);
  const out = ctx.createImageData(w,h);

  const k = [0,-1,0,-1,5,-1,0,-1,0];

  for(let y=1;y<h-1;y++){
    for(let x=1;x<w-1;x++){
      let r=0,g=0,b=0;
      let idx=0;

      for(let ky=-1;ky<=1;ky++){
        for(let kx=-1;kx<=1;kx++){
          const p=((y+ky)*w+(x+kx))*4;
          r+=src.data[p]*k[idx];
          g+=src.data[p+1]*k[idx];
          b+=src.data[p+2]*k[idx];
          idx++;
        }
      }

      const o=(y*w+x)*4;
      out.data[o]=Math.min(255,Math.max(0,r));
      out.data[o+1]=Math.min(255,Math.max(0,g));
      out.data[o+2]=Math.min(255,Math.max(0,b));
      out.data[o+3]=src.data[o+3]; // ⭐ ALPHA SAFE
    }
  }

  ctx.putImageData(out,0,0);
};

document.getElementById("noise").onclick = ()=>{
  ctx.globalAlpha = 0.35;
  ctx.drawImage(canvas,0,0);
  ctx.globalAlpha = 1;
};

document.getElementById("upscale").onchange = e=>{
  const scale = +e.target.value;
  if (!originalImage) return;

  const tmp = document.createElement("canvas");
  tmp.width = originalImage.width;
  tmp.height = originalImage.height;
  tmp.getContext("2d").putImageData(originalImage,0,0);

  canvas.width = tmp.width * scale;
  canvas.height = tmp.height * scale;

  ctx.imageSmoothingEnabled = false; // 🔥 sharp upscale
  ctx.drawImage(tmp,0,0,canvas.width,canvas.height);
};

document.getElementById("reset").onclick = ()=>{
  if(!originalImage) return;
  canvas.width = originalImage.width;
  canvas.height = originalImage.height;
  ctx.putImageData(originalImage,0,0);
};

document.getElementById("download").onclick = ()=>{
  const a=document.createElement("a");
  a.download="pixelease.png";
  a.href=canvas.toDataURL("image/png");
  a.click();
};
