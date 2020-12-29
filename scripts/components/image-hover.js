import { hasAttr } from './modules/utils.js';
import { map } from './modules/utils.js';
class customImageHover extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        const offset = hasAttr('offset', this.attributes);
        
        const style = document.createElement('style');
        style.textContent = /*css*/`
            :host {
                font-size: inherit;
                letter-spacing: inherit;
                box-sizing: border-box;
                line-height: inherit;
                color: inherit;
                position: relative;
                display: block;
                height: auto;
                overflow: visible;
            }

            a {
                z-index: 2;
                display: block;
                color: inherit;
                text-align: left;
                padding: 0 var(--var-padding-m);
                user-select: none;
                border-bottom: var(--var-border) solid currentColor;
            }

            a:first-of-type {
                border-top: 2px solid currentColor;
            }
            
            
            a,
            a:hover > *,            
            a:active > *,
            a:focus > * {
                text-decoration: none;
                outline: none;
            }

            a:hover,
            a:active {
                font-style: italic;
            }

            .inner-container {
                position: relative;
            }
        `

        const inner = document.createElement('div');
        inner.innerHTML = this.innerHTML;
        inner.classList.add("inner-container");

        this.shadowRoot.appendChild(style);      

        const hoverImage = document.querySelector(".hover-image");

        if(inner.children.length){
            for (let i = 0; i < inner.children.length; i++) {
                const link = inner.children[i];
                link.addEventListener("mouseenter", (e) => {
                    hoverImage.style.backgroundImage = `url(${link.attributes["hover-image"]?.value || ""})`;
                    console.log(link);
                })
            }
        }


        this.shadowRoot.appendChild(inner);
        if(hoverImage){
            inner.addEventListener("touchstart", (e)  => {
                let touch = e.touches[0] || e.changedTouches[0];
                setHoverImagePos(touch.pageX, touch.pageY);
                if(e.path[0] instanceof HTMLAnchorElement){
                    hoverImage.style.backgroundImage = `url(${e.path[0].attributes["hover-image"]?.value || ""})`;
                    console.log(e.path[0]);
                }
            }, {passive: true});

            inner.addEventListener("touchcancel", (e)  => {
                hoverImage.style.backgroundImage = "";
            }, {passive: true});

            inner.addEventListener("mousemove", (e) => {
                setHoverImagePos(e.clientX, e.clientY);
            })

            inner.addEventListener("mouseleave", (e) => {
                hoverImage.style.backgroundImage = "";
            });

            document.addEventListener("click", () => {
                hoverImage.style.backgroundImage = "";

            });
        }

        function setHoverImagePos(x, y) {
            const windowOffset = window.innerWidth > 1924 ? (window.innerWidth -  1924) / 2 : 0;
            const xOffParam = window.innerWidth > 622 ? 4 : 2;
            console.log(xOffParam);
            const xOff = offset ? map(x, windowOffset, window.innerWidth - windowOffset, windowOffset + (window.innerWidth - windowOffset) / xOffParam,  window.innerWidth - windowOffset * 2) : x;
            hoverImage.style.left = `${xOff - (hoverImage.offsetWidth / 2)}px`;
            hoverImage.style.top = `${y - (hoverImage.offsetHeight / 2)}px`;
        }
    }
}

customElements.define('custom-image-hover', customImageHover);