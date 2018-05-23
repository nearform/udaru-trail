'use strict'

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

function register (udaru, trail, handlersWhitelist = []) {
  // Create a TrailsManager if needed
  if (!(trail instanceof TrailsManager)) {
    if (!trail) trail = {}

    trail = new TrailsManager(trail.logger, trail.pool)
  }

  const handlers = {
    ...require('./handlers/authorization'),
    ...require('./handlers/organizations'),
    ...require('./handlers/policies'),
    ...require('./handlers/teams'),
    ...require('./handlers/users')
  }

  if (!Array.isArray(handlersWhitelist) || !handlersWhitelist.length) handlersWhitelist = Object.keys(handlers)

  for (const hook of handlersWhitelist) {
    const handler = handlers[hook]

    udaru.hooks.add(hook, log(trail, handler))
  }

  return { udaru, trail }
}

async function registerHapiPlugin (server, options) {
  register(server.udaru, server.trailCore, options.handlers)
}

module.exports = {
  log,
  register,

  UdaruTrailHapiPlugin: {
    pkg: require('../package'),
    register: registerHapiPlugin
  }
}
