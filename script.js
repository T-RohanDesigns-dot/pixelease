let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let img = new Image();

document.getElementById("upload").onchange = e => {
let file = e.target.files[0];
let reader = new FileReader();

reader.onload = function(ev){
img.onload = () => {
canvas.width = img.width;
canvas.height = img.height;
ctx.drawImage(img,0,0);
}
img.src = ev.target.result;
}
reader.readAsDataURL(file);
};

function applyFilters(){
let bright = document.getElementById("brightness").value;
let contrast = document.getElementById("contrast").value;

ctx.filter = `brightness(${100 + Number(bright)}%) contrast(${100 + Number(contrast)}%)`;
ctx.drawImage(img,0,0);
}

document.getElementById("brightness").oninput = applyFilters;
document.getElementById("contrast").oninput = applyFilters;

function sharpen(){
ctx.filter = "contrast(120%)";
ctx.drawImage(canvas,0,0);
}

function noise(){
ctx.filter = "blur(0.5px)";
ctx.drawImage(canvas,0,0);
}

function upscale(){
let scale = document.getElementById("scale").value;
canvas.width = img.width * scale;
canvas.height = img.height * scale;
ctx.drawImage(img,0,0,canvas.width,canvas.height);
}

function resetImage(){
canvas.width = img.width;
canvas.height = img.height;
ctx.filter="none";
ctx.drawImage(img,0,0);
}

function download(){
let link = document.createElement("a");
link.download = "pixelease.png";
link.href = canvas.toDataURL();
link.click();
}
const toggle = document.getElementById("themeToggle");

toggle.onclick = () => {

  if(document.body.classList.contains("dark")){
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    toggle.textContent = "🌙";
  }
  else{
    document.body.classList.add("dark");
    document.body.classList.remove("light");
    toggle.textContent = "☀️";
  }

};
