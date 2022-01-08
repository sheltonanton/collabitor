import Model from "./model";
import {
    Observer
} from "./observer";

const View = (() => {
    class View extends Observer {
        constructor(props) {
            super();
            this._props = props || {};
            Object.values(this._props).forEach(value => {
                if(value instanceof Subject) {
                    value.subscribe(this);
                }
            });
        }

        getModel() {
            const props = this._props;
            if(this.hasOwnProperty("model")) {
                const model = this.model(props);
                if(model instanceof Model) {
                    return model;
                }else if(model !== null && model !== undefined) {
                    return Model.new(model);
                }else {
                    return Model.new(props);
                }
            }
        }

        renderTree() {
            const renderTree = [];

            function r(viewExp, ...args) {
                if(viewExp === View || View.isPrototypeOf(viewExp)) {
                    const view = new View(args);
                    renderTree.push(view);
                }
            }

            this.render(r);

            return renderTree;
        }

        update() {
            this.renderTree();
        }

        render() {

        }
    }

    return View;
})();

export default View;
