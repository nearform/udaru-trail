const { register, log } = require('../lib')
const { TrailsManager } = require('@nearform/trail-core')

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

  test('it should create a new TrailsManager if none was provided', () => {
    const udaru = { hooks: { add: jest.fn() } }
    const res = register(udaru, { logger: 'LOGGER' })

    expect(res).toMatchObject({
      udaru,
      trail: expect.any(TrailsManager)
    })

    expect(res.trail.logger).toEqual('LOGGER')
    expect(res.udaru.hooks.add).not.toHaveBeenCalledTimes(1)
  })
})

describe('.log', () => {
  test('should insert into trail when the caller succeeded', async () => {
    const insert = jest.fn()
    const instance = log({ insert }, (args, result) => 'ARGS')

    await instance()
    expect(insert).toHaveBeenCalledWith('ARGS')
  })

  test('should not do anything when the caller failed', async () => {
    const insert = jest.fn()
    const instance = log({ insert }, (args, result) => [1, 2])

    await instance(new Error('ERROR'))
    expect(insert).not.toHaveBeenCalled()
  })
})
