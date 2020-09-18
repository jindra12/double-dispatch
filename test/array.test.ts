import { doubleDispatch } from "../src/dispatch/dispatch";

class Basic {

}

describe("Can double dispatch on arrays", () => {
    test("Will do correct double dispatch for array of elements", () => {
        const Ext = doubleDispatch(Basic)
            .push([
                [[String]],
                value => value.length / 2,
            ]).push([
                [[Number]],
                value => value.length,
            ]).push([
                [Array],
                () => 'is an array',
            ]).resolve();
        expect(new Ext().dispatch([0, 1, 2])).toBe(3);
        expect(new Ext().dispatch(['Hello', 'James'])).toBe(1);
        expect(new Ext().dispatch([])).toBe('is an array');
    });
})