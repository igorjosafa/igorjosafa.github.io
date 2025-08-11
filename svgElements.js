class svgElements {
    constructor(elementClass, d) {
        this.svgNamespace = "http://www.w3.org/2000/svg";
        this.elementClass = elementClass;
        this.d = d;
    }

    createSvgElement() {
        const svgElement = document.createElementNS(this.svgNamespace, "svg");
        svgElement.setAttribute("width", "16");
        svgElement.setAttribute("height", "16");
        svgElement.setAttribute("fill", "currentColor");
        svgElement.setAttribute("class", this.elementClass);
        svgElement.setAttribute("viewBox", "0 0 16 16");

        const path = document.createElementNS(this.svgNamespace, "path");
        path.setAttribute("d", this.d);

        svgElement.appendChild(path);

        return svgElement;
    }
}

export { svgElements };