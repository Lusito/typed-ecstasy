/*******************************************************************************
 * Copyright 2011 See AUTHORS file.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

/**
 *  A bitset, without size limitation, allows comparison via bitwise operators to other bitfields.
 */
export class Bits {
	private data: Int32Array;

	/**
	 * Creates a bit set whose initial size is large enough to explicitly represent bits with indices in the range 0 through nbits-1.
	 *
	 * @param nbits the initial size of the bit set
	 */
	public constructor(nbits: number = 64) {
		this.data = new Int32Array(Math.max(2, Math.ceil(nbits / 32)));
	}

	/**
	 * @param index the index of the bit
	 * @return Whether the bit is set
	 */
	public get(index: number): boolean {
		let word = index >> 5;
		if (word >= this.data.length) return false;
		return (this.data[word] & (1 << (index & 0x1F))) !== 0;
	}

	/**
	 * Returns the bit at the given index and clears it in one go.
	 *
	 * @param index the index of the bit
	 * @return Whether the bit was set before invocation
	 */
	public getAndClear(index: number): boolean {
		let word = index >> 5;
		if (word >= this.data.length) return false;
		let oldData = this.data[word];
		this.data[word] &= ~(1 << (index & 0x1F));
		return this.data[word] !== oldData;
	}

	/**
	 * Returns the bit at the given index and sets it in one go.
	 *
	 * @param index the index of the bit
	 * @return Whether the bit was set before invocation
	 */
	public getAndSet(index: number): boolean {
		let word = index >> 5;
		this.checkCapacity(word);
		let oldData = this.data[word];
		this.data[word] |= 1 << (index & 0x1F);
		return this.data[word] === oldData;
	}

	/** @param index the index of the bit to set */
	public set(index: number): void {
		let word = index >> 5;
		this.checkCapacity(word);
		this.data[word] |= 1 << (index & 0x1F);
	}

	/** Sets the entire bitset */
	public setAll(): void {
		this.data.fill(-1);
	}

	/** @param index the index of the bit to flip */
	public flip(index: number): void {
		let word = index >> 5;
		this.checkCapacity(word);
		this.data[word] ^= 1 << (index & 0x1F);
	}

	private checkCapacity(len: number): void {
		if (len >= this.data.length) {
			let data = new Int32Array(len + 1);
			data.set(this.data);
			this.data = data;
		}
	}

	/** @param index the index of the bit to clear */
	public clear(index: number): void {
		let word = index >> 5;
		if (word >= this.data.length) return;
		this.data[word] &= ~(1 << (index & 0x1F));
	}

	/** Clears the entire bitset */
	public clearAll(): void {
		this.data.fill(0);
	}

	/** @return The number of bits currently stored, **not** the highset set bit! */
	public numBits(): number {
		return this.data.length << 5;
	}

	/** @return The minimal number of words to store all the bits */
	public usedWords(): number {
		for (let word = this.data.length - 1; word >= 0; --word) {
			let dataAtWord = this.data[word];
			if (dataAtWord !== 0)
				return word + 1;
		}
		return 0;
	}

	/**
	 * Returns the "logical size" of this bitset: The index of the highest set bit in the bitset plus one.
	 * Returns zero if the bitset contains no set bits.
	 *
	 * @return The logical size of this bitset
	 */
	public length(): number {
		for (let word = this.data.length - 1; word >= 0; --word) {
			let dataAtWord = this.data[word];
			if (dataAtWord !== 0) {
				for (let bit = 31; bit >= 0; --bit) {
					if ((dataAtWord & (1 << (bit & 0x1F))) !== 0) {
						return (word << 5) + bit + 1;
					}
				}
			}
		}
		return 0;
	}

