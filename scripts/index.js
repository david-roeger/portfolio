import { SessionStorage } from './components/modules/storage.js'

let sessionStorage = new SessionStorage;

const innerContainer = document.querySelector(".inner-container");
const marquee = document.querySelector("custom-marquee");
updateMarquee();

marquee.addEventListener("marquee-button-click", (e) => {
    sessionStorage.set("hide-marquee", true);
    updateMarquee();
});

function updateMarquee() {
    const hide = sessionStorage.get("hide-marquee")
    if(hide) {
        marquee.classList.add("hide");
        innerContainer.classList.add("full");
        
    } else {
        marquee.classList.remove("hide");
        innerContainer.classList.remove("full");
    }
    
}