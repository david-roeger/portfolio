import { constrain } from './components/modules/utils.js';


const container = document.querySelector(".container")
const smiley = document.querySelector(".loading");
const canvasContainer = document.querySelector(".canvas-container")
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const imageCount = document.querySelector(".count");
const imagePreview = document.querySelector(".preview");

const slider = document.querySelector('input[type="range"]');
const sliderMax = parseInt(slider.attributes.max.value);

window.addEventListener('resize', reload, false);

let controller;

let dimensions = {}

let xValue;
let yValue;

let frame;

let images = [];
let imageIndex = 0;
let imageCountMax = 7;
let imageScl = 3;
updateScale()
let local = true;
let initHandler = true;

/**
 * Canvas handling
 */
function reload() {
  if(controller) {
    controller.abort();
  }
  controller = new AbortController();

  dimensions.x = canvasContainer.offsetWidth;
  dimensions.y = canvasContainer.offsetHeight;
  canvasContainer.after(smiley);
  setPreview("");

  window.cancelAnimationFrame(frame);
  canvas.width = dimensions.x;
  canvas.height = dimensions.y;
  imageIndex = 0;

  updateImageDimensions();
  if(!local) {
    loadImages();
  } else if (!images.length || images[0].img.src.includes("https://images.unsplash.com")) {
    loadLocalImages();
  } else { 
    setHandler();
  }
}

reload();
canvasContainer.appendChild(canvas);

function updateImageDimensions() {
  images.forEach(image => {
    console.log(image);
    const ratio = scalePreserveAspectRatio(image.w, image.h, dimensions.x ,dimensions.y);
    console.log(ratio, imageScl);
    
    image.newWidth = image.w * ratio / imageScl;
    image.newHeight = image.h * ratio / imageScl;
  });
}

/**
 * init loading of Unsplash Images
 */
function loadImages() {
  images = [];
  initHandler = true;
  setCount(0);
  for (let i = 0; i < imageCountMax; i++) {
    requestImage(controller.signal);
  }
}

/**
 * Request individual Image from Unsplash
 * @param {signal} signal 
 */
function requestImage(signal) {
  const num = Math.floor(Math.random()* 10000);
  fetch(`https://source.unsplash.com/collection/789734/?sig=${num}`, {signal})
   .then(img => {
     if(!local){
      setImage(img.url);
     }
   }).catch((error) => {
     console.log(error);
   });
}

/**
 * Load local images
 */
function loadLocalImages() {
  images = [];
  initHandler = true;
  setCount(0);
  for (let i = 0; i < imageCountMax; i++) {
    setImage(`../assets/images/move/${i}.png`);
  }
}

/**
 * Process recieved image
 * @param {string} src image src
 */
function setImage(src) {
  let imageHtml = new Image();
  imageHtml.crossOrigin = "Anonymous";
  imageHtml.src = src;
  imageHtml.addEventListener("load", (e) => {
    console.log(images.length, imageCountMax)
    if(images.length < imageCountMax){
      try {
        for (let j = 0; j < images.length; j++) {
          if(imageHtml.src == images[j].img.src) {
            throw new Error("Duplicate");
          }
        }

        const ratio = scalePreserveAspectRatio(imageHtml.width, imageHtml.height, dimensions.x ,dimensions.y);
        images.push({
          img: imageHtml,
          w: imageHtml.width,
          h: imageHtml.height,
          newWidth: imageHtml.width * ratio / imageScl,
          newHeight: imageHtml.height * ratio / imageScl
        });

        setCount(images.length);

        if(initHandler) {
          initHandler = false;
          setHandler();
        }
      } catch (error) {
        console.log(error)
        if(!local){
          requestImage(controller.signal); 
        }
      }
    }
  });
}

/**
 * Update preview image
 * @param {string} src image url
 */
function setPreview(src) {
  imagePreview.style.backgroundImage =`url(${src})`;
}

/**
 * Update image count
 * @param {int} count image count
 */
function setCount(count) {
  imageCount.textContent = count;
}


/**
 * Event Handling
 */
let handler;
let motionTimeOut;
let trueMotion = false;
let update = false;
let play = true;

if (typeof DeviceOrientationEvent === 'undefined' || typeof DeviceOrientationEvent.requestPermission === 'function') {
  handler  = false;
} else {
  handler = true;
}

/**
 * Set Event Listener according to device
 */
function setHandler() {
  window.cancelAnimationFrame(frame);
  if(handler) {
    xValue = 30;
    yValue = 30;
    window.addEventListener('deviceorientation', (e) => orientationHandler(e));
    motionTimeOut = setTimeout(() => checkMotion(), 500);
  } else {
    xValue = dimensions.x / 2;
    yValue = dimensions.y / 2;
    window.addEventListener('mousemove', (e) => moveHandler(e));
    window.addEventListener('touchmove', (e) => touchHandler(e), {passive: true});
  }
  smiley.remove();
  setPreview(images[imageIndex].img.src);

  frame = window.requestAnimationFrame(updateImage);
}

