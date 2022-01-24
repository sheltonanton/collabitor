/**
 * should use this class to add component behaviour the the class extending
 * should have render method or else checks for template to render with the model supplied
 * element creation can also happen within initialize hook
 * element update can happen inside the render hook, which gets called whenever the model registered with the
 */

import Model, { ModelObserver } from "./model";

const Component = (() => {
    let allowInstantiation = false;

    class Component extends ModelObserver {
        constructor(props) {
            if(!allowInstantiation) {
                throw new Error("Component cannot be initialized with new operator anywhere");
            }
            super();
            this.props = props;
        }

        static show(props) {
            if(props !== undefined && (Array.isArray(props) || typeof props !== "object")) {
                throw new Error(props, " should be a valid property object");
            }

            // all values should be of either Model or Attribute or is considered a constant
            allowInstantiation = true;
            const ConcreteComponent = this;
            if(ConcreteComponent === Component) {
                throw new Error("Component class cannot be called with show method");
            }

            const component = new ConcreteComponent(props);
            return component;
        }

        nest(...components) {
            if(components === null || components === undefined || components.length === 0) {
                throw new Error("specify a valid nested component within nest function");
            }

            components.forEach(component => {
                if(component.__proto__ === Component.prototype) {
                    throw new Error("Cannot pass Component object itself");
                }

                if(!(component instanceof Component)) {
                    throw new Error("components should be objects of Component");
                }
            });

            this._nest = components;
            return this;
        }
    }

    return Component;
})();

export default Component;