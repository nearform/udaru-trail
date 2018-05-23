'use strict'

module.exports = {
  ...require('@nearform/trail-core/config/test'),
  hapi: {
    host: 'localhost',
    port: 8080
  }
}
