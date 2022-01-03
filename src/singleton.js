/*
    Requirements: 
    1. should be able to initialize once
    2. There should be global namespace from where the instance could be fetched
    3. This class should be extensible to produce some sub-class singleton
    4. Singleton class should be closed for extension
    5. Singleton getInstance should not be overridden
    6. calling new constructor should throw error saying, this is a singleton class and could be instantiated only through getInstance

    7. getInstance method should have a private flag which toggles the flag for triggering instantiation and toggles it back
    8. if the singleton capability is needed, don't override the getInstance method in sub-classes.
*/

const Singleton = (function() {
    //flag variable which acts as a shutter for instantiation, shutter control exposed to singleton class
    let blockInstantiation = true;
    //stores the instance of singleton, no use here
    let _instance = null; 
    //used to identify singleton with this using ownpropertydescriptor
    const _identifier = Symbol("Singleton"); 

    class Singleton {
        constructor() {
            if(blockInstantiation) {
                throw new Error(`Intantiation of singleton is not allowed. use ${new.target.name}.getInstance() instead`);
            }
        }
    
        static _getInstance() {
            const Subclass = this;

            const subIdentity = Object.getOwnPropertyDescriptor(Subclass, '_identifier');
            if(!subIdentity || _identifier !== subIdentity.value) {
                if (!Subclass._instance) {
                    blockInstantiation = false;
                    const _instance = new Subclass();
                    blockInstantiation = true;
                    Object.defineProperty(Subclass, '_instance', {
                        value: _instance,
                        writable: false,
                        configurable: false,
                        enumerable: false
                    });
                }
                
                if(Subclass._instance instanceof Singleton) {
                    return Subclass._instance;
                } else {
                    throw new Error('Not the required/valid singleton instance');
                }
            }else{
                if(_instance === null) {
                    blockInstantiation = false;
                    _instance = new Singleton();
                    blockInstantiation = true;
                }
                return _instance;
            }
        }
    }

    Singleton._identifier = _identifier;

    Object.defineProperty(Singleton, "getInstance", {
        get: () => Singleton._getInstance,
        //shown throw error when tried to overriden by setting the property using =
        set: () => { throw new Error("getInstance property shouldn't be overridden"); },
        enumerable: false,
        configurable: false
    });

    //addition, deletion and modification is not allowed
    Object.freeze(Singleton);
    return Singleton;
})();

export default Singleton;
