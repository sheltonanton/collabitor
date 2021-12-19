
var initializeEditor = (function(){
    function createNewLine(content="") {
        const line = document.createElement('div');
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
    
        lineContent.addEventListener('input', function(event) {
            const text = event.target.innerText.replace("\n\n", "\n"); //contenteditable handling
            const [firstLine, ...remainingLines] = text.split("\n");
            const editor = line.parentElement;
    
            if(remainingLines.length > 0)
                event.target.innerText = firstLine;

            const pos = Array.prototype.indexOf.call(editor.children, line);
            remainingLines.forEach((remainingLine, index) => insertLine(
                editor, 
                createNewLine(remainingLine),
                (pos != -1)? (pos + index): (editor.children.length)
            ));
        });

        return line;
    }

    function insertLine(editor, line, pos) {
        if(pos < editor.children.length) {
            addLine(editor, line);
        }else{
            editor.insertBefore(line, editor.children[pos]);
        }
    }
    
    function addLine(editor, line) {
        editor.appendChild(line);
    }
    
    function refreshLineNumber(editor) {
        const lines = Array.from(editor.children);
        lines.forEach((line, index) => {
            const lineNumber = line.getElementsByClassName('clr__editor--linenumber')[0];
    
            while(lineNumber.firstChild) {
                lineNumber.removeChild(lineNumber.firstChild);
            }
    
            lineNumber.appendChild(document.createTextNode(index+1));
        });
    }
    
    function initializeEditor(className) {
    
        const editors = document.getElementsByClassName(className);
        Array.from(editors).forEach(editor => {
            const classList = editor.classList;
            classList.add('clr__editor');
    
            //adding mutation observer to the editor element
            const mutationObserver = new MutationObserver((mutationList, observer) => {
                for(const mutation of mutationList) {
                    if(mutation.type == 'childList') {
                        refreshLineNumber(editor);
                    }
                }
            });
    
            mutationObserver.observe(editor, {childList: true});
            if(editor.children.length == 0) {
                //by default, if the lines are empty, add one line
                addLine(editor, createNewLine());
            }
    
            editor.addEventListener(
                //adding click event listener to attach cursor to the doc
                'click',
                function() {
                    
                }
            );
        });
    }
    
    return initializeEditor;
}());
