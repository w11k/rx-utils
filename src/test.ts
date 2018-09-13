import {assert} from "chai";
import {of} from "rxjs";
import {tap} from "rxjs/operators";
import {
    entries,
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

    it("skipNull, skipUndefined", function (done) {
        const testValue = "x" as string | undefined | null;
        const testValue$ = of(testValue);
        testValue$
            .pipe(
                skipNull,
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
