import {
    Editor,
    addScript
} from "collabitor";

describe("Editor", () => {
    test("should be a valid class and has a constructor property", () => {
        expect(Editor).not.toBeNull();
        expect(Editor).not.toBeUndefined();
        expect(Editor.constructor).toBeInstanceOf(Function);
    });

    test("should throw error when tried to initialize", () => {
        expect(() => new Editor()).toThrow(Error);
    });

    describe(".attachTo", () => {
        beforeAll(async () => {
            await addScript(page, "./src/editor/index.js", "Editor");
        });

        test("should throw error when no parameter is passed", async () => {
            const message = await page.evaluate(() => {
                const Editor = window.Editor;
                try {
                    Editor.attachTo();
                } catch(error) {
                    return error.message;
                }
            });
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
});