# @nearform/udaru-trail

[![npm][npm-badge]][npm-url]
[![travis][travis-badge]][travis-url]
[![coveralls][coveralls-badge]][coveralls-url]

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

## Integrating into udaru and HAPI

Integration is supported via [udaru-hapi-plugin][udaru-hapi-plugin].

Register the `UdaruTrailHapiPlugin` after `UdaruPlugin` and after `TrailPlugin` and **BEFORE** starting the server:

```javascript
const TrailPlugin = require('@nearform/trail-hapi-plugin')
const UdaruPlugin = require('@nearform/udaru-hapi-plugin')
const { UdaruTrailHapiPlugin } = require('@nearform/udaru-trail')
const Hapi = require('hapi')

const server = Hapi.Server({port: 3000})

await this.server.register({plugin: UdaruPlugin})
await this.server.register({plugin: TrailPlugin})
await this.server.register({plugin: UdaruTrailHapiPlugin})

await this.server.start()
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
[travis-badge]: https://travis-ci.org/nearform/udaru-trail.svg?branch=master
[travis-url]: https://travis-ci.org/nearform/udaru-trail
[coveralls-badge]: https://coveralls.io/repos/nearform/udaru-trail/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/nearform/udaru-trail?branch=master
[trail]: https://github.com/nearform/trail
[udaru]: https://github.com/nearform/udaru
[udaru-hapi-plugin]: https://github.com/nearform/udaru/tree/master/packages/udaru-hapi-plugin
[license]: ./LICENSE.md
