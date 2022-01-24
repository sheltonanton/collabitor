import { Component } from "components";

describe("Component", () => {
    it("cannot be initialized with new operator", () => {
        expect(() => new Component()).toThrowError();
        class SubComponent extends Component {}
        expect(() => new SubComponent).toThrowError();
    });

    describe(".show", () => {
        it("should throw error when called with Component itself", () => {
            expect(() => Component.show()).toThrowError();
        });

        it("shouldn't throw error and returns the object of Component subclass", () => {
            class SubComponent extends Component {}
            expect(() => SubComponent.show()).not.toThrowError();
            expect(SubComponent.show().__proto__).toBe(SubComponent.prototype);
        });

        it("should throw error when invalid props is passed", () => {
            class SubComponent extends Component {}
            expect(() => SubComponent.show(2)).toThrowError();
            expect(() => SubComponent.show([])).toThrowError();
            expect(() => SubComponent.show("shelton")).toThrowError();
            expect(() => SubComponent.show({name: "Name"})).not.toThrowError();
        });
    });

    describe(".nest", () => {
        class A extends Component {}
        class B extends Component {}
        class C extends Component {}

        it("should throw error when no arguments is passed", () => {
            expect(() => A.show().nest()).toThrowError();
        });

        it("should throw error when invalid arguments are passed", () => {
            expect(() => A.show().nest(
                1
            )).toThrowError();
        });

        it("should accept only overriden components as arguments", () => {
            expect(() => A.show().nest(
                B.show(),
                C.show()
            )).not.toThrowError();
        });

        it("should return the valid sub component object", () => {
            expect(A.show().nest(
                B.show(),
                C.show()
            )).toBeInstanceOf(A);
        });
    });
});