function checkMotion() {
  if(!trueMotion){
    handler = false;
    setHandler();
  }
}

/**
 * Process Mouse Event data
 * @param {object} e event
 */
function moveHandler(e) {
  update = true;
  const windowOffset = window.innerWidth > 1920 ? (window.innerWidth -  1920) / 2 : 0;
  xValue = e.clientX - windowOffset;
  yValue = e.clientY;
}

/**
 * Process Touch Event data
 * @param {object} e event
 */
function touchHandler(e) {
  if(e.target === canvas){
    update = true;
    const windowOffset = window.innerWidth > 1920 ? (window.innerWidth -  1920) / 2 : 0;
    var touch = e.touches[0] || e.changedTouches[0];
    xValue = touch.pageX - windowOffset;
    yValue = touch.pageY;
  }
}

const minMax = {
  beta: {
    min: 0,
    max: 60,
    abs: 60
  },
  gamma: {
    min: 0,
    max: 60,
    abs: 60
  }
}

/**
 * Process Orientation Event data
 * @param {object} e event
 */
function orientationHandler(e) {
  if(e.alpha === null && e.beta === null && e.gamma === null) {
    handler = false;
    window.removeEventListener('deviceorientation',  (e) => orientationHandler(e));
    setHandler()
    return;
  }

  update = true;
  trueMotion = true;
  clearTimeout(motionTimeOut);

  //beta constrain -> 0 / 60  -> 0 / 60
  xValue = (e.gamma + 30);
  xValue = constrain(xValue, minMax.gamma.min, minMax.gamma.max)

  //gamma constrain -> -30 / 30  -> 0 / 60
  yValue = (e.beta);
  yValue = constrain(yValue, minMax.beta.min, minMax.beta.max);
}

/**
 * Draw image on canvas
 */
function updateImage() {
  if(update && play){
    let x, y;
    if(images[0]){
      const img = images[imageIndex];
      if(handler) {
        x = xValue / minMax.beta.abs * dimensions.x - img.newWidth / 2;
        y = yValue / minMax.gamma.abs * dimensions.y - img.newHeight / 2;
      } else {
        x = xValue - img.newWidth / 2;
        y = yValue - img.newHeight / 2;
      }

      ctx.drawImage(img.img, 0, 0, img.w, img.h, x, y, img.newWidth, img.newHeight);
    }
    update = false;
  }

  frame = requestAnimationFrame(updateImage);
}

/**
 * Buttons
 */
const downloadButton = document.getElementById("download");
downloadButton.addEventListener('click', () => {
  var dataURL = canvas.toDataURL('image/png');
  downloadButton.href = dataURL;
});

const deleteButton = document.getElementById("delete");
deleteButton.addEventListener('click', () => reload());

const playButton = document.getElementById("play");
playButton.addEventListener('click', (e) => togglePlay());
function togglePlay() {
  play = !play;
  if(play) {
    playButton.setAttribute("type", "pause");
  } else {
    playButton.setAttribute("type", "play");
  }
}

const nextButton = document.getElementById("next");
nextButton.addEventListener('click', (e) => setNext());
function setNext() {
  if(images.length){
    imageIndex ++;
    imageIndex = imageIndex%images.length;
    setPreview(images[imageIndex].img.src);
  }
}

function setPrevious() {
  if(images.length){
    if(!imageIndex){
      imageIndex = images.length -1;
    } else {
      imageIndex--;
      imageIndex = imageIndex%images.length;
    }
    setPreview(images[imageIndex].img.src);
  }
}

slider.addEventListener("input", (e) => updateScale());
function updateScale() {
  const sliderValue = slider.value;
  console.log(slider.attributes.max.value, sliderValue)
  imageScl = sliderMax + 1 - sliderValue;
  updateImageDimensions();
}

canvas.addEventListener("dblclick", (e) => {
  local = !local;
  reload();
})


/**
 * Keyboard Inputs
 */
window.addEventListener('keydown', (e) => {
  console.log(e.code);
  if(document.activeElement === slider) {
    document.activeElement.blur();
  }
  switch (e.code) {
    case "ArrowRight":
      setNext();
      break;
    case "ArrowLeft":
      setPrevious();
      break;
    case "ArrowUp":
      slider.value++;
      updateScale()
      break;
    case "ArrowDown":
      slider.value--;
      updateScale()
      break;
    case "Space":
      togglePlay();
      break;
    case "Escape":
    case "Backspace":
      reload();
    case "KeyQ": 
      local = !local;
      reload();
    default:
      break;
  }
});


/**
 * Helper function
 */

/**
 * @param {int} imgW initial Image width
 * @param {int} imgH initial Image height
 * @param {int} maxW max Image width
 * @param {int} maxH max Image height
 * @returns {int} Scale Value
 */
function scalePreserveAspectRatio(imgW, imgH, maxW, maxH){
  return (Math.min((maxW/imgW),(maxH/imgH)));
}