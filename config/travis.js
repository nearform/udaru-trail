'use strict'

module.exports = {
  ...require('@nearform/trail-core/config/travis'),
  hapi: {
    host: 'localhost',
    port: 8080
  }
}