	/** @return true if this bitset contains no bits that are set to true */
	public isEmpty(): boolean {
		let length = this.data.length;
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
	 * @param fromIndex the index to start looking
	 * @return *>= 0* if a truthy bit was found, *-1* otherwise.
	 */
	public nextSetBit(fromIndex: number): number {
		let word = fromIndex >> 5;
		if (word >= this.data.length) return -1;
		let dataAtWord = this.data[word];
		if (dataAtWord !== 0) {
			for (let i = fromIndex & 0x1f; i < 32; i++) {
				if ((dataAtWord & (1 << (i & 0x1F))) !== 0) {
					return (word << 5) + i;
				}
			}
		}
		for (word++; word < this.data.length; word++) {
			dataAtWord = this.data[word];
			if (dataAtWord !== 0) {
				for (let i = 0; i < 32; i++) {
					if ((dataAtWord & (1 << (i & 0x1F))) !== 0) {
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
	 * @param fromIndex the index to start looking
	 * @return *>= 0* if a falsy bit was found, *-1* otherwise.
	 */
	public nextClearBit(fromIndex: number): number {
		let word = fromIndex >> 5;
		if (word >= this.data.length) return this.data.length << 5;
		let dataAtWord = this.data[word];
		for (let i = fromIndex & 0x1f; i < 32; i++) {
			if ((dataAtWord & (1 << (i & 0x1F))) === 0) {
				return (word << 5) + i;
			}
		}
		for (word++; word < this.data.length; word++) {
			dataAtWord = this.data[word];
			for (let i = 0; i < 32; i++) {
				if ((dataAtWord & (1 << (i & 0x1F))) === 0) {
					return (word << 5) + i;
				}
			}
		}
		return this.data.length << 5;
	}

	/**
	 * Performs a logical **AND** of this target bit set with the argument bit set. This bit set is modified so
	 * that each bit in  it has the value true if and only if it both initially had the value true and the
	 * corresponding bit in the bit set argument also had the value true.
	 *
	 * @param other The other instance
	 * @return this
	 */
	public and(other: Bits): Bits {
		let commonWords = Math.min(this.data.length, other.data.length);
		for (let i = 0; commonWords > i; i++) {
			this.data[i] &= other.data[i];
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
	 * @param other The other instance
	 */
	public andNot(other: Bits): Bits {
		for (let i = 0, j = this.data.length, k = other.data.length; i < j && i < k; i++) {
			this.data[i] &= ~other.data[i];
		}
		return this;
	}

	/**
	 * Performs a logical **OR** of this instance with the other instance. This instance is modified so that a
	 * bit in it has the value true if and only if it either already had the value true or the corresponding bit in
	 * the other instance has the value true.
	 *
	 * @param other a bit set
	 * @return this
	 */
	public or(other: Bits): Bits {
		let commonWords = Math.min(this.data.length, other.data.length);
		for (let i = 0; commonWords > i; i++) {
			this.data[i] |= other.data[i];
		}

		if (commonWords < other.data.length) {
			this.checkCapacity(other.data.length);
			for (let i = commonWords, s = other.data.length; s > i; i++) {
				this.data[i] = other.data[i];
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
	 * @param other The other instance
	 * @return this
	 */
	public xor(other: Bits): Bits {
		let commonWords = Math.min(this.data.length, other.data.length);

		for (let i = 0; commonWords > i; i++) {
			this.data[i] ^= other.data[i];
		}

		if (commonWords < other.data.length) {
			this.checkCapacity(other.data.length);
			for (let i = commonWords, s = other.data.length; s > i; i++) {
				this.data[i] = other.data[i];
			}
		}
		return this;
	}

	/**
	 * Returns true if the other instance has any bits set to true that are also set to true in this instance.
	 *
	 * @param other The other instance
	 * @return true if this bit set intersects the specified bit set
	 */
	public intersects(other: Bits): boolean {
		for (let i = Math.min(this.data.length, other.data.length) - 1; i >= 0; i--) {
			if ((this.data[i] & other.data[i]) !== 0) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns true if this instance is a super set of the other instance, i.e. it has all bits set to true that are
	 *  also set to true in the other instance.
	 *
	 * @param other The other instance
	 * @return true if this bit set is a super set of the specified set
	 */
	public containsAll(other: Bits): boolean {
		for (let i = this.data.length; i < other.data.length; i++) {
			if (other.data[i] !== 0) {
				return false;
			}
		}
		for (let i = Math.min(this.data.length, other.data.length) - 1; i >= 0; i--) {
			if ((this.data[i] & other.data[i]) !== other.data[i]) {
				return false;
			}
		}
		return true;
	}

	/** @return All numbers as string, comma separated */
	public getStringId(): string {
		return this.data.slice(0, this.usedWords()).join(',');
	}

	/**
	 * Compare with another set of bits.
	 * 
	 * @param other the bits to compare with
	 * @return true if all bits match
	 */
	public equals(other: Bits): boolean {
		if (this === other)
			return true;
		let commonWords = Math.min(this.data.length, other.data.length);
		for (let i = 0; commonWords > i; i++) {
			if (this.data[i] !== other.data[i])
				return false;
		}

		if (this.data.length === other.data.length)
			return true;

		return this.length() === other.length();
	}
}
