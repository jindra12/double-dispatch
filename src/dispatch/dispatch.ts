import { Constructor, Callables } from '../types';

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
                            switch (typeof args[i]) {
                                case 'string':
                                    return c === String;
                                case 'bigint':
                                    return c === BigInt;
                                case 'boolean':
                                    return c === Boolean;
                                case 'number':
                                    return c === Number;
                                case 'symbol':
                                    return c === Symbol;
                                case 'function':
                                case 'object':
                                    return args[i] instanceof (c as any);
                            }
                            return false;
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
