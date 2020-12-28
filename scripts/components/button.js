import { getAttrText, getAttrObj } from './modules/utils.js';

class customButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        
        const style = document.createElement("style");
        style.textContent = /*css*/`
            :host {
                color: inherit;
                font-family: inherit;
                font-size: inherit;
                letter-spacing: inherit;
                box-sizing: border-box;
                display: inline-grid;
                place-items: center;
            }

            :host(.border) {
                border: 2px solid black;
            }

            button {
                margin: 0;
                padding: 0;
                border: none;
                outline: none;
                height: fit-content;
                width: fit-content;    
                
                font-family: inherit;
                font-size: inherit;
                letter-spacing: inherit;
                line-height: inherit;

                background-color: white;
                cursor: pointer;
            }
        `       

        const button = document.createElement('button');
        button.setAttribute("type", "button");
        button.innerHTML = this.innerHTML;


        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(button);

    }
}


customElements.define('custom-button', customButton);