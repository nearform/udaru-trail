'use strict'

const TrailPlugin = require('@nearform/trail-hapi-plugin')
const { TrailsManager } = require('@nearform/trail-core')
const UdaruPlugin = require('@nearform/udaru-hapi-plugin')
const Hapi = require('hapi')
const { DateTime } = require('luxon')
const { register, log } = require('../lib')
const { UdaruTrailHapiPlugin } = require('../lib')
const uuid = require('uuid')

describe('main', () => {
  test('it should use provided TrailsManager', async () => {
    const udaru = { hooks: { add: jest.fn() } }
    const trail = new TrailsManager()
    const res = register(udaru, trail, ['authorization:isUserAuthorized'])

    expect(res).toMatchObject({
      udaru
    })

    expect(res.trail).toBe(trail)
    expect(res.udaru.hooks.add).toHaveBeenCalledTimes(1)

    await trail.close()
  })

  test('it should create a new TrailsManager if options were provided', async () => {
    const udaru = { hooks: { add: jest.fn() } }
    const res = register(udaru, { logger: 'LOGGER' })

    expect(res).toMatchObject({
      udaru,
      trail: expect.any(TrailsManager)
    })

    expect(res.trail.logger).toEqual('LOGGER')
    expect(res.udaru.hooks.add).not.toHaveBeenCalledTimes(1)

    await res.trail.close()
  })

  test('it should create a new TrailsManager if nothing provided', async () => {
    const udaru = { hooks: { add: jest.fn() } }
    const res = register(udaru)

    expect(res).toMatchObject({
      udaru,
      trail: expect.any(TrailsManager)
    })

    expect(res.udaru.hooks.add).not.toHaveBeenCalledTimes(1)

    await res.trail.close()
  })
})

describe('.log', () => {
  test('should insert into trail when the caller succeeded', async () => {
    const insert = jest.fn()
    const instance = log({ insert }, (args, result) => ({ who: 'ARGS' }))

    await instance()
    expect(insert).toHaveBeenCalledWith({
      when: expect.any(DateTime),
      who: 'ARGS'
    })
  })

  test('should not do anything when the caller failed', async () => {
    const insert = jest.fn()
    const instance = log({ insert }, (args, result) => [1, 2])

    await instance(new Error('ERROR'))
    expect(insert).not.toHaveBeenCalled()
  })
})

describe('Hapi integration', () => {
  describe('via udaru-hapi-plugin and trail-hapi-plugin', async () => {
    beforeEach(async () => {
      this.server = Hapi.Server({
        port: 3000,
        host: 'localhost',
        debug: false
      })

      this.trail = new TrailsManager()
      this.insertionSpy = jest.spyOn(this.trail, 'insert')

      await this.server.register(UdaruPlugin)
      await this.server.register(TrailPlugin)
      await this.server.register(UdaruTrailHapiPlugin)

      this.server.ext('onPostStop', () => {
        return this.server.udaru.db.close()
      })

      await this.server.start()
    })

    afterEach(() => {
      return Promise.all([this.trail.close(), this.server.stop()])
    })

    test('should record trails for udaru calls', async () => {
      const who = uuid.v4()

      const options = {
        method: 'GET',
        url: `/authorization/access/${who}/ACTION/RESOURCE`,
        headers: {
          authorization: 'ROOTid',
          org: 'ORGANIZATION'
        }
      }

      const response = await this.server.inject(options)
      const result = response.result

      expect(response.statusCode).toEqual(200)
      expect(result).toEqual({ access: false })

      const records = await this.trail.search({
        from: DateTime.utc().minus({ years: 1 }),
        to: DateTime.utc().plus({ years: 1 }),
        who
      })

      expect(records[0]).toEqual({
        id: expect.any(Number),
        when: expect.any(DateTime),
        who: {
          id: `ORGANIZATION/${who}`,
          attributes: {
            user: who,
            organization: 'ORGANIZATION'
          }
        },
        what: {
          id: 'authorization:isUserAuthorized',
          attributes: {}
        },
        subject: {
          id: 'RESOURCE',
          attributes: { action: 'ACTION' }
        },
        where: { ip: '127.0.0.1', port: '' },
        why: {},
        meta: {
          result: { access: false }
        }
      })
    })
  })
})
