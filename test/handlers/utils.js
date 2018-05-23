const udaru = require('@nearform/udaru-core')
const { TrailsManager } = require('@nearform/trail-core')
const { register } = require('../../lib')
const getProperty = require('lodash/get')

module.exports = {
  bootstrap () {
    this.udaru = udaru()
    this.trail = new TrailsManager()
  },

  beforeEachHandler () {
    this.insertion = jest.spyOn(this.trail, 'insert')

    register(this.udaru, this.trail)
  },

  async afterEachHandler () {
    await this.udaru.db.close()
    await this.trail.close()
  },

  async checkHandlers (checks) {
    for (const [name, args, trail] of checks) {
      test(name, async () => {
        const method = getProperty(this.udaru, name)

        await method(args)

        expect(this.insertion).toHaveBeenCalledWith(trail)
      })
    }
  }
}
