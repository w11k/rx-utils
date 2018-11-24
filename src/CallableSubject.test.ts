import * as assert from "assert";
import {ReplaySubject, Subject} from "rxjs";
import {map, takeUntil} from "rxjs/operators";
import {createCallableSubject} from "./CallableSubject";

describe("CallableSubject", function () {

    it("should use a Subject internally when created with no arguments", function () {
        const cs = createCallableSubject();
        cs(1);
        const values: any[] = [];
        cs.subscribe(val => values.push(val));
        cs(2);
        assert.deepStrictEqual(values, [2]);
    });

    it("the underlying Subject implementation can be changed", function () {
        const cs = createCallableSubject(new ReplaySubject<number>(1));
        cs(1);
        const values: any[] = [];
        cs.subscribe(val => values.push(val));
        cs(2);
        assert.deepStrictEqual(values, [1, 2]);
    });

    it("the output stream can be transformed", function () {
        const cs = createCallableSubject(new Subject<number>(), ($) => $.pipe(map(v => "-" + v)));
        const values: any[] = [];
        cs.subscribe((val: string) => values.push(val));
        cs(1);
        cs(2);
        assert.deepStrictEqual(values, ["-1", "-2"]);
    });

    it("the function methods can be used", function () {
        const cs = createCallableSubject<number>();
        const values: any[] = [];
        cs.subscribe((val: number) => values.push(val));
        cs.call(undefined, 1);
        assert.deepStrictEqual(values, [1]);
    });

    it("can be used as a parameter to takeUntil()", function () {
        const stop = createCallableSubject<true>();

        const subject = new Subject<number>();
        const values: any[] = [];
        subject.pipe(
            takeUntil(stop)
        ).subscribe(
            (val: number) => values.push(val)
        );
        subject.next(1);
        subject.next(2);
        stop(true);
        subject.next(3);


        assert.deepStrictEqual(values, [1, 2]);
    });

});
