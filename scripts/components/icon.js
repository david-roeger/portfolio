let url = '';
const pathArray = window.location.pathname.split( '/' );
if(pathArray[1] && pathArray[1].includes('~')) {
    url += `/${pathArray[1]}`
}

class customIcon extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.attributeObj = {
            fill : getAttrText('fill', this.attributes) || "black",
            width : getAttrText('width', this.attributes) || "2",
            border : getAttrText('border', this.attributes) || "0",
            height : getAttrText('height', this.attributes) || "2",
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
                width: ${this.attributeObj.width}rem;
                height: ${this.attributeObj.height}rem;
            }
            .border{
                width: calc(${this.attributeObj.width}rem - ${this.attributeObj.border * 2}px);
                height: calc(${this.attributeObj.height}rem - ${this.attributeObj.border * 2}px);
                border: ${this.attributeObj.border}px solid ${this.attributeObj.fill};;
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
        -webkit-mask: url(${url}/assets/icons/${attributes.icon || "default" }.svg) center / contain no-repeat;
        mask: url(${url}/assets/icons/${attributes.icon || "default" }.svg) center / contain no-repeat;
    }
`
}

function getAttrText(attrToFind, attrList) {
    attrList = [...attrList];
    for (let i = 0; i < attrList.length; i++) {
        const attr = attrList[i];
        if(attr.name === attrToFind) {
            return attr.textContent;
        }
    }
    return undefined;
};

customElements.define('custom-icon', customIcon);
