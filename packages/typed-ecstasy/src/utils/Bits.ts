/* eslint-disable max-classes-per-file */
export interface ReadonlyInt32Array extends Omit<Int32Array, "copyWithin" | "fill" | "reverse" | "set" | "sort"> {
    readonly [n: number]: number;
}

/**
 *  A bitset, without size limitation, allows comparison via bitwise operators to other bit fields. Mostly for internal use.
 */
export abstract class ReadonlyBits {
    protected data: Int32Array;

    /**
     * Creates a bit set whose initial size is large enough to explicitly represent bits with indices in the range 0 through nbits-1.
     *
     * @param nbits The initial size of the bit set.
     */
    public constructor(nbits = 64) {
        this.data = new Int32Array(Math.max(2, Math.ceil(nbits / 32)));
    }

    /**
     * @returns A readonly version of the underlying data.
     */
    public getData(): ReadonlyInt32Array {
        return this.data;
    }

    /**
     * @param index The index of the bit.
     * @returns Whether the bit is set.
     */
    public get(index: number) {
        const word = index >> 5;
        if (word >= this.data.length) return false;
        return (this.data[word] & (1 << (index & 0x1f))) !== 0;
    }

    /** @returns The number of bits currently stored, **not** the highest set bit! */
    public numBits() {
        return this.data.length << 5;
    }

    /** @returns The minimal number of words to store all the bits. */
    public usedWords() {
        for (let word = this.data.length - 1; word >= 0; --word) {
            const dataAtWord = this.data[word];
            if (dataAtWord !== 0) return word + 1;
        }
        return 0;
    }

    /**
     * Returns the "logical size" of this bitset: The index of the highest set bit in the bitset plus one.
     * Returns zero if the bitset contains no set bits.
     *
     * @returns The logical size of this bitset.
     */
    public length() {
        for (let word = this.data.length - 1; word >= 0; --word) {
            const dataAtWord = this.data[word];
            if (dataAtWord !== 0) {
                for (let bit = 31; bit >= 0; --bit) {
                    if ((dataAtWord & (1 << (bit & 0x1f))) !== 0) {
                        return (word << 5) + bit + 1;
                    }
                }
            }
        }
        return 0;
    }

