# double-dispatch
A double dispatch builder for Javascript. Simply use the default exported method, like this:

Examples are of multiple dispatch, you can however easily create double dispatch as well.

## Example of basic use (from unit tests)

```typescript

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

```

## Example of bound 'this' context

```typescript

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

```

## Example of binding concrete classes

```typescript

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

```

For more examples, you can checkout the unit tests in my repo :) .

## Footer

If you have any ideas about improving this package, please fill an issue or create a pull request.