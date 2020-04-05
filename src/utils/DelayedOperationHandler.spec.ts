import { DelayedOperationHandler, DelayedOperationHandlerListener } from "./DelayedOperationHandler";

class Dummy {
    value = 0;
}
class DummyListener implements DelayedOperationHandlerListener<Dummy> {
    entries: Dummy[] = [];

    onAdd(entry: Dummy): void {
        this.entries.push(entry);
    }

    onRemove(entry: Dummy): void {
        const index = this.entries.indexOf(entry);
        if (index !== -1) this.entries.splice(index, 1);
    }

    onRemoveAll(): void {
        this.entries.length = 0;
    }
}
describe("DelayedOperationHandler", () => {
    test("singular_operations", () => {
        const listener = new DummyListener();
        const handler = new DelayedOperationHandler<Dummy>(listener);
        const a = new Dummy();
        const b = new Dummy();
        const c = new Dummy();
        expect(listener.entries).toHaveLength(0);
        handler.add(a);
        expect(listener.entries).toHaveLength(0);
        handler.process();
        expect(listener.entries).toHaveSameOrderedMembers([a]);
        handler.add(b);
        expect(listener.entries).toHaveSameOrderedMembers([a]);
        handler.process();
        expect(listener.entries).toHaveSameOrderedMembers([a, b]);
        handler.add(c);
        expect(listener.entries).toHaveSameOrderedMembers([a, b]);
        handler.process();
        expect(listener.entries).toHaveSameOrderedMembers([a, b, c]);
        handler.remove(b);
        expect(listener.entries).toHaveSameOrderedMembers([a, b, c]);
        handler.process();
        expect(listener.entries).toHaveSameOrderedMembers([a, c]);
        handler.removeAll();
        expect(listener.entries).toHaveSameOrderedMembers([a, c]);
        handler.process();
        expect(listener.entries).toHaveLength(0);
    });

    test("multiple_operations", () => {
        const listener = new DummyListener();
        const handler = new DelayedOperationHandler<Dummy>(listener);
        const a = new Dummy();
        const b = new Dummy();
        const c = new Dummy();
        expect(listener.entries).toHaveLength(0);
        handler.add(a);
        handler.add(b);
        handler.add(c);
        expect(listener.entries).toHaveLength(0);
        handler.process();
        expect(listener.entries).toEqual([a, b, c]);
        handler.remove(a);
        handler.remove(b);
        handler.remove(c);
        expect(listener.entries).toEqual([a, b, c]);
        handler.process();
        expect(listener.entries).toHaveLength(0);
        handler.add(a);
        handler.add(b);
        handler.removeAll();
        handler.add(c);
        expect(listener.entries).toHaveLength(0);
        handler.process();
        expect(listener.entries).toEqual([c]);
    });

    test("add_remove_null", () => {
        const listener = new DummyListener();
        const handler = new DelayedOperationHandler<Dummy>(listener);
        expect(listener.entries).toHaveLength(0);
        handler.add(null as any);
        expect(listener.entries).toHaveLength(0);
        handler.process();
        expect(listener.entries).toHaveLength(0);
        handler.remove(null as any);
        expect(listener.entries).toHaveLength(0);
        handler.process();
        expect(listener.entries).toHaveLength(0);
    });

    test("bad_schedule", () => {
        const listener = new DummyListener();
        const handler = new DelayedOperationHandler<Dummy>(listener);
        (handler as any).schedule(null, null);
        expect(() => handler.process()).toThrow();
    });
});
