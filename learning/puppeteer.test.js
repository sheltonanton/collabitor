import fs from 'fs';
import path from 'path';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

describe("Puppeteer", () => {
    beforeEach(async () => {
        await page.evaluate(() => {
            const divElement = document.createElement('div');
            const textNode = document.createTextNode('Hello World');
            divElement.setAttribute('id', 'test-div');
            divElement.classList.add('block');

            divElement.appendChild(textNode);
            document.body.appendChild(divElement);
        });
    });

    test("puppeteer page building test - new div with word 'Hello world'", async () => {
        const divElement = await page.evaluate(() => {
            return document.getElementById('test-div');
        });
        expect(divElement).not.toBeNull();
        
        const divElementText = await page.evaluate(() => {
            return document.getElementById('test-div').innerText; 
        });
        expect(divElementText).toBe('Hello World');
    });

    test("puppeteer visual snapshot regression testing", async () => {
        const image = await page.screenshot();
        expect(image).toMatchImageSnapshot();
    });

    test("puppeteer visual snapshot for single element", async () => {
        const element = await page.waitForSelector('#test-div');
        const screenshot = await element.screenshot();
        expect(screenshot).toMatchImageSnapshot();
    });

    /*get the styles loaded from inline*/
    test('loading multiple links inline and testing', async () => {
        await page.addStyleTag({
            url: [
                'data:text/css',
                encodeURI(fs.readFileSync(path.join(__dirname, 'puppeteer.css')).toString())
            ].join(',')
        });

        const element = await page.waitForSelector('#test-div');
        const screenshot = await element.screenshot();
        const content = await page.content();
        
        expect(content).toMatchSnapshot();
        expect(screenshot).toMatchImageSnapshot();

        await page.evaluate(() => {
            while(document.head.firstChild) {
                document.head.removeChild(document.head.firstChild);
            }
        });
    });

    /*test of converting link to inline script in html*/
    test('loading css link inline', async () => {
        const file = fs.readFileSync(path.join(__dirname, 'puppeteer.css')).toString();

        await page.evaluate((file) => {
            const style = document.createElement('style');
            style.innerHTML = file;
            document.head.appendChild(style);
        }, file);

        const screenshot = await page.screenshot();
        const content = await page.content();

        expect(content).toMatchSnapshot();
        expect(screenshot).toMatchImageSnapshot();

        await page.evaluate(() => {
            const styles = document.getElementsByTagName('style');
            Array.prototype.forEach.call(styles, (style) => document.head.removeChild(style));
        });
    });

    test('evaluateHandle for jsonHandle', async () => {
        const handle = await page.evaluateHandle(() => {
            const object = {
                name: "shelton",
                age: 24,
                check: function() {
                    return this.name == "shelton" && this.age == 24;
                }
            }
            return object;
        });

        let check = await page.evaluate((object) => {
            return object.check();
        }, handle);

        expect(check).toBeTruthy();

        check = await (await page.evaluateHandle((object) => {
            return object.check();
        }, handle)).evaluate(b => b);

        expect(check).toBeTruthy();
    });

    afterEach(async () => {
        await page.evaluate(() => {
            while(document.body.firstChild) {
                document.body.removeChild(document.body.firstChild);
            }
        });
    });
});
