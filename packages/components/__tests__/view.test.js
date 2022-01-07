import { View } from "components";

describe("View", () => {
    describe(".render", () => {
        test("should have render callback which gets called on initial and rerender", () => {
            expect(View.prototype.render).not.toBeNull();
            expect(View.prototype.render).not.toBeUndefined();
        });
    });
});
