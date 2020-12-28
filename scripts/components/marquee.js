import { getAttrText, hasAttr } from './modules/utils.js';
class customMarquee extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        const height = getAttrText('height', this.attributes) || "var(--var-font-size-m)";
        const border = getAttrText('border', this.attributes) || "var(--var-border)";
        const animation = getAttrText('animation', this.attributes) || "";
        const repeat = hasAttr('repeat', this.attributes);

        const duration = getAttrText('duration', this.attributes) || "20";
        const style = document.createElement('style');
        style.textContent = /*css*/`
            :host {
                color: inherit;
                font-family: inherit;
                font-size: inherit;
                letter-spacing: inherit;

                box-sizing: border-box;

                width: 100%;
                position: relative;
            }

            :host.remove { 
                background-color: red;
            }

            .marquee {
                border-top: ${border} solid black;
                white-space: nowrap;
                height: ${height};
                overflow: hidden;
                position: relative;
                padding: var(--var-padding-s) 0;                                                                                                                             
            }

            .marquee-inner {
                display: inline-flex;
                height: 100%;
                line-height: ${height};
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

            .closeButton {
                position:  absolute;
                height: 100%;
                display: inline-grid;
                place-items: center;
                top: 0;
                right: var(--var-padding-m);

            }
            custom-button {

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

        const innerHTML =  [...this.children];
        console.log(innerHTML[innerHTML.length - 1].className.includes("closeButton"))
        let button;
        
        if(innerHTML[innerHTML.length - 1].className.includes("closeButton")){
            button = innerHTML[innerHTML.length - 1];

            const event = new Event('marquee-button-click');

            // Dispatch the event.

            innerHTML.pop();
            button.addEventListener("click", (e) => {
                console.log(e)
                e.preventDefault();
                this.dispatchEvent(event);
            })
        }
        const marquee = document.createElement('div');
        marquee.className = "marquee";
        const marqueeInner = document.createElement('div');
        marqueeInner.className = "marquee-inner";

        const animationArray = animation.split(" ");
        for (let i = 0; i < animationArray.length; i++) {
            marqueeInner.className  += ` ${animationArray[i]}`;
        }
        
        console.log(innerHTML);

        innerHTML.forEach(node => {
            marqueeInner.appendChild(node);        
        });

        if(repeat) {
            for (let i = 0; i < 10; i++) {
                marquee.appendChild(marqueeInner.cloneNode(true));        
            }
        } else {
            marquee.appendChild(marqueeInner);        
        }

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(marquee);
        
        if(button) {
            this.shadowRoot.appendChild(button);
        }

    }

    handleEvent(e) {
        console.log(e);
    }
}

customElements.define('custom-marquee', customMarquee);