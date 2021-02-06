import { getAttrText } from './modules/utils.js';

let url = '';
let pathArray = window.location.pathname.split( '/' );
pathArray =  pathArray.filter(path => path !== "");
if(pathArray.length) {
    //remove site.html
    pathArray.pop();
}
console.log(pathArray);

console.log(window.location.protocol);
if (window.location.protocol == "https:" && pathArray.length) {
    console.log("http");
    //remove /portfolio
    pathArray.pop();
}

for (let i = 0; i < pathArray.length; i++) {
    url += "../"
}

class customIcon extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.attributeObj = {
            fill : getAttrText('fill', this.attributes) || "black",
            width : getAttrText('width', this.attributes) || "var(--var-icon-size-m)",
            border : getAttrText('border', this.attributes) || "var(--var-border)",
            height : getAttrText('height', this.attributes) || "var(--var-icon-size-m)",
            icon : getAttrText('type', this.attributes) || "default",
            iconStyle : document.createElement('style'),
            img :  document.createElement('div'),
        }

        const duration = getAttrText('duration', this.attributes) || "5";
        const style = document.createElement('style');
        style.textContent = /*css*/`
            :host {
                font-size: inherit;
                letter-spacing: inherit;
                box-sizing: border-box;
                position: relative;
                display: block;
            }

            .spin {
                position: relative;
                display: grid;
                place-items: center;
                transform: rotate(0deg);
                animation: spin ${duration}s linear infinite;
                padding: 0;
            }

            .wrapper {
                width: ${this.attributeObj.width};
                height: ${this.attributeObj.height};
            }
            .border{
                width: calc(${this.attributeObj.width} - ${this.attributeObj.border * 2});
                height: calc(${this.attributeObj.height} - ${this.attributeObj.border * 2});
                border: ${this.attributeObj.border} solid ${this.attributeObj.fill};;
            }

            @keyframes spin {
                0% {
                    transform: rotate(0deg); 
                }
                100% {
                    transform: rotate(360deg); 
                }
            }
        `

        const animation = getAttrText('animation', this.attributes) || "";
        const animationArray = animation.split(" ");

        this.attributeObj.iconStyle.textContent = setIconStyle(this.attributeObj);
        this.attributeObj.img.className = "icon";
        for (let i = 0; i < animationArray.length; i++) {
            this.attributeObj.img.className += ` ${animationArray[i]}`;
        }

        const wrapper = document.createElement('div');
        wrapper.className = this.attributes.border ? "wraper border" : "wrapper";
        wrapper.appendChild(this.attributeObj.img) 

        this.shadowRoot.appendChild(this.attributeObj.iconStyle);      
        this.shadowRoot.appendChild(style);        
        this.shadowRoot.appendChild(wrapper);            
    }

    static get observedAttributes() {
        return ["type"];
      }
      
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'type':
                if(newValue !== null) {
                    this.attributeObj.icon = newValue;
                }
                this.attributeObj.iconStyle.textContent = setIconStyle(this.attributeObj)
                break;
        }
    }
}

function setIconStyle(attributes) {
    return /*css*/`
    .icon {
        position: relative;
        width:100%;
        height: 100%;
        background-color: ${attributes.fill};
        -webkit-mask: url(${url}assets/icons/${attributes.icon || "default" }.svg) center / contain no-repeat;
        mask: url(${url}assets/icons/${attributes.icon || "default" }.svg) center / contain no-repeat;
    }
`
}

customElements.define('custom-icon', customIcon);
