import {combineLatest, Observable} from "rxjs";
import {filter, map} from "rxjs/operators";


function entries<T>(o: { [s: string]: T } | ArrayLike<T>): [string, T][] {
    const result: [string, T][] = [];
    const keys = Object.keys(o);

    for (let key of keys) {
        result.push([key, (o as any)[key]]);
    }

    return result;
}

export function notNil<T>(x: T | null | undefined): x is T {
    return x !== null && x !== undefined;
}

export function notNull<T>(x: T | null): x is T {
    return x !== null;
}

export function notUndefined<T>(x: T | undefined): x is T {
    return x !== null;
}

export const skipUndefined = <T>(source: Observable<T | undefined>) => {
    return source.pipe(filter(notUndefined));
};

export const skipNull = <T>(source: Observable<T | null>) => {
    return source.pipe(filter(notNull));
};

export const skipNil = <T>(source: Observable<T | null | undefined>) => {
    return source.pipe(filter(notNil));
};

type NonNull<T> = T extends null ? never : T;
type NonUndefined<T> = T extends undefined ? never : T;
type NonNil<T> = T extends null | undefined ? never : T;

export function propertiesNotNull<T>(obj: T): obj is { [P in keyof T]: NonNull<T[P]> } {
    const hasNull = entries(obj)
        .some(x => x[1] === null);

    return !hasNull;
}

export function propertyNotNull<T, P extends keyof T>(property: P) {
    return (obj: T): obj is { [X in keyof T]: X extends P ? NonNull<T[X]> : T[X] } => {
        const value = obj[property];

        return value !== null;
    };
}

export function propertiesNotUndefined<T>(obj: T): obj is { [P in keyof T]: NonUndefined<T[P]> } {
    const hasUndefined = Object.entries(obj)
        .some(x => x[1] === undefined);

    return !hasUndefined;
}

export function propertyNotUndefined<T, P extends keyof T>(property: P) {
    return (obj: T): obj is { [X in keyof T]: X extends P ? NonNil<T[X]> : T[X] } => {
        const value = obj[property];

        return value !== undefined;
    };
}

export function propertiesNotNil<T>(obj: T): obj is { [P in keyof T]: NonNil<T[P]> } {
    const hasNil = Object.entries(obj)
        .some(x => x[1] === null || x[1] === undefined);

    return !hasNil;
}

export function propertyNotNil<T, P extends keyof T>(property: P) {
    return (obj: T): obj is { [X in keyof T]: X extends P ? NonNil<T[X]> : T[X] } => {
        const value = obj[property];

        return value !== null && value !== undefined;
    };
}

export function skipSomePropertyNull<T>(source: Observable<T>) {
    return source.pipe(filter(propertiesNotNull));
}

export function skipPropertyNull<T, P extends keyof T>(prop: P) {
    return function (source: Observable<T>) {
        return source.pipe(filter(propertyNotNull(prop)));
    };
}

export function skipSomePropertyUndefined<T>(source: Observable<T>) {
    return source.pipe(filter(propertiesNotUndefined));
}

export function skipPropertyUndefined<T, P extends keyof T>(prop: P) {
    return function (source: Observable<T>) {
        return source.pipe(filter(propertyNotUndefined(prop)));
    };
}

export function skipSomePropertyNil<T>(source: Observable<T>) {
    return source.pipe(filter(propertiesNotNil));
}

export function skipPropertyNil<T, P extends keyof T>(prop: P) {
    return function (source: Observable<T>) {
        return source.pipe(filter(propertyNotNil(prop)));
    };
}


export function combineLatestToMap<T>(obsMap: { [P in keyof T]: Observable<T[P]> }): Observable<T> {
    const keys = Object.keys(obsMap);

    // ensure same order for values and keys
    const values$ = keys.map(key => (obsMap as any)[key]);

    return combineLatest(values$).pipe(map(values => {
        // try to get rid of any
        // const mapOfValues: {[P in keyof T]: T[P]} = {};
        const mapOfValues: any = {};

        keys.forEach((key, index) => {
            mapOfValues[key] = values[index];
        });

        return mapOfValues;
    }));
}


