export default class Line {

    constructor(parent, tag) {
        this.element = document.createElement(tag || "div");
        this.parent = parent;
    }

    set parent(node) {
        this.element.remove();
        if(node != null) {
            node.appendChild(this.element);
            return node;
        }
    }
}