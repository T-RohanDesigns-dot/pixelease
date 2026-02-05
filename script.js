const toggle = document.getElementById("themeToggle");

if(toggle){
toggle.onclick = () => {

if(document.body.classList.contains("dark")){
document.body.classList.replace("dark","light");
toggle.textContent="🌙";
}else{
document.body.classList.replace("light","dark");
toggle.textContent="☀️";
}

};
}


// Go tools
function goTools(){
window.location="tools/index.html";
}



// IMAGE TOOL
const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas?.getContext("2d");

let img = new Image();

if(upload){
upload.onchange = e => {
let file = e.target.files[0];
img.src = URL.createObjectURL(file);

img.onload = () => {
canvas.width = img.width;
canvas.height = img.height;
ctx.drawImage(img,0,0);
}
};
}


function applyFilter(){

let b = document.getElementById("bright").value;
let c = document.getElementById("contrast").value;

ctx.filter = `brightness(${100 + Number(b)}%) contrast(${100 + Number(c)}%)`;

ctx.drawImage(img,0,0);

ctx.filter="none";
}


function download(){

let link = document.createElement("a");
link.download="pixelease.png";
link.href=canvas.toDataURL();
link.click();

}
