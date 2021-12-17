declare namespace jest {
    // eslint-disable-next-line
    interface Matchers<R> {
        toHaveSameMembers: (expectedArray: any[]) => void;
        toHaveSameOrderedMembers: (expectedArray: any[]) => void;
    }
}
