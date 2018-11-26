
[![Build Status](https://travis-ci.org/w11k/rx-utils.svg?branch=master)](https://travis-ci.org/w11k/rx-utils)
[![npm version](https://badge.fury.io/js/%40w11k%2Frx-utils.svg)](https://badge.fury.io/js/%40w11k%2Frx-utils)

# rx-utils

Utilities for RxJS

**Patrons**

❤️ [W11K - The Web Engineers](https://www.w11k.de/)

❤️ [theCodeCampus - Trainings for Angular and TypeScript](https://www.thecodecampus.de/)


## API Documentation

🗄 [TypeDoc online API documentation](https://w11k.github.io/rx-utils/modules/_index_.html)

Operator|Description
--|--
debounceIf|Debounce values on the stream if the predicate returns true


## TSLint rule

### w11k-rxjs-subscribe-takeuntil

This rule triggers if `Observable#subscribe()` is called and then enforces that 

- `.pipe()` is called directly before `.subscribe()`
- and that `takeUntil()` is called as the last pipe operator


#### Installation 

**Adjust your tslint.json**

```
{
  "rulesDirectory": [
    "node_modules/@w11k/rx-utils/dist/tslint_rules"
  ],
  "rules": {
    "w11k-rxjs-subscribe-takeuntil": true
  }
}
```

**Run tslint with type info**

```
tslint -p tsconfig.json -t verbose
```
