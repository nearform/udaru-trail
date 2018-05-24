'use strict'

const { expect } = require('code')
const Lab = require('lab')
const sinon = require('sinon')

const udaru = require('@nearform/udaru-core')
const { TrailsManager } = require('@nearform/trail-core')
const getProperty = require('lodash/get')
const { DateTime } = require('luxon')
const { register } = require('../../lib')

let context = {}

module.exports = function () {
  if (context.checkHandler) return context

  context = {
    lab: Lab.script(),
    async checkHandler (name, args, trail) {
      const method = getProperty(context.udaru, name)
      await method(args)

      expect(
        context.insertionSpy.withArgs({
          when: sinon.match.instanceOf(DateTime),
          ...trail
        }).called
      ).to.be.true()
    }
  }

  context.lab.before(() => {
    context.udaru = udaru()
    context.trail = new TrailsManager()
    context.insertionSpy = sinon.spy(context.trail, 'insert')

    register(context.udaru, context.trail)
  })

  context.lab.after(async () => {
    context.insertionSpy.restore()

    try {
      await Promise.all([context.udaru.db.close(), context.trail.close()])
    } catch (e) {
      console.log(e)
      // No-op
    }
  })

  return context
}
