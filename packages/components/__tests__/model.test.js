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
            expect(model.address).toBeInstanceOf(Model.Attribute);
            expect(model.address.city).toBeInstanceOf(Model.Attribute);
        });

        test("should be able to subscribe to both Model and Attribute", () => {
            class StubObserver extends ModelObserver {}

            const modelObserverStub = new StubObserver();
            const attributeObserverStub = new StubObserver();
            
            modelObserverStub.update = jest.fn();
            attributeObserverStub.update = jest.fn();

            model.listen(modelObserverStub);
            model.name.listen(attributeObserverStub);
            model.address.listen(attributeObserverStub);

            model.sex = "male";
            model.name = "newName";
            model.address = {};
            
            expect(modelObserverStub.update.mock.calls.length).toBe(1);
            expect(attributeObserverStub.update.mock.calls.length).toBe(2);
            expect(modelObserverStub.update.mock.calls[0][0]).toEqual({
                model: "model",
                attribute: "sex",
                old: undefined,
                new: "male"
            });

            expect(attributeObserverStub.update.mock.calls[0][0]).toEqual({
                model: "model",
                attribute: "name",
                old: "Name",
                new: "newName"
            });

            expect(attributeObserverStub.update.mock.calls[1][0]).toEqual({
                model: "model",
                attribute: "address",
                old: {
                    city: "city",
                    state: "state",
                    country: "country"
                },
                new: {}
            });
        });
    });
});
