export type ArrayOf<T> = [ExtConstructor<T>];

export type Constructor<T = {}> = (new (...args: any[]) => T);
export type ExtConstructor<T = {}> = Constructor<T> | BigIntConstructor | SymbolConstructor | ArrayOf<T>;

export type Appenders<A1, A2 = undefined, A3 = undefined, A4 = undefined, A5 = undefined> = A2 extends undefined
    ? [A1]
    : (
        A3 extends undefined
        ? [A1, A2]
        : (
            A4 extends undefined
            ? [A1, A2, A3]
            : (
                A5 extends undefined
                ? [A1, A2, A3, A4]
                : [A1, A2, A3, A4, A5]
            )
        )
    );
export type ClearedAppenders<A1, A2 = undefined, A3 = undefined, A4 = undefined, A5 = undefined> = A2 extends undefined
    ? [ClearInstanceType<A1>]
    : (
        A3 extends undefined
        ? [ClearInstanceType<A1>, ClearInstanceType<A2>]
        : (
            A4 extends undefined
            ? [ClearInstanceType<A1>, ClearInstanceType<A2>, ClearInstanceType<A3>]
            : (
                A5 extends undefined
                ? [ClearInstanceType<A1>, ClearInstanceType<A2>, ClearInstanceType<A3>, ClearInstanceType<A4>]
                : [ClearInstanceType<A1>, ClearInstanceType<A2>, ClearInstanceType<A3>, ClearInstanceType<A4>, ClearInstanceType<A5>]
            )
        )
    );

export type ClearInstanceType<T> = T extends NumberConstructor
    ? number
    : (
        T extends StringConstructor
        ? string
        : (
            T extends BooleanConstructor
            ? boolean
            : (
                T extends ArrayConstructor
                ? []
                : (
                    T extends DateConstructor
                    ? Date
                    : (
                        T extends BigIntConstructor
                        ? bigint
                        : (
                            T extends SymbolConstructor
                            ? symbol
                            : (
                                T extends [infer U]
                                ? Array<ClearInstanceType<U>>
                                : (
                                    T extends Constructor
                                    ? InstanceType<T>
                                    : never
                                )
                            )
                        )
                    )
                )
            )
        )
    );
export type CondConstructor<T extends (ExtConstructor | undefined)> = T extends ExtConstructor ? ClearInstanceType<T> : undefined;

export type AppendedFunction<
    Caller,
    T,
    A1 extends ExtConstructor,
    A2 extends (ExtConstructor | undefined) = undefined,
    A3 extends (ExtConstructor | undefined) = undefined,
    A4 extends (ExtConstructor | undefined) = undefined,
    A5 extends (ExtConstructor | undefined) = undefined
> = (this: Caller, a1: ClearInstanceType<A1>, a2: CondConstructor<A2>, a3: CondConstructor<A3>, a4: CondConstructor<A4>, a5: CondConstructor<A5>) => T;

export type Callable<
    Caller,
    T,
    A1 extends ExtConstructor,
    A2 extends (ExtConstructor | undefined) = undefined,
    A3 extends (ExtConstructor | undefined) = undefined,
    A4 extends (ExtConstructor | undefined) = undefined,
    A5 extends (ExtConstructor | undefined) = undefined
> = [Appenders<A1, A2, A3, A4, A5>, AppendedFunction<Caller, T, A1, A2, A3, A4, A5>];

export interface Callables<
    TBase extends ExtConstructor,
    T,
    A1 extends ExtConstructor,
    A2 extends (ExtConstructor | undefined) = undefined,
    A3 extends (ExtConstructor | undefined) = undefined,
    A4 extends (ExtConstructor | undefined) = undefined,
    A5 extends (ExtConstructor | undefined) = undefined
> {
    callables: Array<Callable<ClearInstanceType<TBase>, T, A1, A2, A3, A4, A5>>;
    push: <
        T1,
        A11 extends ExtConstructor,
        A21 extends (ExtConstructor | undefined) = undefined,
        A31 extends (ExtConstructor | undefined) = undefined,
        A41 extends (ExtConstructor | undefined) = undefined,
        A51 extends (ExtConstructor | undefined) = undefined
    >(
        callable: Callable<ClearInstanceType<TBase> & { dispatch: (...args: ClearedAppenders<A1, A2, A3, A4, A5>) => T }, T1, A11, A21, A31, A41, A51>
    ) => Callables<TBase, T | T1, A1 | A11, A2 | A21, A3 | A31, A4 | A41 | A5 | A51>;
    resolve: () => TBase & Constructor<{ dispatch: (...args: ClearedAppenders<A1, A2, A3, A4, A5>) => T }>
}