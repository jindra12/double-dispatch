import { Constructor, Callables } from '../types';

const typeCompare = (value: any, against: any) => {
    switch (typeof value) {
        case 'string':
            return against === String;
        case 'bigint':
            return against === BigInt;
        case 'boolean':
            return against === Boolean;
        case 'number':
            return against === Number;
        case 'symbol':
            return against === Symbol;
        case 'function':
        case 'object':
            if (Array.isArray(value) && value.length === 0) {
                return against === Array;
            }
            return value instanceof (against as any);
    }
    return false;
}

const arrayTypeCompare = (value: any[], against: any) => value.every(part => typeCompare(part, against));

export const doubleDispatch = <T extends Constructor>(toBuild: T) => {
    const callables: Callables<T, never, never> = {
        callables: [],
        push: callable => {
            callables.callables.push(callable as any);
            return callables as any;
        },
        resolve: () => {
            const extended = class Extended extends toBuild {
                dispatch = (...args: any[]) => {
                    for (let i = 0; i < callables.callables.length; i++) {
                        const list = callables.callables[i][0];
                        if (list.reduce((p: boolean, c, i) => {
                            if (!p) {
                                return false;
                            }
                            if (args[i] === undefined) {
                                return false;
                            }
                            if (Array.isArray(args[i]) && Array.isArray(c) && args[i].length > 0 && (c as any).length === 1) {
                                return arrayTypeCompare(args[i], c[0]);
                            }
                            return typeCompare(args[i], c);
                        }, true)) {
                            const bound: Function = (callables.callables[i][1] as any);
                            return bound.call(this, ...(args as any));
                        }
                    }
                    throw 'No valid double dispatch provided!';
                }
            };
            return extended as any;
        }
    };
    
    return callables; 
};
