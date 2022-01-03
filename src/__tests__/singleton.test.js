import {
    Singleton
} from 'collabitor';

describe("Singleton", () => {
    test("Singleton class is not null", () => {
        expect(Singleton).not.toBeNull();
    });

    test("on initialization should throw error", () => {
        expect(() => new Singleton()).toThrow(Error);
    });

    test("should return an instance of a Singleton Class", () => {
        const singleton = Singleton.getInstance();
        expect(singleton instanceof Singleton).toBeTruthy();
    });

    test("should return the same instance on multiple calls", () => {
        const a = Singleton.getInstance();
        const b = Singleton.getInstance();
        expect(a).toBe(b);
    });

    describe("Subclass", () => {
        class SubClass extends Singleton {}

        test("shouldn't allow constructor initialization for the subclasses of Singleton too", () => {
            expect(() => new SubClass()).toThrow(Error);
        });
    
        test("should return the same instance on multiple classes on subclass", () => {
            const a = SubClass.getInstance();
            const b = SubClass.getInstance();
            expect(a).toBe(b);
        });
    });
});