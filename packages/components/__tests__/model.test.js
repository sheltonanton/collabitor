import { 
    Model,
    ModelObserver
} from "components";

describe("Model", () => {
    let model = null;
    beforeAll(() => {
        model = Model.new({
            name: "Name",
            age: "20",
            address: {
                city: "city",
                state: "state",
                country: "country"
            }
        });
    });

    describe(".new", () => {
        test("should be able to wrap any objects/arrays within Model", () => {
            expect(model).toBeInstanceOf(Model);
            expect(model.name).toBeInstanceOf(Model.Attribute);
            expect(model.address).toBeInstanceOf(Model);
            expect(model.address.city).toBeInstanceOf(Model.Attribute);
        });

        test("should be able to subscribe to both Model and Attribute", () => {
            class StubObserver extends ModelObserver {}
            StubObserver.prototype.update = jest.fn(() => {});

            const stubObserver = new StubObserver();

            model.listen(stubObserver);
            model.name.listen(stubObserver);

            
        });
    });
});