    /** @returns True if this bitset contains no bits that are set to true. */
    public isEmpty() {
        const { length } = this.data;
        for (let i = 0; i < length; i++) {
            if (this.data[i] !== 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns the index of the first bit that is set to true that occurs on or after the specified starting index.
     *
     * @param fromIndex The index to start looking.
     * @returns *>= 0* if a truthy bit was found, *-1* otherwise.
     */
    public nextSetBit(fromIndex: number) {
        let word = fromIndex >> 5;
        if (word >= this.data.length) return -1;
        let dataAtWord = this.data[word];
        if (dataAtWord !== 0) {
            for (let i = fromIndex & 0x1f; i < 32; i++) {
                if ((dataAtWord & (1 << (i & 0x1f))) !== 0) {
                    return (word << 5) + i;
                }
            }
        }
        for (word++; word < this.data.length; word++) {
            dataAtWord = this.data[word];
            if (dataAtWord !== 0) {
                for (let i = 0; i < 32; i++) {
                    if ((dataAtWord & (1 << (i & 0x1f))) !== 0) {
                        return (word << 5) + i;
                    }
                }
            }
        }
        return -1;
    }

    /**
     * Returns the index of the first bit that is set to false that occurs on or after the specified starting index.
     *
     * @param fromIndex The index to start looking.
     * @returns *>= 0* if a falsy bit was found, *-1* otherwise.
     */
    public nextClearBit(fromIndex: number) {
        let word = fromIndex >> 5;
        if (word >= this.data.length) return this.data.length << 5;
        let dataAtWord = this.data[word];
        for (let i = fromIndex & 0x1f; i < 32; i++) {
            if ((dataAtWord & (1 << (i & 0x1f))) === 0) {
                return (word << 5) + i;
            }
        }
        for (word++; word < this.data.length; word++) {
            dataAtWord = this.data[word];
            for (let i = 0; i < 32; i++) {
                if ((dataAtWord & (1 << (i & 0x1f))) === 0) {
                    return (word << 5) + i;
                }
            }
        }
        return this.data.length << 5;
    }

    /**
     * Returns true if the other instance has any bits set to true that are also set to true in this instance.
     *
     * @param other The other instance.
     * @returns True if this bit set intersects the specified bit set.
     */
    public intersects(other: ReadonlyBits) {
        const otherData = other.getData();
        for (let i = Math.min(this.data.length, otherData.length) - 1; i >= 0; i--) {
            if ((this.data[i] & otherData[i]) !== 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if this instance is a super set of the other instance, i.e. it has all bits set to true that are
     * also set to true in the other instance.
     *
     * @param other The other instance.
     * @returns True if this bit set is a super set of the specified set.
     */
    public containsAll(other: ReadonlyBits) {
        const otherData = other.getData();
        for (let i = this.data.length; i < otherData.length; i++) {
            if (otherData[i] !== 0) {
                return false;
            }
        }
        for (let i = Math.min(this.data.length, otherData.length) - 1; i >= 0; i--) {
            if ((this.data[i] & otherData[i]) !== otherData[i]) {
                return false;
            }
        }
        return true;
    }

    /** @returns All numbers as string, comma separated. */
    public getStringId() {
        return this.data.slice(0, this.usedWords()).join(",");
    }

    /**
     * Compare with another set of bits.
     *
     * @param other The bits to compare with.
     * @returns True if all bits match.
     */
    public equals(other: ReadonlyBits) {
        if (this === other) return true;
        const otherData = other.getData();
        const commonWords = Math.min(this.data.length, otherData.length);
        for (let i = 0; commonWords > i; i++) {
            if (this.data[i] !== otherData[i]) return false;
        }

        if (this.data.length === otherData.length) return true;

        return this.length() === other.length();
    }
}

/**
 *  A bitset, without size limitation, allows comparison via bitwise operators to other bit fields. Mostly for internal use.
 */
export class Bits extends ReadonlyBits {
    /**
     * Returns the bit at the given index and clears it in one go.
     *
     * @param index The index of the bit.
     * @returns Whether the bit was set before invocation.
     */
    public getAndClear(index: number) {
        const word = index >> 5;
        if (word >= this.data.length) return false;
        const oldData = this.data[word];
        this.data[word] &= ~(1 << (index & 0x1f));
        return this.data[word] !== oldData;
    }

    /**
     * Returns the bit at the given index and sets it in one go.
     *
     * @param index The index of the bit.
     * @returns Whether the bit was set before invocation.
     */
    public getAndSet(index: number) {
        const word = index >> 5;
        this.checkCapacity(word);
        const oldData = this.data[word];
        this.data[word] |= 1 << (index & 0x1f);
        return this.data[word] === oldData;
    }

    /** @param index The index of the bit to set. */
    public set(index: number) {
        const word = index >> 5;
        this.checkCapacity(word);
        this.data[word] |= 1 << (index & 0x1f);
    }

    /** Sets the entire bitset. */
    public setAll() {
        this.data.fill(-1);
    }

    /** @param index The index of the bit to flip. */
    public flip(index: number) {
        const word = index >> 5;
        this.checkCapacity(word);
        this.data[word] ^= 1 << (index & 0x1f);
    }

    /** @param len The new minimum length of data. */
    private checkCapacity(len: number) {
        if (len >= this.data.length) {
            const data = new Int32Array(len + 1);
            data.set(this.data);
            this.data = data;
        }
    }

    /** @param index The index of the bit to clear. */
    public clear(index: number) {
        const word = index >> 5;
        if (word >= this.data.length) return;
        this.data[word] &= ~(1 << (index & 0x1f));
    }

    /** Clears the entire bitset. */
    public clearAll() {
        this.data.fill(0);
    }

    /**
     * Performs a logical **AND** of this target bit set with the argument bit set. This bit set is modified so
     * that each bit in  it has the value true if and only if it both initially had the value true and the
     * corresponding bit in the bit set argument also had the value true.
     *
     * @param other The other instance.
     * @returns This for chaining.
     */
    public and(other: ReadonlyBits) {
        const otherData = other.getData();
        const commonWords = Math.min(this.data.length, otherData.length);
        for (let i = 0; commonWords > i; i++) {
            this.data[i] &= otherData[i];
        }

        if (this.data.length > commonWords) {
            for (let i = commonWords, s = this.data.length; s > i; i++) {
                this.data[i] = 0;
            }
        }
        return this;
    }

    /**
     * Clears all of the bits in this instance whose corresponding bit is set in the other instance.
     *
     * @param other The other instance.
     * @returns This for chaining.
     */
    public andNot(other: ReadonlyBits) {
        const otherData = other.getData();
        for (let i = 0, j = this.data.length, k = otherData.length; i < j && i < k; i++) {
            this.data[i] &= ~otherData[i];
        }
        return this;
    }

    /**
     * Performs a logical **OR** of this instance with the other instance. This instance is modified so that a
     * bit in it has the value true if and only if it either already had the value true or the corresponding bit in
     * the other instance has the value true.
     *
     * @param other A bit set.
     * @returns This for chaining.
     */
    public or(other: ReadonlyBits) {
        const otherData = other.getData();
        const commonWords = Math.min(this.data.length, otherData.length);
        for (let i = 0; commonWords > i; i++) {
            this.data[i] |= otherData[i];
        }

        if (commonWords < otherData.length) {
            this.checkCapacity(otherData.length);
            for (let i = commonWords, s = otherData.length; s > i; i++) {
                this.data[i] = otherData[i];
            }
        }
        return this;
    }

    /**
     * Performs a logical **XOR** of this bit set with the bit set argument. This bit set is modified so that a
     * bit in it has the value true if and only if one of the following statements holds:
     *
     * - The bit initially has the value true, and the corresponding bit in the argument has the value false.
     * - The bit initially has the value false, and the corresponding bit in the argument has the value true.
     *
     * @param other The other instance.
     * @returns This for chaining.
     */
    public xor(other: ReadonlyBits) {
        const otherData = other.getData();
        const commonWords = Math.min(this.data.length, otherData.length);

        for (let i = 0; commonWords > i; i++) {
            this.data[i] ^= otherData[i];
        }

        if (commonWords < otherData.length) {
            this.checkCapacity(otherData.length);
            for (let i = commonWords, s = otherData.length; s > i; i++) {
                this.data[i] = otherData[i];
            }
        }
        return this;
    }
}
