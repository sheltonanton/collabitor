import {
    Editor,
    addScript
} from "collabitor";

import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

describe("Editor", () => {
    let editorScriptHandle;
    beforeAll(async () => {
        editorScriptHandle = await addScript(page, "./src/editor/index.js", "Editor");
    });

    test("should be a valid class and has a constructor property", () => {
        expect(Editor).not.toBeNull();
        expect(Editor).not.toBeUndefined();
        expect(Editor.constructor).toBeInstanceOf(Function);
    });

    test("should throw error when tried to initialize", () => {
        expect(() => new Editor()).toThrow(Error);
    });

    describe(".attachTo", () => {
        test("should throw error when no parameter is passed", async () => {
            expect(() => Editor.attachTo()).toThrow();
            let message;
            try {
                Editor.attachTo();
            } catch(error) {
                message = error.message;
            }
            expect(message).toBe("Specify a valid document element");
        });

        test("should throw error when the parameter passed is not of type Element", async () => {
            const message = await page.evaluate(() => {
                const Editor = window.Editor;
                try {
                    Editor.attachTo("dummyString");
                } catch(error) {
                    return error.message;
                }
            });
            expect(message).toBe("Not a valid element");
        });

        test("should pass when the parameter passed is of type Element and returns the Element Object", async () => {
            const passing = await page.evaluate(() => {
                const Editor = window.Editor;
                return Editor.attachTo(document.body) instanceof Editor;
            });
            expect(passing).toBeTruthy();
        });
    });

    afterAll(async () => {
        await page.evaluate((script) => {
            script.remove();
        }, editorScriptHandle);
    });
});

describe("Editor:Snapshot", () => {
    let editorScriptHandle;

    beforeAll(async () => {
        editorScriptHandle = await addScript(page, "./src/editor/index.js", "Editor");
        await page.evaluate(() => {
            const container = document.createElement("div");
            container.id = "container";
            document.body.appendChild(container);
        });
    });

    test("should display one line on attached", async () => {
        await page.evaluate(() => {
            const Editor = window.Editor;
            const container = document.getElementById("container");
            Editor.attachTo(container);
        });

        const editor = await page.waitForSelector("#container");
        const screenshot = await editor.screenshot();
        expect(screenshot).toMatchImageSnapshot();
    });

    afterAll(async () => {
        await page.evaluate((script) => {
            script.remove();
        }, editorScriptHandle);

        await page.evaluate(() => {
            while(document.body.firstChild) {
                document.body.removeChild(document.body.firstChild);
            }
        });
    });
});