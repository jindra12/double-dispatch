import { doubleDispatch } from '../src/dispatch/dispatch';

class Basic {
    count = () => 10;
}

describe("Can do complex double dispatches", () => {
    test("Can create multiple parameters double dispatches", () => {
        const Ext = doubleDispatch(Basic)
            .push([
                [String, Number],
                (a, b) => `String: ${a}, number: ${b}`,
            ]).push([
                [Number, Number],
                (a, b) => `String: ${a}, number: ${b}`,
            ]).resolve();
        expect(new Ext().dispatch('1', 1)).toBe('String: 1, number: 1');
        expect(new Ext().dispatch(1, 1)).toBe('String: 1, number: 1');
    });
    test("Can bind 'this' context sucessfully", () => {
        const Ext = doubleDispatch(Basic)
            .push([
                [String],
                function(a) {
                    return `Count: ${this.count()}, string: ${a}`;
                },
            ])
            .push([
                [Number],
                function(a) {
                    return `Count: ${this.count()}, number: ${a}`;
                },
            ]).resolve();
        expect(new Ext().dispatch('1')).toBe('Count: 10, string: 1');
        expect(new Ext().dispatch(1)).toBe('Count: 10, number: 1');
    });
});