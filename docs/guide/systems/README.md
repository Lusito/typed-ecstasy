# Overview

typed-ecstasy comes with a few Entity Systems that will spare you from typing boilerplate code.

**Make sure** to check out the page about [Dependency Injection](../core/dependency-injection.md).
All built-in EntitySystems require constructor arguments, so you'll need to create constructors, which call the super-constructor.

- [IteratingSystem](iteratingsystem.md): Iterate over a Family of entities
- [IntervalSystem](intervalsystem.md): Run code at a constant interval
- [IntervalIteratingSystem](intervaliteratingsystem.md): Iterate over a Family of entities at a constant interval
- [SortedIteratingSystem](sortediteratingsystem.md): Iterate over a sorted Family of entities
- [SortedSubIteratingSystem](sortedsubiteratingsystem.md): Imagine a SortedIteratingSystem that you can add SubSystems to
