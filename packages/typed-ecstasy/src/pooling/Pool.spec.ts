/* eslint-disable dot-notation */
import { Pool } from "typed-ecstasy";

describe("Pool", () => {
    it("should respect max", () => {
        const pool = new Pool<string>(2);
        for (let i = 0; i < 10; i++) {
            pool.free(i.toString());
        }

        expect(pool.obtain()).toBe("1");
        expect(pool.obtain()).toBe("0");
        expect(pool.obtain()).toBeUndefined();
    });
});
