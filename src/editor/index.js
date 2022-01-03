const Editor = (() => {
    let blockInstantiation = true;
    class _Editor {
        constructor(element) {
            if(blockInstantiation) {
                throw new Error("Editor class instantiation through this method is not allowed");
            }
            this.element = element;
            this.initialize();
        }

        initialize() {
            this.element.classList.add('clr__editor');

            //adding mutation observer to the editor element
            const mutationObserver = new MutationObserver((mutationList) => {
                for(const mutation of mutationList) {
                    if(mutation.type == 'childList') {
                        this.refreshLineNumber();
                    }
                }
            });
            mutationObserver.observe(this.element, {childList: true});

            if(this.element.children.length == 0) {
                this.addLine(this.createNewLine());
            }
        }

        refreshLineNumber() {
            const lines = Array.from(this.element.children);
            lines.forEach((line, index) => {
                const lineNumber = line.getElementsByClassName('clr__editor--linenumber')[0];
        
                while(lineNumber.firstChild) {
                    lineNumber.removeChild(lineNumber.firstChild);
                }
        
                lineNumber.appendChild(document.createTextNode(index+1));
            });
        }

        addLine(line) {
            this.element.appendChild(line);
        }

        createNewLine(content="") {
            const line = document.createElement("div");
            line.classList.add('clr__editor--line');
    
            const lineNumber = document.createElement('div');
            lineNumber.classList.add('clr__editor--linenumber', 'unselectable');

            const lineContent = document.createElement('span');
            lineContent.classList.add('clr__editor--linecontent');
            lineContent.innerText = content;
        
            line.appendChild(lineNumber);
            line.appendChild(lineContent);

            line.addEventListener('click', function() {
                lineContent.setAttribute('contenteditable', true);
                lineContent.focus();
        
                line.classList.add('current');
            });
        
            lineContent.addEventListener('blur', function() {
                lineContent.setAttribute('contenteditable', false);
                line.classList.remove('current');
            });

            lineContent.addEventListener('input', (event) => {
                const text = event.target.innerText.replace("\n\n", "\n"); //contenteditable handling
                const [firstLine, ...remainingLines] = text.split("\n");
                const editor = line.parentElement;
        
                if(remainingLines.length > 0)
                    event.target.innerText = firstLine;
    
                const pos = Array.prototype.indexOf.call(editor.children, line);
                remainingLines.forEach((remainingLine, index) => this.insertLine(
                    createNewLine(remainingLine),
                    (pos != -1)? (pos + index): (editor.children.length)
                ));
            });
    
            return line;
        }

        insertLine(line, pos) {
            if(pos < this.element.children.length) {
                this.addLine(line);
            }else{
                this.element.insertBefore(line, this.element.children[pos]);
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