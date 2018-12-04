import {assert} from "chai";
import {of, Subject} from "rxjs";
import {tap} from "rxjs/operators";
import {
    debounceIf,
    entries,
    replayOn,
    skipNil,
    skipNull,
    skipPropertyNil,
    skipPropertyNull,
    skipPropertyUndefined,
    skipSomePropertyNil,
    skipUndefined
} from "./index";

describe("rx-utils", function () {

    it("entries", function () {
        const obj = {
            a: 1,
            2: "b"
        };

        assert.notSameOrderedMembers(entries(obj), [
            ["a", 1],
            ["2", "b"],
        ]);
    });

    it("skipNull", function (done) {
        const testValue = "x" as string | null;
        const testValue$ = of(testValue);
        testValue$
            .pipe(
                skipNull,
                tap(x => x.charAt(0)) // compiler check
            )
            .subscribe(x => {
                assert.equal(x, testValue);
                done();
            });
    });

    it("skipUndefined", function (done) {
        const testValue = "x" as string | undefined;
        const testValue$ = of(testValue);
        testValue$
            .pipe(
                skipUndefined,
                tap(x => x.charAt(0)) // compiler check
            )
            .subscribe(x => {
                assert.equal(x, testValue);
                done();
            });
    });

    it("skipNil", function (done) {
        const testValue = "x" as string | undefined | null;
        const testValue$ = of(testValue);
        testValue$
            .pipe(
                skipNil,
                tap(x => x.charAt(0)) // compiler check
            )
            .subscribe(x => {
                assert.equal(x, testValue);
                done();
            });
    });


    it("todo", function () {
        const testObj = {
            a: "a" as string | null,
            b: "b" as string | undefined,
            c: "c" as string | undefined | null,
            d: "d" as string,
            // d: 'd' as string | undefined,
        };

        const testObj$ = of(testObj);

        testObj$
            .pipe(skipPropertyNull("a"))
            .pipe(skipPropertyUndefined("b"))
            .pipe(skipPropertyNil("c"))
            .pipe(tap(x => x.a.charAt(0)))
            .pipe(tap(x => x.b.charAt(0)))
            .pipe(tap(x => x.c.charAt(0)))
            .pipe(tap(x => x.d.charAt(0)))
        ;

        testObj$
            .pipe(skipSomePropertyNil)
            .pipe(tap(x => x.a.charAt(0)))
            .pipe(tap(x => x.b.charAt(0)))
            .pipe(tap(x => x.c.charAt(0)))
            .pipe(tap(x => x.d.charAt(0)))
        ;
    });

});

describe("debounceIf", function () {

    it("does not debounce if the predicate returns false", function () {
        const source = of(1, 2);
        const values: any[] = [];
        source.pipe(
            debounceIf(1000, () => false)
        ).subscribe(value => {
            values.push(value);
        });
        assert.deepEqual(values, [1, 2]);
    });

    it("debounces if the predicate returns true", function (done) {
        const source = of(1, 2);

        let async = false;
        let called = 0;
        source.pipe(
            debounceIf(0, (prev, cur) => {
                if (called === 0) {
                    assert.isUndefined(prev);
                    assert.equal(cur, 1);
                } else if (called === 1) {
                    assert.equal(prev, 1);
                    assert.equal(cur, 2);
                }

                called++;
                return true;
            })
        ).subscribe(value => {
            assert.isTrue(async);
            assert.equal(called, 2);
            assert.equal(value, 2);
            done();
        });
        async = true;
    });

});

describe("replayOn", function () {

    it("passes values", function () {
        const source = of(1, 2);
        const trigger = new Subject();
        const values: any[] = [];
        source.pipe(
            replayOn(trigger)
        ).subscribe(value => {
            values.push(value);
        });
        assert.deepEqual(values, [1, 2]);
    });

    it("replays last value on signal", function () {
        const source = new Subject<number>();
        const trigger = new Subject();
        const values: any[] = [];
        source.pipe(
            replayOn(trigger)
        ).subscribe(value => {
            values.push(value);
        });

        source.next(1);
        source.next(2);
        trigger.next();
        source.next(3);
        trigger.next();

        assert.deepEqual(values, [1, 2, 2, 3, 3]);
    });

});
