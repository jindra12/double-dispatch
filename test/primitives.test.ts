import { doubleDispatch } from '../src/dispatch/dispatch';

class Basic {

}

describe("Can distinguish between numbers, strings and booleans", () => {
    test("Can distinguish between string and number", () => {
        const Ext = doubleDispatch(Basic)
            .push([
                [String],
                value => `this is string: ${value}`,
            ]).push([
                [Number],
                value => `this is number: ${value.toString()}`,
            ]).resolve();
        expect(new Ext().dispatch(0)).toBe('this is number: 0');
        expect(new Ext().dispatch('Hello')).toBe('this is string: Hello');
    });
    test("Can have multiple-return types", () => {
        const Ext = doubleDispatch(Basic)
            .push([
                [String],
                value => value + '1',
            ]).push([
                [Number],
                value => value + 1,
            ]).resolve();
        expect(new Ext().dispatch('1')).toBe('11');
        expect(new Ext().dispatch(1)).toBe(2);
    });
    test("Can distinguish between number and boolean", () => {
        const Ext = doubleDispatch(Basic)
            .push([
                [Number],
                value => `this is number: ${value}`,
            ]).push([
                [Boolean],
                value => value ? 'true' : 'false',
            ]).resolve();
        expect(new Ext().dispatch(true)).toBe('true');
        expect(new Ext().dispatch(1)).toBe('this is number: 1');
    });
    test("Can distinguish between bigint, symbol and function", () => {
        const Ext = doubleDispatch(Basic)
            .push([
                [Function],
                value => value(),
            ]).push([
                [BigInt],
                value => value.toString(),
            ]).push([
                [Symbol],
                value => 'symbol ' + value.toString(),
            ]).resolve();
        expect(new Ext().dispatch(() => true)).toBe(true);
        expect(new Ext().dispatch(BigInt(1))).toBe('1');
        expect(new Ext().dispatch(Symbol('4'))).toBe('symbol Symbol(4)');
    });
    test("Can dispatch on empty object", () => {
        const Ext = doubleDispatch(Basic)
            .push([
                [Number],
                value => `this is number: ${value}`,
            ]).push([
                [Object],
                () => 'this is an object',
            ]).resolve();
        expect(new Ext().dispatch(1)).toBe('this is number: 1');
        expect(new Ext().dispatch({})).toBe('this is an object');
    })
});