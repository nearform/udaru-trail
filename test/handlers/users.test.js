'use strict'

const { DateTime } = require('luxon')
const { bootstrap, beforeEachHandler, afterEachHandler, checkHandlers } = require('./utils')

describe('users hooks', () => {
  beforeEach(async () => {
    await bootstrap.call(this)

    await this.udaru.organizations.create({
      id: 'ORGANIZATION',
      name: 'NAME',
      description: 'DESCRIPTION',
      metadata: { a: '1' },
      user: {
        id: 'ORG-USER',
        name: 'NAME'
      }
    })

    await this.udaru.teams.create({
      id: 'TEAM',
      name: 'NAME',
      description: 'DESCRIPTION',
      metadata: { a: '1' },
      organizationId: 'ORGANIZATION',
      parentId: null,
      user: {
        id: 'TEAM-USER',
        name: 'NAME'
      }
    })

    await this.udaru.users.create({
      id: 'USER',
      name: 'NAME',
      organizationId: 'ORGANIZATION',
      metadata: { a: '1' }
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

    return beforeEachHandler.call(this)
  })

  afterEach(async () => {
    try {
      await Promise.all([
        this.udaru.users.delete({ id: 'USER', organizationId: 'ORGANIZATION' }),
        this.udaru.users.delete({ id: 'USER-2', organizationId: 'ORGANIZATION' }),
        this.udaru.users.delete({ id: 'ORG-USER', organizationId: 'ORGANIZATION' }),
        this.udaru.users.delete({ id: 'TEAM-USER', organizationId: 'ORGANIZATION' }),
        this.udaru.policies.delete({ id: 'POLICY', organizationId: 'ORGANIZATION' }),
        this.udaru.teams.delete({ id: 'TEAM', organizationId: 'ORGANIZATION' })
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
      'users.create',
      {
        id: 'USER-2',
        name: 'NAME',
        organizationId: 'ORGANIZATION',
        metadata: { a: '1' }
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'users:create',
        subject: {
          id: 'USER-2',
          name: 'NAME',
          organizationId: 'ORGANIZATION',
          metadata: { a: '1' }
        }
      }
    ],
    [
      'users.update',
      {
        id: 'USER',
        name: 'NAME',
        organizationId: 'ORGANIZATION',
        metadata: { a: '1' }
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'users:update',
        subject: {
          id: 'USER',
          name: 'NAME',
          organizationId: 'ORGANIZATION',
          metadata: { a: '1' }
        }
      }
    ],
    [
      'users.delete',
      {
        id: 'USER',
        organizationId: 'ORGANIZATION'
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'users:delete',
        subject: {
          id: 'USER',
          organizationId: 'ORGANIZATION'
        }
      }
    ],
    [
      'users.replacePolicies',
      {
        id: 'USER',
        organizationId: 'ORGANIZATION',
        policies: [{ id: 'POLICY' }]
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'users:replacePolicies',
        subject: {
          id: 'USER',
          organizationId: 'ORGANIZATION'
        },
        meta: {
          policies: [{ id: 'POLICY', variables: {} }]
        }
      }
    ],
    [
      'users.addPolicies',
      {
        id: 'USER',
        organizationId: 'ORGANIZATION',
        policies: [{ id: 'POLICY' }]
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'users:addPolicies',
        subject: {
          id: 'USER',
          organizationId: 'ORGANIZATION'
        },
        meta: {
          policies: [{ id: 'POLICY', variables: {} }]
        }
      }
    ],
    [
      'users.amendPolicies',
      {
        id: 'USER',
        organizationId: 'ORGANIZATION',
        policies: [{ id: 'POLICY' }]
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'users:amendPolicies',
        subject: {
          id: 'USER',
          organizationId: 'ORGANIZATION'
        },
        meta: {
          policies: [{ id: 'POLICY', variables: {} }]
        }
      }
    ],
    [
      'users.deletePolicies',
      {
        id: 'USER',
        organizationId: 'ORGANIZATION'
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'users:deletePolicies',
        subject: {
          id: 'USER',
          organizationId: 'ORGANIZATION'
        }
      }
    ],
    [
      'users.deletePolicy',
      {
        userId: 'USER',
        organizationId: 'ORGANIZATION',
        policyId: 'POLICY',
        instance: 1
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'users:deletePolicy',
        subject: {
          id: 'USER',
          organizationId: 'ORGANIZATION'
        },
        meta: {
          policy: 'POLICY',
          instance: 1
        }
      }
    ],
    [
      'users.replaceTeams',
      {
        id: 'USER',
        organizationId: 'ORGANIZATION',
        teams: ['TEAM']
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'users:replaceTeams',
        subject: {
          id: 'USER',
          organizationId: 'ORGANIZATION'
        },
        meta: {
          teams: ['TEAM']
        }
      }
    ],
    [
      'users.deleteTeams',
      {
        id: 'USER',
        organizationId: 'ORGANIZATION'
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'users:deleteTeams',
        subject: {
          id: 'USER',
          organizationId: 'ORGANIZATION'
        }
      }
    ]
  ]

  checkHandlers.call(this, checks)
})
