const { TrailsManager } = require('@nearform/trail-core')
const { DateTime } = require('luxon')

function log (trailManager, converter) {
  return async function (error, args, result) {
    if (error) return // Don't do anything when erroring

    const trail = await converter(args, result)
    trail.when = DateTime.utc()

    return trailManager.insert(trail)
  }
}

module.exports = {
  log,

  register: function (udaru, trail, hooks = []) {
    // Create a TrailsManager if needed
    if (!(trail instanceof TrailsManager)) {
      trail = new TrailsManager(trail.logger, trail.pool)
    }

    const handlers = {
      ...require('./handlers/authorization'),
      ...require('./handlers/organizations'),
      ...require('./handlers/policies'),
      ...require('./handlers/teams'),
      ...require('./handlers/users')
    }

    if (!Array.isArray(hooks) || !hooks.length) hooks = Object.keys(handlers)

    for (const hook of hooks) {
      const handler = handlers[hook]

      udaru.hooks.add(hook, log(trail, handler))
    }

    return { udaru, trail }
  }
}
