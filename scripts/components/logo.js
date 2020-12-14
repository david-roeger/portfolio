import {map, constrain } from './modules/utils.js';

class customFace extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        
        const href = getAttrText('href', this.attributes) || "../";
        const title = getAttrText('title', this.attributes) || "index";

        const style = document.createElement('style');
        style.textContent = /*css*/`
            :host {
                font-size: inherit;
                letter-spacing: inherit;
                box-sizing: border-box;
                position: relative;
                display: block;
            }

            .logo {
                position: relative;
                display: grid;
                place-items: center;
                transform: rotate(0deg);
                padding: 0;
                height: fit-content;
                width: fit-content;
            }

            .logo > * {
                transform: rotate(0deg);
                transition: transform 0.15s linear;
            }
            
            .logo:hover > *,            
            .logo:active > *,
            .logo:focus > * {
                outline: none;
            }
        `

        const logo = document.createElement("a");
        logo.href = href;
        logo.title = title;
        logo.classList.add("logo");
        console.log(this.innerHTML);
        logo.innerHTML = /*html*/`
            ${this.innerHTML}
        `
        this.shadowRoot.appendChild(style);        
        this.shadowRoot.appendChild(logo);

        const icon =  this.shadowRoot.querySelector('custom-icon')
                
        /**
         * Event Handling
         */
        let handler;
        let motionTimeOut;
        let frame;
        let xValue = 0;
        let yValue = 0;
        let trueMotion = false;
        let update = false;

        if (typeof DeviceOrientationEvent === 'undefined' || typeof DeviceOrientationEvent.requestPermission === 'function') {
        handler  = false;
        } else {
        handler = true;
        }

        /**
         * Set Event Listener according to device
         */
        function setHandler() {
            console.log(window);
            window.cancelAnimationFrame(frame);
            if(handler) {
                xValue = 30;
                yValue = 30;
                window.addEventListener('deviceorientation', (e) => orientationHandler(e));
                motionTimeOut = setTimeout(() => checkMotion(), 500);
            } else {
                window.addEventListener('mousemove', (e) => moveHandler(e));
                window.addEventListener('touchmove', (e) => touchHandler(e), {passive: true});
            }
            frame = window.requestAnimationFrame(updateImage);
        }
        setHandler();

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
            xValue = e.clientX;
            xValue = map(xValue, 0, window.innerWidth, gamma.min, gamma.max)
        }

        /**
        * Process Touch Event data
        * @param {object} e event
        */
        function touchHandler(e) {
            update = true;
            var touch = e.touches[0] || e.changedTouches[0];
            xValue = touch.pageX;
            xValue = map(xValue, 0, window.innerWidth, gamma.min, gamma.max)
        }

        const gamma = {
            min: -30,
            max: 30,
            abs: 60
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

            //beta constrain -> -30 / 30  -> -45 / 45
            xValue = (e.gamma);
            xValue = constrain(xValue, gamma.min, gamma.max);
        }

        /**
        * Draw image on canvas
        */
        function updateImage() {
        if(update){
            icon.style.transform = `
                rotate(${xValue * -1}deg)
            `
            update = false;
        }

        frame = requestAnimationFrame(updateImage);
        }
    }
}

customElements.define('custom-face', customFace);


/**
 * return text value from attribute
 * @param {string} attrToFind missing attr
 * @param {array} attrList list of attributes
 */
function getAttrText(attrToFind, attrList) {
    attrList = [...attrList];
    for (let i = 0; i < attrList.length; i++) {
        const attr = attrList[i];
        if(attr.name === attrToFind) {
            return attr.textContent;
        }
    }
    return undefined;
}