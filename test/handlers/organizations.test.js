const { DateTime } = require('luxon')
const { bootstrap, beforeEachHandler, afterEachHandler, checkHandlers } = require('./utils')

describe('organization hooks', () => {
  beforeEach(async () => {
    await bootstrap.call(this)

    await this.udaru.organizations.create({
      id: 'ID',
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
      organizationId: 'ID',
      statements: {
        Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
      }
    })

    return beforeEachHandler.call(this)
  })

  afterEach(async () => {
    try {
      await Promise.all([
        this.udaru.policies.delete({ id: 'POLICY', organizationId: 'ID' }),
        this.udaru.users.delete({ id: 'USER', organizationId: 'ID' }),
        this.udaru.users.delete({ id: 'USER-2', organizationId: 'ID-2' })
      ])
    } catch (e) {
      // No-op
    }

    try {
      await Promise.all([this.udaru.organizations.delete('ID'), this.udaru.organizations.delete('ID-2')])
    } catch (e) {
      // No-op
    }

    return afterEachHandler.call(this)
  })

  const checks = [
    [
      'organizations.create',
      {
        id: 'ID-2',
        name: 'NAME',
        description: 'DESCRIPTION',
        metadata: { a: '1' },
        user: {
          id: 'USER-2',
          name: 'NAME'
        }
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'organization:create',
        subject: {
          id: 'ID-2',
          name: 'NAME',
          description: 'DESCRIPTION',
          metadata: { a: '1' }
        }
      }
    ],
    [
      'organizations.update',
      {
        id: 'ID',
        name: 'NAME',
        description: 'DESCRIPTION',
        metadata: { a: '1' }
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'organization:update',
        subject: {
          id: 'ID',
          name: 'NAME',
          description: 'DESCRIPTION',
          metadata: { a: '1' }
        }
      }
    ],
    [
      'organizations.delete',
      'ID',
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'organization:delete',
        subject: { id: 'ID' }
      }
    ],
    [
      'organizations.addPolicies',
      {
        id: 'ID',
        policies: [{ id: 'POLICY' }]
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'organization:addPolicies',
        subject: { id: 'ID' },
        meta: { policies: [{ id: 'POLICY', variables: {} }] }
      }
    ],
    [
      'organizations.amendPolicies',
      {
        id: 'ID',
        policies: [{ id: 'POLICY' }]
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'organization:amendPolicies',
        subject: { id: 'ID' },
        meta: { policies: [{ id: 'POLICY', variables: {} }] }
      }
    ],
    [
      'organizations.replacePolicies',
      {
        id: 'ID',
        policies: [{ id: 'POLICY' }]
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'organization:replacePolicies',
        subject: { id: 'ID' },
        meta: { policies: [{ id: 'POLICY', variables: {} }] }
      }
    ],
    [
      'organizations.deletePolicies',
      {
        id: 'ID'
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'organization:deletePolicies',
        subject: { id: 'ID' }
      }
    ],
    [
      'organizations.deletePolicy',
      {
        id: 'ID',
        policyId: 'POLICY',
        instance: 1
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'organization:deletePolicy',
        subject: { id: 'ID' },
        meta: { policy: 'POLICY', instance: 1 }
      }
    ]
  ]

  checkHandlers.call(this, checks)
})
