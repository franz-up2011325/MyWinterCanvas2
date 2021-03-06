
import rnd from './mulberry32.js';
const FLAKE_COUNT = 1000;
const MAX_FLAKE_SIZE = 5;
const MAX_SY = 1.5;
const MIN_SY = 0.5;
const MAX_SX = 0.5;


const flakes = [];          //Flakes are stored in this array.
const settledFlakes = [];

let c;
let logo;
let groundY;
let canvasH;


function drawCabin(x, y) {

    c.strokeStyle = "white";
    c.lineWidth = 4;

    //wall
    c.fillStyle = "#840";
    c.fillRect(x, y, 200, -100);
    c.beginPath();

    //door
    c.fillStyle = "red";
    c.fillRect(x + 120, y, 50, -80);
    c.moveTo(x + 120, y);
    c.lineTo(x + 120, y - 80);
    c.lineTo(x + 170, y - 80);
    c.lineTo(x + 170, y);
    c.stroke();


    //window
    c.fillStyle = "#444";
    c.fillRect(x + 30, y - 30, 50, -50);

    //window frame
    c.beginPath();
    c.rect(x + 30, y - 30, 50, -50);
    c.moveTo(x + 30, y - 55);
    c.lineTo(x + 30 + 50, y - 55);
    c.moveTo(x + 55, y - 30);
    c.lineTo(x + 55, y - 80);
    c.stroke();

    //roof
    c.fillStyle = "#444";
    c.beginPath();
    c.moveTo(x - 20, y - 100);
    c.lineTo(x + 220, y - 100);
    c.lineTo(x + 190, y - 140);
    c.lineTo(x + 10, y - 140);
    c.fill();
}

function treeTriangle(x, y, w, h) {

    const gradient = c.createLinearGradient(x, y - h, x + w / 2, y);
    gradient.addColorStop(0, '#070');
    gradient.addColorStop(1, '#050');
    c.fillStyle = gradient;


    c.beginPath();
    c.moveTo(x - w / 2, y);
    c.lineTo(x + w / 2, y);
    c.lineTo(x, y - h);
    c.fill();
}

function drawTree(x, y, h) {
    const trunkW = h / 10;
    const crownW = h / 2;
    const crownY = y - h / 6;

    const step = h * 5 / 18;


    //trunk
    c.fillStyle = "#420";
    c.fillRect(x - trunkW / 2, y, trunkW, -h / 2);

    //leaves
    treeTriangle(x, crownY, crownW, step * 2);
    treeTriangle(x, crownY - step, crownW * 0.8, step * 1.8);
    treeTriangle(x, crownY - step * 2, crownW * 0.6, step);

}

function drawLandscape() {

    //ground
    c.fillStyle = "#342";
    c.fillRect(0, groundY, 800, c.canvas.height);

    drawCabin(200, groundY);
    drawTree(100, groundY, 200);
    drawTree(470, groundY, 180);
    drawTree(580, groundY, 120);
    drawTree(700, groundY, 300);
}

function prepareLogo() {
    const localLogo = new Image();      //This makes a new image object
    localLogo.src = "uop-linear.png";

    localLogo.addEventListener("load", () => {
        logo = localLogo;
        const scale = 200 / logo.width;
        logo.scaledW = scale * logo.width;
        logo.scaledH = scale * logo.height;
    });
}

function drawLogo() {
    if (logo) {
        const scale = 200 / logo.width;
        c.drawImage(logo, 50, 50, logo.scaledW, logo.scaledH);
    }
}

function drawFlake(flake) {
    const { x, y, size } = flake;
    c.fillStyle = "#fffb";
    c.beginPath();
    c.ellipse(x, y, size / 2, size / 2, 0, 0, 7);
    c.fill();
}

function drawSnow() {
    for (const flake of flakes) {
        drawFlake(flake);
    }
}

function createNewFlake(yRange = 0) {
    const x = rnd() * 800;
    const y = rnd() * yRange;
    const size = rnd() * MAX_FLAKE_SIZE + 1;
    const sy = rnd() * (MAX_SY - MIN_SY) + MIN_SY;
    const sx = (rnd() * 2 - 1) * MAX_SX;
    return { x, y, size, sy, sx };
}

function initSnow() {
    for (let i = 0; i < FLAKE_COUNT; i += 1) {
        const flake = createNewFlake(-canvasH);
        flakes.push(flake);
    }
}

// function isTransparent(x, y) {
//     const pixelData = c.getImageData(x * scale, y * scale, 1, 1).data;
//     return pixelData[3] < 250;
// }

function moveFlake(flake) {
    flake.y += flake.sy;
    flake.x += flake.sx;
    flake.x = (flake.x + 800) % 800;
}

function isOutOfBounds(flake) {
    return flake.y > canvasH;
}

function moveSnow() {
    for (let i = 0; i < flakes.length; i += 1) {
        const flake = flakes[i];
        moveFlake(flake);
        if (isOutOfBounds(flake)) {
            flakes[i] = createNewFlake();
        }
    }
}

// function drawSettledSnow() {
//     for (const flake of settledFlakes)
//     drawFlake(flake);
// }

function animate() {
    c.clearRect(0, 0, 800, canvasH);
    drawLandscape();
    drawLogo();
    // drawSettledSnow();
    moveSnow();
    drawSnow();

    window.requestAnimationFrame(animate);
}


function init() {
    const canvas = document.querySelector("canvas");
    c = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scale = window.innerWidth / 800;
    c.scale(scale, scale);

    canvasH = window.innerHeight / scale;
    groundY = canvasH * 0.9;
    initSnow();

    prepareLogo();

    animate();
}


window.addEventListener('load', init);
