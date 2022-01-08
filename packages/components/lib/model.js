/**
 * Requirements - the new model should use Model.extend() to create a class Object for model
 * new Model with properties (mapping with attributes to its values) should create a new instance of the extended model
 * deleting property on this object is not allowed
 * defining property on this object is not allowed
 * Model.extend(name, [object]) - argument should be object
 * object has listen and remove listener to add or remove listeners to the model object
 * ModelObserver is to be extended and handle ui changes in update() hook after calling modelObject.listen(this)
 * callback function could be also passed as argument to listen
*/

import { Subject, Observer } from './observer';

const Model = (() => {
    let blockInstantiation = true;

    class ModelSubject extends Subject {
        listen(listener) {
            if(listener instanceof ModelObserver) {
                this.subscribe(listener);
                return listener;
            }else if(typeof listener === "function") {
                const modelObserver = new ModelObserver(listener);
                this.subscribe(modelObserver);
                return modelObserver;
            }else{
                throw new Error(`${listener} should be a valid function or a ModelObserver`);
            }
        }
    }

    class Attribute extends ModelSubject {
        #value = null;
        constructor(value) {
            super();
            this.#value = value;
        }

        getValue() {
            return this.#value;
        }

        setValue(value) {
            this.#value = value;
        }
    }

    class Model extends ModelSubject {
        constructor(name, attributes, ...values) {
            super();
            if(blockInstantiation) {
                throw new Error("Cannot intantiate the Model directly, use new Model.extend()");
            }

            if(values != null) {
                const validObjects = values.every(value => typeof value === "object");
                if(! validObjects) {
                    throw new Error("all arguments in constructor should be a valid object");
                }

                values = Object.assign({}, ...values);
            }else{
                values = {};
            }

            Object.keys(values).forEach(key => {
                const value = values[key];
                if(value instanceof Model) {
                    values[key] = value;
                }else if(typeof value === "object") {
                    values[key] = Model.new(value);
                }else {
                    values[key] = new Attribute(value);
                }
            });

            this._values = values;
            this._attributes = attributes;
            this._name = name;
        }

        static new(values, name, attributes) {
            name = name || "model";
            attributes = attributes || {};
            const ExtendedModel = Model.extend(name, attributes);
            const model = new ExtendedModel(values);
            return model;
        }

        get(attributeName) {
            if(this._values.hasOwnProperty(attributeName)) {
                const attribute = this._values[attributeName];
                return attribute.getValue();
            }else{
                return null;
            }
        }

        removeListener(listener) {
            return this.unsubscribe(listener);
        }
    
        static extend(name, attributes) {
            if(typeof attributes !== "object" || attributes === null) {
                throw new Error("Not a valid object extension");
            }
            attributes = Object.assign({}, attributes);
            
            const objectHandlers = {
                _getModel: function() {
                    return `Model<${name}>`;
                },
                _getProperty: function(property) {
                    return `property<'${property}'>`;
                },
                get: function(target, property) {
                    if(target[property]) {
                        return target[property];
                    }

                    if(! target._values[property]) {
                        target._values[property] = new Attribute();
                    }
                    return target._values[property];
                },
                set: function(target, property, value) {
                    if(target[property]) {
                        throw new Error("Cannot override model specific properties");
                    }
                    const _old = target._values[property] && target._values[property].getValue() || undefined;

                    target._values[property] = target._values[property] || new Attribute();
                    target._values[property].setValue(value);

                    const result = Reflect.set(target._values, property, value);

                    target.notify({
                        model: name,
                        attribute: property,
                        old: _old,
                        new: value
                    });

                    return result;
                },
                defineProperty: function(target, property, value) {
                    if(!attributes.hasOwnProperty(property)) {
                        return Reflect.defineProperty(target, property, value);
                    }else{
                        throw new Error(
                            `Defining ${this._getProperty(property)} same as ` +
                            `attributes of ${this._getModel()} is not allowed`
                        );
                    }
                },
                deleteProperty: function() {
                    throw new Error(
                        `Deletion of attributes of ${this._getModel()} is not allowed`
                    );
                }
            }

            const handlers = {
                construct: function(target, args) {
                    blockInstantiation = false;

                    const targetInstance = new target(name, attributes, ...args);
                    const instance = new Proxy(
                        targetInstance,
                        objectHandlers
                    );

                    blockInstantiation = true;
                    return instance;
                }
            };
    
            return new Proxy(Model, handlers);
        }
    }

    Object.defineProperty(Model, "Attribute", {
        value: Attribute,
        configurable: false,
        writable: false,
        enumerable: false
    });

    return Model;
})();

export class ModelObserver extends Observer {
    constructor(callback) {
        super();
        if(callback) {
            this._callback = callback;
        }
    }

    update(data) {
        if(typeof this._callback === "function") {
            this._callback(data);
        }
    }
}

export default Model;
