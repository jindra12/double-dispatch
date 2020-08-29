import { doubleDispatch } from '../src/dispatch/dispatch';

class Basic {
    count = () => 10;
}

class Basic1 extends Basic {
    count1 = () => 11;
}

class Basic2 extends Basic {
    count2 = () => 12;
}

describe("Can apply double-dispatch to class structures", () => {
    test("Apply double dispatch to class structure", () => {
        const Ext = doubleDispatch(Basic)
            .push([
                [Basic1],
                value => value.count1() + value.count(),
            ]).push([
                [Basic2],
                value => value.count2() + value.count(),
            ]).push([
                [Basic],
                value => value.count(),
            ]).resolve();
        let basic: Basic = new Basic1();
        expect(new Ext().dispatch(basic)).toBe(21);
        basic = new Basic2();
        expect(new Ext().dispatch(basic)).toBe(22);
        basic = new Basic();
        expect(new Ext().dispatch(basic)).toBe(10);
    });
});