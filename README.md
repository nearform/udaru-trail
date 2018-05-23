# @nearform/udaru-trail

[![npm][npm-badge]][npm-url]

udaru-trail is a small package which adds [trail][trail] auditing capabilities to [udaru][udaru] via its hooks.

## Integrating into udaru

Once you have udaru and trail instantiated, simply call the register function:

```javascript
const udaru = require('@nearform/udaru-core')
const { TrailsManager } = require('@nearform/trail-core')
const { register } = require('@nearform/udaru-trail')

const udaruInstance = udaru()
const trailInstance = new TrailsManager()

// The third argument is option and is a list of udaru hooks you want to log. If omitted, all supported udaru hooks will be logged.
register(udaruInstance, trailInstance, ['authorize:isUserAuthorized'])
```

## Testing, benching & linting

Before running tests, make sure you have a working test environment for both udaru-core and trail-core packages.

To run tests:

```
npm run test
```

**Note:** running the tests will output duplicate keys errors in Postgres logs, this is expected, as the error handling of those cases is part of what is tested.

To lint the repository:

```
npm run lint
```

To fix (most) linting issues:

```
npm run lint -- --fix
```

To create coverage reports:

```
npm run coverage
```

## License

Copyright nearForm Ltd 2018. Licensed under [MIT][license].

[npm-url]: https://npmjs.org/package/@nearform/udaru-trail
[npm-badge]: https://img.shields.io/npm/v/@nearform/udaru-trail.svg
[trail]: https://github.com/nearform/trail
[udaru]: https://github.com/nearform/udaru
[license]: ./LICENSE.md
