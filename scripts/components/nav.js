class customNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        const style = document.createElement('style');
        style.textContent = /*css*/`
            :host {
                color: inherit;
                font-family: inherit;
                font-size: inherit;
                letter-spacing: inherit;
                box-sizing: border-box;

            }

            nav {
                                                                                                                                          
            }
        `       

        const nav = document.createElement('nav');
        nav.innerHTML = this.innerHTML

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(nav);

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

customElements.define('custom-nav', customNav);