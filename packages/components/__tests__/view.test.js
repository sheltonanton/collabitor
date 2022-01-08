import { View } from "components";

describe("View", () => {
    describe(".renderTree", () => {
        test("should call render recursively and get the render tree of views", () => {
            const view = new View();
            const emptyRenderTree = view.renderTree();
            expect(emptyRenderTree).toBeInstanceOf(Array);

            const renderStub = jest.fn((r) => {
                r(View);
            });

            view.render = renderStub;
            const renderTree = view.renderTree();
            expect(renderTree).toBeInstanceOf(Array);
            expect(renderTree.length).toBe(1);
            expect(renderTree[0]).toBeInstanceOf(View);
        });

        test("should get the model wrapped from getModel", () => {
            const view = new View();
            const modelStub = jest.fn((props) => {
                return {
                    name: "Shelton",
                    age: 23,
                    address: {
                        city: "Chennai",
                        state: "Tamil nadu",
                        country: "India"
                    }
                }
            });

            view.model = modelStub;
            const model = view.getModel();
            
        });
    });

    describe(".render", () => {
        test("should have render callback which gets called on initial and rerender", () => {
            expect(View.prototype.render).not.toBeNull();
            expect(View.prototype.render).not.toBeUndefined();
        });
    });
});
