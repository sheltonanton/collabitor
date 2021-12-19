class Editor {
    constructor(element) {
        const classList = element.classList;
        classList.add('clr__editor');

        //adding mutation observer to the editor element
        const mutationObserver = new MutationObserver((mutationList, observer) => {
            for(const mutation of mutationList) {
                if(mutation.type == 'childList') {
                    refreshLineNumber();
                }
            }
        });

        mutationObserver.observe(editor, {childList: true});

        if(editor.children.length == 0) {
            //by default, if the lines are empty, add one line
            addLine(editor, createNewLine());
        }
    }

    refreshLineNumber() {
        const lines = Array.from(this.children);
        lines.forEach((line, index) => {
            const lineNumber = line.getElementsByClassName('clr__editor--linenumber')[0];
    
            while(lineNumber.firstChild) {
                lineNumber.removeChild(lineNumber.firstChild);
            }
    
            lineNumber.appendChild(document.createTextNode(index+1));
        });
    }
}