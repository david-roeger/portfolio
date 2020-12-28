
import { getAttrText } from './modules/utils.js';
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
                width: fit-content;
                height: fit-content;                                                                                                                           
            }

            nav:hover {
                cursor: pointer;
            }
        `       

        const nav = document.createElement('nav');
        nav.innerHTML = this.innerHTML

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(nav);

    }
}

customElements.define('custom-nav', customNav);