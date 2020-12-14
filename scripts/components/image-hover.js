import { constrain } from './modules/utils.js';


const images = [];

class customImageHover extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        
        const style = document.createElement('style');
        style.textContent = /*css*/`
            :host {
                font-size: inherit;
                letter-spacing: inherit;
                box-sizing: border-box;
                color: inherit;
                position: relative;
                display: block;
                height: auto;
            }

            a {
                z-index: 2;
                display: block;
                color: inherit;
                line-height: 3rem;
                text-align: center;
                user-select: none;
            }

            .logo > * {
                transform: rotate(0deg);
                transition: transform 0.15s linear;
            }
            
            a,
            a:hover > *,            
            a:active > *,
            a:focus > * {
                text-decoration: none;
                outline: none;
            }

            .inner-container {
                position: relative;

            }

            .hover-image {
                content: "";
                z-index: -1;
                position: absolute;
                top: 0;
                left: 0;
                width: 120%;
                height: 120%;
                background-color: transparent;
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center center;
            }
        `

        const inner = document.createElement('div');
        inner.innerHTML = this.innerHTML;
        inner.classList.add("inner-container");

        this.shadowRoot.appendChild(style);      
        
        let hoverImage;
        let randomOffset = 0;

        if(inner.children.length){
            hoverImage = inner.children[inner.children.length - 1];
            console.log(hoverImage);
            for (let i = 0; i < inner.children.length - 1; i++) {
                const link = inner.children[i];
                link.addEventListener("mouseenter", (e) => {
                    hoverImage.style.backgroundImage = `url(${link.attributes["hover-image"]?.value || ""})`;
                })
            }
        }


        this.shadowRoot.appendChild(inner);
        if(hoverImage){
            inner.addEventListener("touchstart", (e)  => {
                console.log(e.path[0]);
                var touch = e.touches[0] || e.changedTouches[0];
                hoverImage.style.left = `${(touch.pageX - (window.innerWidth - inner.offsetWidth) / 2) - (hoverImage.offsetWidth / 2)}px`;
                hoverImage.style.top = `${(touch.pageY - (window.innerHeight - inner.offsetHeight) / 2) - (hoverImage.offsetHeight / 2)}px`;
                console.log(e, e.clientX);
                if(e.path[0] instanceof HTMLAnchorElement){
                    hoverImage.style.backgroundImage = `url(${e.path[0].attributes["hover-image"]?.value || ""})`;
                }
            }, {passive: true});


            inner.addEventListener("touchcancel", (e)  => {
                hoverImage.style.backgroundImage = "";
            }, {passive: true});

            inner.addEventListener("mousemove", (e) => {
                hoverImage.offsetWidth;
                hoverImage.offsetHeight;
                hoverImage.style.left = `${(e.clientX - (window.innerWidth - inner.offsetWidth) / 2) - (hoverImage.offsetWidth / 2)}px`;
                hoverImage.style.top = `${(e.clientY - (window.innerHeight - inner.offsetHeight) / 2) - (hoverImage.offsetHeight / 2)}px`;
            })

            inner.addEventListener("mouseleave", (e) => {
                hoverImage.style.backgroundImage = "";
            });

            document.addEventListener("click", () => {
                hoverImage.style.backgroundImage = "";

            });
        }
    }
}

customElements.define('custom-image-hover', customImageHover);


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