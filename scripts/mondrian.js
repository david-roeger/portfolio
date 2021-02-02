const container = document.querySelector(".mondrian-container");
const colors = ["white", "white", "yellow", "blue", "red"];
let scl = 12;

function updateContainer() {
    container.innerHTML = "";
    container.setAttribute("style", `grid-template-columns: repeat(${scl}, 1fr); grid-template-rows: repeat(${scl}, 1fr);`)
}

let total = 16
function createElements() {
    const mondrianArray = [];
    
    for (let i = 0; i < Math.sqrt(total); i++) {
        for (let j = 0; j < Math.sqrt(total); j++) {
            let mondrianObj = updateMondrianElement();
            console.log(mondrianObj)
            mondrianArray.push(mondrianObj);
        }   
    }

    mondrianArray.forEach(mondrian => {
        container.appendChild(mondrian.element)
    });

}

function updateMondrianElement(mondrianElement, color, size) {
    mondrianElement = mondrianElement ? mondrianElement : document.createElement("div");
    color = color ? color : colors[Math.floor(Math.random() * 5)];
    size = size ? size : scl / Math.sqrt(total);
    console.log(size,scl / Math.sqrt(total));

    let mondrianObj = {
        element: mondrianElement,
        color: color,
        size: size
    }

    mondrianObj = setMondrianElement(mondrianObj);
    return mondrianObj;
}

function setMondrianElement(mondrianObj) {
    mondrianObj.element.classList.add("mondrian", mondrianObj.color);
    mondrianObj.element.setAttribute("style", ` grid-column: span ${9}; grid-row: span ${1};`);
    return mondrianObj;
}

//updateContainer();
//createElements();