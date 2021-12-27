describe("lineComponent", () => {
    beforeAll(async () => {
        
    });

    beforeEach(async () => {

    });

    test("lineComponent initialization as its object", async () => {
        await page.exposeFunction('assert', (bool) => {
            expect(bool).toBeTruthy();
        });
        await page.exposeFunction('LineComponent', require('components/editor/lineComponent.js'));
        const renderString = await page.evaluate(() => {
            return window.LineComponent.toString();
        });
        expect(renderString).toBe("Hello World");
    });

    afterEach(async () => {

    });

    afterAll(async () => {

    });
});
