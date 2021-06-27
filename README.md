![typed-ecstasy](https://lusito.github.io/typed-ecstasy/logo.png)

[![Minified + gzipped size](https://badgen.net/bundlephobia/minzip/typed-ecstasy)](https://www.npmjs.com/package/typed-ecstasy)
[![NPM version](https://badgen.net/npm/v/typed-ecstasy)](https://www.npmjs.com/package/typed-ecstasy)
[![License](https://badgen.net/github/license/lusito/typed-ecstasy)](https://github.com/lusito/typed-ecstasy/blob/master/LICENSE)
[![Stars](https://badgen.net/github/stars/lusito/typed-ecstasy)](https://github.com/lusito/typed-ecstasy)
[![Watchers](https://badgen.net/github/watchers/lusito/typed-ecstasy)](https://github.com/lusito/typed-ecstasy)
[![Build Status](https://travis-ci.org/Lusito/typed-ecstasy.svg?branch=master)](https://travis-ci.org/Lusito/typed-ecstasy)
[![Code Coverage](https://coveralls.io/repos/github/Lusito/typed-ecstasy/badge.svg?branch=master)](https://coveralls.io/github/Lusito/typed-ecstasy)

A tiny entity framework written in TypeScript. It started as a port of the C++ [Entity Component System](https://www.gamedev.net/page/resources/_/technical/game-programming/understanding-component-entity-systems-r3013)
[ecstasy](https://github.com/lusito/ecstasy), which is a port of [Ashley](https://github.com/libgdx/ashley/)
from LibGDX. typed-ecstasy is a high-performance entity framework  without the use of black-magic and thus making the API easy
and transparent to use.

Automated unit tests are running on [Travis-CI](https://travis-ci.org/)

#### Fair Warning
Since version 1, the target is now es2015, so if you want to support older browser, you'll have to ensure that this module is being transpiled to an older es version during your build-process.

### Get started

* [Read the documentation](https://lusito.github.io/typed-ecstasy/)
* Look at the test files (`src/**/*.spec.ts`) might answer some questions if the documentation doesn't cover it yet.
* Ask questions if the above doesn't clarify something good enough.

### Report issues

Something not working quite as expected? Do you need a feature that has not been implemented yet? Check the [issue tracker](https://github.com/Lusito/typed-ecstasy/issues) and add a new one if your problem is not already listed. Please try to provide a detailed description of your problem, including the steps to reproduce it.

### Contribute

Awesome! If you would like to contribute with a new feature or submit a bugfix, fork this repo and send a pull request. Please, make sure all the unit tests are passing before submitting and add new ones in case you introduced new features.

### License

typed-ecstasy is licensed under the [Apache 2 License](https://github.com/Lusito/typed-ecstasy/blob/master/LICENSE), meaning you
can use it free of charge, without strings attached in commercial and non-commercial projects. Credits are appreciated but not mandatory.
