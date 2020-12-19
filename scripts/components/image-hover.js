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
                overflow: visible;
            }

            a {
                z-index: 2;
                display: block;
                color: inherit;
                line-height: 3rem;
                text-align: center;
                user-select: none;
            }

            a:first-of-type {
                padding-top: 0.5rem;
            }
            
            a:last-of-type {
                padding-bottom: 0.5rem;
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
        `

        const inner = document.createElement('div');
        inner.innerHTML = this.innerHTML;
        inner.classList.add("inner-container");

        this.shadowRoot.appendChild(style);      

        const hoverImage = document.querySelector(".hover-image");
        let randomOffset = 0;

        if(inner.children.length){
            console.log(hoverImage);
            for (let i = 0; i < inner.children.length; i++) {
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
                const windowOffset = window.innerWidth > 1920 ? (window.innerWidth -  1920) / 2 : 0;
                console.log(window.innerWidth, windowOffset);
                hoverImage.style.left = `${touch.pageX - (hoverImage.offsetWidth / 2) - windowOffset}px`;
                hoverImage.style.top = `${touch.pageY - (hoverImage.offsetHeight / 2)}px`;
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
                hoverImage.offsetHeight
                console.log(window.innerWidth, windowOffset);
                const windowOffset = window.innerWidth > 1920 ? (window.innerWidth -  1920) / 2 : 0;
                hoverImage.style.left = `${e.clientX - (hoverImage.offsetWidth / 2) - windowOffset}px`;
                hoverImage.style.top = `${e.clientY - (hoverImage.offsetHeight / 2)}px`;
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