declare namespace jest {
    // eslint-disable-next-line
    interface Matchers<R> {
        toHaveSameMembers: (expectedArray: readonly any[]) => void;
        toHaveSameOrderedMembers: (expectedArray: readonly any[]) => void;
    }
}
