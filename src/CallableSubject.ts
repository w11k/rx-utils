import {Observable, OperatorFunction, PartialObserver, Subject} from "rxjs";

function identity<T>(obj: T): T {
    return obj;
}

function delegateAllProperties(target: any, source: any) {
    // tslint:disable-next-line:forin
    for (const propName in source) {
        // noinspection JSUnfilteredForInLoop
        let prop = source[propName];
        if (typeof prop === "function") {
            prop = prop.bind(source);
        }

        let sourcePropDesc: PropertyDescriptor | undefined;
        while (sourcePropDesc === undefined && source !== undefined) {
            // noinspection JSUnfilteredForInLoop
            sourcePropDesc = Object.getOwnPropertyDescriptor(source, propName);
            if (sourcePropDesc === undefined) {
                source = Object.getPrototypeOf(source);
            }
        }

        if (sourcePropDesc !== undefined) {
            if (sourcePropDesc.get !== undefined) {
                sourcePropDesc.get = () => prop;
            }

            // noinspection JSUnfilteredForInLoop
            Object.defineProperty(target, propName, sourcePropDesc);
        }
    }
}

export type CallableSubject<I, O> = ((value: I) => void) & Observable<O> & PartialObserver<I>;

export function createCallableSubject<I>(): CallableSubject<I, I>;
export function createCallableSubject<I, O>(base: Subject<I>): CallableSubject<I, I>;
export function createCallableSubject<I, O>(base: Subject<I>, operator: OperatorFunction<I, O>): CallableSubject<I, O>;

export function createCallableSubject<I, O>(subject: Subject<I> = new Subject(),
                                            operator: OperatorFunction<I, O> = identity as any): CallableSubject<I, O> {
    const callable = (value: I) => {
        subject.next(value);
    };

    const observable: Observable<O> = subject.asObservable().pipe(operator);
    const fnMethods: Partial<Function> = {
        apply: callable.apply.bind(callable),
        bind: callable.bind.bind(callable),
        call: callable.call.bind(callable),
        length: callable.length,
        name: callable.name
    };
    delegateAllProperties(callable, subject);
    delegateAllProperties(callable, observable);
    delegateAllProperties(callable, fnMethods);

    // Required! Otherwise this CallableSubject could not be used with e.g. `takeUntil()`
    Object.setPrototypeOf(callable, observable);

    return callable as any;
}
