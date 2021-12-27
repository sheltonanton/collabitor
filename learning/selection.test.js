import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { text } from 'stream/consumers';

expect.extend({ toMatchImageSnapshot });

describe("Selection", () => {
    test("selection properties without any selection", async () => {
        const isNull = await page.evaluate(() => {
            const anchorNode = window.getSelection().anchorNode;
            return (anchorNode === null);
        });
        const anchorOffset = await page.evaluate(() => {
            return window.getSelection().anchorOffset;
        })

        const [isFocusNodeNull, focusOffset] = await page.evaluate(() => {
            const selection = window.getSelection();
            return [selection.focusNode === null, selection.focusOffset];
        })

        const isCollapsed = await page.evaluate(() => {
            return window.getSelection().isCollapsed;
        });

        const rangeCount = await page.evaluate(() => {
            return window.getSelection().rangeCount;
        });

        const selectionType = await page.evaluate(() => {
            return window.getSelection().type;
        });

        expect(typeof isNull).toBe('boolean');
        expect(isNull).toBeTruthy();
        expect(anchorOffset).toBe(0);
        expect([isFocusNodeNull, focusOffset]).toEqual([true, 0]);
        expect([typeof isCollapsed, isCollapsed]).toEqual(['boolean', true]);
        expect(rangeCount).toBe(0);
        expect(selectionType).toBe('None');
    });

    describe("Range", () => {
        beforeEach(async () => {
            await page.evaluate(() => {
                window.getSelection().removeAllRanges();

                const block = document.createElement('div');
                const container = document.createElement('div');

                const blockOne = block.cloneNode();
                const blockTwo = block.cloneNode();
                const blockThr = block.cloneNode();

                blockOne.innerHTML = "Block One";
                blockOne.id = "blockOne";

                blockTwo.innerHTML = "Block Two";
                blockTwo.id = "blockTwo";

                blockThr.innerHTML = "Block Three";
                blockThr.id = "blockThr";

                container.id = "container";
                container.append(blockOne);
                container.append(blockTwo);
                container.append(blockThr);

                document.body.appendChild(container);
            });
        });

        test("Support for range across elements", async () => {
            await page.evaluate(() => {
                const range = new Range();
                range.setStart(blockOne, 0);
                range.setEnd(blockTwo, 0);
    
                window.getSelection().addRange(range);
            });
    
            const container = await page.waitForSelector('#container');
            const screenshot = await container.screenshot();
            const pageshot = await page.screenshot();
    
            const [
                rangeCount,
                anchorNodeGood,
                focusNodeGood,
                anchorOffset,
                focusOffset,
                type,
                isCollapsed,
                commonAncestor
            ] = await page.evaluate(() => {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
    
                const rangeCount = selection.rangeCount;
                const anchorNodeGood = (selection.anchorNode === document.getElementById("blockOne"));
                const focusNodeGood = (selection.focusNode === document.getElementById("blockTwo"));
                const anchorOffset = selection.anchorOffset;
                const focusOffset = selection.focusOffset;
                const type = selection.type;
                const isCollapsed = selection.isCollapsed;
                const commonAncestor = range.commonAncestorContainer.id;
    
                return [
                    rangeCount,
                    anchorNodeGood,
                    focusNodeGood,
                    anchorOffset,
                    focusOffset,
                    type,
                    isCollapsed,
                    commonAncestor
                ];
            });
    
            expect(pageshot).toMatchImageSnapshot();
            expect(screenshot).toMatchImageSnapshot();
            expect(rangeCount).toBe(1);
            expect(anchorNodeGood).toBeTruthy();
            expect(focusNodeGood).toBeTruthy();
            expect(anchorOffset).toBe(0);
            expect(focusOffset).toBe(0);
            expect(type).toBe('Range');
            expect(isCollapsed).toBeFalsy();
            expect(commonAncestor).toBe('container');
        });
    
        test("selection using range select node function", async () => {
            await page.evaluate(() => {
                const range = new Range();
                
                range.selectNode(container);
                window.getSelection().addRange(range);
            });
    
            const container = await page.waitForSelector("#container");
            const screenshot = await container.screenshot();
    
            expect(screenshot).toMatchImageSnapshot();
        });

        test("using startNode and endNode", async () => {
            const style = await page.addStyleTag({
                content: `
                    ::selection {
                        background: yellow;
                    }
                `
            });

            await page.evaluate(() => {
                const range = new Range();

                range.setStart(container, 0);
                range.setEnd(container, 2);
                window.getSelection().addRange(range);
            });

            const container = await page.waitForSelector("#container");
            const screenshot = await container.screenshot();
    
            expect(screenshot).toMatchImageSnapshot();

            style.evaluate((node) => node.parentElement.removeChild(node));
            style.dispose();
        });

        describe("actions", () => {
            async function removeText() {
                await page.evaluate(() => {
                    const selection = window.getSelection();
                    const firstNode = selection.anchorNode;
                    const lastNode = selection.focusNode;
                    const commonAncestor = selection.getRangeAt(0).commonAncestorContainer;

                    selection.deleteFromDocument();
                    let content = firstNode.textContent;
                    if(lastNode !== firstNode) {
                        content += lastNode.textContent;
                        
                        let removeThis = lastNode;
                        while(removeThis.parentElement !== commonAncestor){
                            removeThis = removeThis.parentElement;
                        }
                        removeThis.remove();
                    }
                    firstNode.textContent = content;
                });
            }

            beforeEach(async () => {
                await page.evaluate(() => {
                    const range = new Range();
    
                    range.setStart(blockOne.firstChild, 2);
                    range.setEnd(blockThr.firstChild, 4);
                    window.getSelection().addRange(range);
                });
            });

            test("inbetween text using startNode and endNode", async () => {
                const container = await page.waitForSelector("#container");
                const screenshot = await container.screenshot();
    
                expect(screenshot).toMatchImageSnapshot();
            });
    
            test("getting the text from selection", async () => {
                let text = await page.evaluate(() => {
                    return window.getSelection().toString()
                });
    
                expect(text).toBe("ock One\nBlock Two\nBloc");
                
                text = await page.evaluate(() => {
                    window.getSelection().removeAllRanges();
                    return window.getSelection().toString();
                });
    
                expect(text).toBe("");
            });
    
            test("removing the text from selection", async () => {
                await page.evaluate(() => {
                    return window.getSelection().deleteFromDocument();
                });
                const container = await page.waitForSelector("#container");
                const screenshot = await container.screenshot();
                
                expect(screenshot).toMatchImageSnapshot();
            });

            test("removing from selection and merging within elements", async () => {
                await page.evaluate(() => {
                    const range = window.getSelection().getRangeAt(0);
                    range.setEnd(blockOne.firstChild, 7)
                });
                await removeText();
                const container = await page.waitForSelector("#container");
                const screenshot = await container.screenshot();
                
                expect(screenshot).toMatchImageSnapshot();
            });

            test("removing from selection and merging across elements", async () => {
                await removeText();
                const container = await page.waitForSelector("#container");
                const screenshot = await container.screenshot();
                
                expect(screenshot).toMatchImageSnapshot();
            });

            test("removing text across nested elements", async () => {
                await page.evaluate(() => {
                    const blockFour = document.createElement('div');
                    const nested = document.createElement('div');
                    
                    nested.appendChild(document.createTextNode("Nested Block Four"));
                    blockFour.appendChild(nested);
                    container.append(blockFour);

                    const range = window.getSelection().getRangeAt(0);
                    range.setEnd(nested.firstChild, 7);
                });
                
                await removeText();
                const container = await page.waitForSelector("#container");
                const screenshot = await container.screenshot();
                const snapshot = await page.content();

                expect(snapshot).toMatchSnapshot();
                expect(screenshot).toMatchImageSnapshot();
            });
        });

        afterEach(async () => {
            await page.evaluate(() => {
                window.getSelection().removeAllRanges();

                while(document.body.firstChild) {
                    document.body.removeChild(document.body.firstChild);
                }
            });
        });
    });

    test("testing promise resolving using event handlers", async () => {
        const button = await page.evaluateHandle(() => {
            const button = document.createElement('button');
            button.innerHTML = 'click here';
            button.id = '#clickThis';
            document.body.appendChild(button);
            return button;
        });
        await new Promise((resolve) => {
            page.exposeFunction('resolve', resolve).then(() => {
                page.evaluateHandle((button) => {
                    button.addEventListener('click', () => {
                        window.resolve();
                    });
                    button.click();
                    return button;
                }, button);
            });
        });
    });
});