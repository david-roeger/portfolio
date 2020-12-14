class customMarquee extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        const height = getAttrText('height', this.attributes) || "3";
        const border = getAttrText('border', this.attributes) || "2";
        const animation = getAttrText('animation', this.attributes) || "";
        const repeat = getAttrText('repeat', this.attributes) || false;

        const duration = getAttrText('duration', this.attributes) || "20";
        const style = document.createElement('style');
        style.textContent = /*css*/`
            :host {
                color: inherit;
                font-family: inherit;
                font-size: inherit;
                letter-spacing: inherit;

                box-sizing: border-box;
            }

            .marquee {
                border-top: ${border}px solid black;
                white-space: nowrap;
                height: ${height}rem;
                overflow: hidden;                                                                                                                                        
            }

            .marquee-inner {
                display: inline-flex;
                height: 100%;
                line-height: ${height}rem;
                transform: translateX(0);
            }

            .marquee-inner.move {
                animation: move ${duration}s linear infinite;
            }

            .marquee-inner > * {
                padding: 0 0.5ch;
            }
 
            .marquee-inner span:first-of-type {
                padding-left: 2ch;
            }
            .marquee-inner span:last-of-type {
                padding-right: 2ch;
            }

            custom-icon {
                display: inline-grid;
                place-items: center;
            }

            @keyframes move {
                0% {
                    transform: translateX(0); 
                }
                100% {
                    transform: translateX(-100%); 
                }
            }
        `       

        const marquee = document.createElement('div');
        marquee.className = "marquee";
        const marqueeInner = document.createElement('div');
        marqueeInner.className = "marquee-inner";

        const animationArray = animation.split(" ");
        for (let i = 0; i < animationArray.length; i++) {
            marqueeInner.className  += ` ${animationArray[i]}`;
        }

        marqueeInner.innerHTML = `       
            ${this.innerHTML}
        `
        if(repeat) {
            for (let i = 0; i < 10; i++) {
                marquee.appendChild(marqueeInner.cloneNode(true));        
            }
        } else {
            marquee.appendChild(marqueeInner.cloneNode(true));        
        }

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(marquee);

    }
}

function getAttrText(attrToFind, attrList) {
    for (let i = 0; i < attrList.length; i++) {
        const attr = attrList[i];
        if(attr.name === attrToFind) {
            return attr.textContent;  
        }
    }
    return undefined;
};

customElements.define('custom-marquee', customMarquee);