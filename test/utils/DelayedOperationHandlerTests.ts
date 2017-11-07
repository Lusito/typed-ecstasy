/*******************************************************************************
 * Copyright 2015 See AUTHORS file.
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
import { suite, test } from "mocha-typescript";
import { assert } from "chai";
import { DelayedOperationHandler, DelayedOperationHandlerListener } from "../../src/utils/DelayedOperationHandler";

class Dummy {
    value = 0;
}
class DummyListener implements DelayedOperationHandlerListener<Dummy> {
    entries: Dummy[] = [];
    onAdd(entry: Dummy): void {
        this.entries.push(entry);
    }
    onRemove(entry: Dummy): void {
        let index = this.entries.indexOf(entry);
        if (index !== -1)
            this.entries.splice(index, 1);
    }
    onRemoveAll(): void {
        this.entries.length = 0;
    }
}
@suite export class DelayedOperationHandlerTests {

    @test singular_operations() {
        let listener = new DummyListener();
        let handler = new DelayedOperationHandler<Dummy>(listener);
        let a = new Dummy();
        let b = new Dummy();
        let c = new Dummy();
        assert.isEmpty(listener.entries);
        handler.add(a);
        assert.isEmpty(listener.entries);
        handler.process();
        assert.sameOrderedMembers(listener.entries, [a]);
        handler.add(b);
        assert.sameOrderedMembers(listener.entries, [a]);
        handler.process();
        assert.sameOrderedMembers(listener.entries, [a, b]);
        handler.add(c);
        assert.sameOrderedMembers(listener.entries, [a, b]);
        handler.process();
        assert.sameOrderedMembers(listener.entries, [a, b, c]);
        handler.remove(b);
        assert.sameOrderedMembers(listener.entries, [a, b, c]);
        handler.process();
        assert.sameOrderedMembers(listener.entries, [a, c]);
        handler.removeAll();
        assert.sameOrderedMembers(listener.entries, [a, c]);
        handler.process();
        assert.isEmpty(listener.entries);
    }

    @test multiple_operations() {
        let listener = new DummyListener();
        let handler = new DelayedOperationHandler<Dummy>(listener);
        let a = new Dummy();
        let b = new Dummy();
        let c = new Dummy();
        assert.isEmpty(listener.entries);
        handler.add(a);
        handler.add(b);
        handler.add(c);
        assert.isEmpty(listener.entries);
        handler.process();
        assert.sameOrderedMembers(listener.entries, [a, b, c]);
        handler.remove(a);
        handler.remove(b);
        handler.remove(c);
        assert.sameOrderedMembers(listener.entries, [a, b, c]);
        handler.process();
        assert.isEmpty(listener.entries);
        handler.add(a);
        handler.add(b);
        handler.removeAll();
        handler.add(c);
        assert.isEmpty(listener.entries);
        handler.process();
        assert.sameOrderedMembers(listener.entries, [c]);
    }

    @test add_remove_null() {
        let listener = new DummyListener();
        let handler = new DelayedOperationHandler<Dummy>(listener);
        assert.isEmpty(listener.entries);
        handler.add(null as any);
        assert.isEmpty(listener.entries);
        handler.process();
        assert.isEmpty(listener.entries);
        handler.remove(null as any);
        assert.isEmpty(listener.entries);
        handler.process();
        assert.isEmpty(listener.entries);
    }

    @test bad_schedule() {
        let listener = new DummyListener();
        let handler = new DelayedOperationHandler<Dummy>(listener);
        (handler as any).schedule(null, null);
        assert.throws(() => handler.process());
    }
}
