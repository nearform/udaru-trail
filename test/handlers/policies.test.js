const { DateTime } = require('luxon')
const { bootstrap, beforeEachHandler, afterEachHandler, checkHandlers } = require('./utils')

describe('policies hooks', () => {
  beforeEach(async () => {
    await bootstrap.call(this)

    await this.udaru.organizations.create({
      id: 'ORGANIZATION',
      name: 'NAME',
      description: 'DESCRIPTION',
      metadata: { a: '1' },
      user: {
        id: 'USER',
        name: 'NAME'
      }
    })

    await this.udaru.policies.create({
      id: 'POLICY',
      version: '1',
      name: 'NAME',
      organizationId: 'ORGANIZATION',
      statements: {
        Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
      }
    })

    await this.udaru.policies.createShared({
      id: 'SHARED-POLICY',
      version: '1',
      name: 'NAME',
      statements: {
        Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
      }
    })

    return beforeEachHandler.call(this)
  })

  afterEach(async () => {
    try {
      await Promise.all([
        this.udaru.policies.delete({ id: 'POLICY', organizationId: 'ORGANIZATION' }),
        this.udaru.policies.delete({ id: 'POLICY-2', organizationId: 'ORGANIZATION' }),
        this.udaru.policies.deleteShared({ id: 'SHARED-POLICY' }),
        this.udaru.policies.deleteShared({ id: 'SHARED-POLICY-2' })
      ])
    } catch (e) {
      // No-op
    }

    try {
      await Promise.all([this.udaru.organizations.delete('ORGANIZATION')])
    } catch (e) {
      // No-op
    }

    return afterEachHandler.call(this)
  })

  const checks = [
    [
      'policies.create',
      {
        id: 'POLICY-2',
        version: '1',
        name: 'NAME',
        organizationId: 'ORGANIZATION',
        statements: {
          Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
        }
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'policy:create',
        subject: {
          id: 'POLICY-2',
          version: '1',
          name: 'NAME',
          organizationId: 'ORGANIZATION',
          statements: {
            Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
          }
        }
      }
    ],
    [
      'policies.update',
      {
        id: 'POLICY',
        version: '1',
        name: 'NAME',
        organizationId: 'ORGANIZATION',
        statements: {
          Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
        }
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'policy:update',
        subject: {
          id: 'POLICY',
          version: '1',
          name: 'NAME',
          organizationId: 'ORGANIZATION',
          statements: {
            Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
          }
        }
      }
    ],
    [
      'policies.delete',
      {
        id: 'POLICY',
        organizationId: 'ORGANIZATION'
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'policy:delete',
        subject: { id: 'POLICY', organizationId: 'ORGANIZATION' }
      }
    ],
    [
      'policies.createShared',
      {
        id: 'SHARED-POLICY-2',
        version: '1',
        name: 'NAME',
        statements: {
          Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
        }
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'policy:createShared',
        subject: {
          id: 'SHARED-POLICY-2',
          version: '1',
          name: 'NAME',
          statements: {
            Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
          }
        }
      }
    ],
    [
      'policies.updateShared',
      {
        id: 'SHARED-POLICY',
        version: '1',
        name: 'NAME',
        statements: {
          Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
        }
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'policy:updateShared',
        subject: {
          id: 'SHARED-POLICY',
          version: '1',
          name: 'NAME',
          statements: {
            Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
          }
        }
      }
    ],
    [
      'policies.deleteShared',
      {
        id: 'SHARED-POLICY'
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'policy:deleteShared',
        subject: { id: 'SHARED-POLICY' }
      }
    ]
  ]

  checkHandlers.call(this, checks)
})
