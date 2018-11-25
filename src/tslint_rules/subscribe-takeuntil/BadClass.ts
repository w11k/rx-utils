import {of} from "rxjs";
import {map, takeUntil} from "rxjs/operators";

class SomeClass {
    subscribe() {
    }
}

declare const scoped: any;

class BadClass {

    observable = of(1);
    stop = of(1);

    constructor() {
        // Error
        this.observable.pipe(
            map(i => i),
            takeUntil(this.stop),
            map(i => i),
        ).subscribe();

        // Error
        this.observable.pipe(
            map(i => i),
        ).subscribe();

        // Error
        this.observable.pipe().subscribe();

        // Error
        this.observable.subscribe();

        // OK
        this.observable.lift(scoped()).subscribe();

        // OK
        this.observable.pipe(
            map(i => i),
            takeUntil(this.stop),
        ).subscribe();

        // OK
        new SomeClass().subscribe();
    }

}
