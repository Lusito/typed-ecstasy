/* eslint-disable dot-notation */
import { Pool, Poolable } from "typed-ecstasy";

class PooledObject implements Poolable {
    public value = "initial";

    public reset() {
        this.value = "resetted";
    }
}

describe("Pool", () => {
    it("should reset the object correctly", () => {
        const pool = new Pool<PooledObject>(() => new PooledObject());
        const a = pool.obtain();
        expect(a.value).toBe("initial");
        a.value = "updated";

        pool.free(a);
        expect(a.value).toBe("resetted");

        expect(pool.obtain()).toBe(a);
        expect(pool.obtain()).not.toBe(a);
    });

    it("should respect max", () => {
        const pool = new Pool<PooledObject>(() => new PooledObject(), 2);
        const objects: PooledObject[] = [];
        for (let i = 0; i < 10; i++) {
            const x = pool.obtain();
            objects.push(x);
            expect(x.value).toBe("initial");
            x.value = `updated${i}`;
        }

        for (let i = 0; i < 2; i++) {
            pool.free(objects[i]);
            expect(objects[i].value).toBe("resetted");
        }

        for (let i = 2; i < 10; i++) {
            pool.free(objects[i]);
            expect(objects[i].value).toBe(`updated${i}`);
        }

        for (let i = 0; i < 2; i++) {
            expect(pool.obtain().value).toBe("resetted");
        }

        for (let i = 2; i < 10; i++) {
            expect(pool.obtain().value).toBe("initial");
        }
    });
});
