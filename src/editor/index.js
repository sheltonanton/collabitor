const Editor = (() => {
    let blockInstantiation = true;
    class _Editor {
        constructor() {
            if(blockInstantiation) {
                throw new Error("Editor class instantiation through this method is not allowed");
            }
        }

        static attachTo(element) {
            if(!element) { 
                throw new Error("Specify a valid document element");
            }

            if(!(element instanceof Element)) {
                throw new Error("Not a valid element");
            }

            blockInstantiation = false;
            const _instance = new _Editor(element);
            blockInstantiation = true;
            return _instance;
        }
    }

    return _Editor;
})();

export default Editor;