import { View } from "components";

describe("package", () => {
    test("should be able to access View component from packges", () => {
        expect(View).not.toBeNull();
        expect(View).not.toBeUndefined();
    });
});
