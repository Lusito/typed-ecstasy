import { getClassLevel } from "./Constructor";

class MyData {
    getId() {
        return "MyData";
    }
}

class MyDerrivedData extends MyData {
    getId() {
        return "MyDerrivedData";
    }
}

class MyDerrivedDataB extends MyData {
    getId() {
        return "MyDerrivedDataB";
    }
}

class MyDeeplyDerrivedData extends MyDerrivedData {
    getId() {
        return "MyDeeplyDerrivedData";
    }
}

class MyVeryDeeplyDerrivedData extends MyDeeplyDerrivedData {
    getId() {
        return "MyVeryDeeplyDerrivedData";
    }
}

class MyOtherData {
    getId() {
        return "MyOtherData";
    }
}

class MyOtherDerrivedData extends MyOtherData {
    getId() {
        return "MyOtherDerrivedData";
    }
}

describe("Constructor", () => {
    test("getClassLevel()", () => {
        expect(getClassLevel(MyData)).toBe(0);
        expect(getClassLevel(MyDerrivedData)).toBe(1);
        expect(getClassLevel(MyDerrivedDataB)).toBe(1);
        expect(getClassLevel(MyDeeplyDerrivedData)).toBe(2);
        expect(getClassLevel(MyVeryDeeplyDerrivedData)).toBe(3);

        expect(getClassLevel(MyOtherData)).toBe(0);
        expect(getClassLevel(MyOtherDerrivedData)).toBe(1);
    });
});
