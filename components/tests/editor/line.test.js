import addScript from '../add-script';

describe("line", () => {
    beforeAll(async () => {
        await addScript(page, './components/editor/line.js', 'Line');
        await page.evaluate(() => {
            const block = document.createElement("div");
            const firstBlock = block.cloneNode();
            const secondBlock = block.cloneNode();

            firstBlock.id = 'firstBlock';
            secondBlock.id = 'secondBlock';

            document.body.appendChild(firstBlock);
            document.body.appendChild(secondBlock);
        });
    });

    test("line initialization as its object", async () => {
        const check = await page.evaluate(() => {
            const line = new Line();
            return line instanceof Line;
        });
        expect(check).toBeTruthy();
    });

    test("line should append to the parent block supplied in constructor function", async () => {
        let firstCount, secondCount;

        [firstCount, secondCount] = await page.evaluate(() => {
            new Line(firstBlock);
            return [firstBlock.childNodes.length, secondBlock.childNodes.length];
        });

        expect([firstCount, secondCount]).toEqual([1, 0]);

        [firstCount, secondCount] = await page.evaluate(() => {
            new Line(secondBlock);
            return [firstBlock.childNodes.length, secondBlock.childNodes.length];
        });

        expect([firstCount, secondCount]).toEqual([1, 1]);

        await page.evaluate(() => {
            while(firstBlock.firstChild) {
                firstBlock.removeChild(firstBlock.firstChild);
            }
            while(secondBlock.firstChild) {
                secondBlock.removeChild(secondBlock.firstChild);
            }
        });
    });

    test("line should append to the parent block supplied in set parent function", async () => {
        let firstCount, secondCount;
        const linesHandle = await page.evaluateHandle(() => {
            const lines = {
                l1: new window.Line(firstBlock),
                l2: new window.Line()
            }
            return lines;
        });

        [firstCount, secondCount] = await page.evaluate((lines) => {
            const {l1, l2} = lines;
            l1.parent = secondBlock;
            l2.parent = secondBlock;

            return [firstBlock.children.length, secondBlock.children.length];
        }, linesHandle);
        expect([firstCount, secondCount]).toEqual([0, 2]);

        [firstCount, secondCount] = await page.evaluate((lines) => {
            const {l1, l2} = lines;
            l1.parent = null;
            l2.parent = null;

            return [firstBlock.children.length, secondBlock.children.length];
        }, linesHandle);
        expect([firstCount, secondCount]).toEqual([0, 0]);

        await page.evaluate(() => {
            while(firstBlock.firstChild) {
                firstBlock.removeChild(firstBlock.firstChild);
            }
            while(secondBlock.firstChild) {
                secondBlock.removeChild(secondBlock.firstChild);
            }
        });
    });
});
