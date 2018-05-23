'use strict'

const { DateTime } = require('luxon')
const { bootstrap, beforeEachHandler, afterEachHandler, checkHandlers } = require('./utils')

describe('teams hooks', () => {
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

    await this.udaru.teams.create({
      id: 'TEAM-2',
      name: 'NAME',
      description: 'DESCRIPTION',
      metadata: { a: '1' },
      organizationId: 'ORGANIZATION',
      parentId: null,
      user: {
        id: 'TEAM-USER-2',
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

    return beforeEachHandler.call(this)
  })

  afterEach(async () => {
    try {
      await Promise.all([
        this.udaru.users.delete({ id: 'USER', organizationId: 'ORGANIZATION' }),
        this.udaru.users.delete({ id: 'TEAM-USER', organizationId: 'ORGANIZATION' }),
        this.udaru.users.delete({ id: 'TEAM-USER-2', organizationId: 'ORGANIZATION' }),
        this.udaru.users.delete({ id: 'TEAM-USER-3', organizationId: 'ORGANIZATION' }),
        this.udaru.teams.delete({ id: 'TEAM', organizationId: 'ORGANIZATION' }),
        this.udaru.teams.delete({ id: 'TEAM-2', organizationId: 'ORGANIZATION' }),
        this.udaru.teams.delete({ id: 'TEAM-3', organizationId: 'ORGANIZATION' }),
        this.udaru.policies.delete({ id: 'POLICY', organizationId: 'ORGANIZATION' })
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
      'teams.create',
      {
        id: 'TEAM-3',
        name: 'NAME',
        description: 'DESCRIPTION',
        metadata: { a: '1' },
        parentId: null,
        organizationId: 'ORGANIZATION',
        user: {
          id: 'TEAM-USER-3',
          name: 'NAME'
        }
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'teams:create',
        subject: {
          id: 'TEAM-3',
          name: 'NAME',
          description: 'DESCRIPTION',
          metadata: { a: '1' },
          parentId: null,
          organizationId: 'ORGANIZATION',
          user: {
            id: 'TEAM-USER-3',
            name: 'NAME'
          }
        }
      }
    ],
    [
      'teams.update',
      {
        id: 'TEAM',
        name: 'NAME',
        description: 'DESCRIPTION',
        metadata: { a: '1' },
        organizationId: 'ORGANIZATION'
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'teams:update',
        subject: {
          id: 'TEAM',
          name: 'NAME',
          description: 'DESCRIPTION',
          metadata: { a: '1' },
          organizationId: 'ORGANIZATION'
        }
      }
    ],
    [
      'teams.delete',
      {
        id: 'TEAM',
        organizationId: 'ORGANIZATION'
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'teams:delete',
        subject: {
          id: 'TEAM',
          organizationId: 'ORGANIZATION'
        }
      }
    ],
    [
      'teams.move',
      {
        id: 'TEAM',
        parentId: 'TEAM-2',
        organizationId: 'ORGANIZATION'
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'teams:move',
        subject: {
          id: 'TEAM',
          parentId: 'TEAM-2',
          organizationId: 'ORGANIZATION'
        }
      }
    ],
    [
      'teams.replacePolicies',
      {
        id: 'TEAM',
        organizationId: 'ORGANIZATION',
        policies: [{ id: 'POLICY' }]
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'teams:replacePolicies',
        subject: {
          id: 'TEAM',
          organizationId: 'ORGANIZATION'
        },
        meta: {
          policies: [{ id: 'POLICY', variables: {} }]
        }
      }
    ],
    [
      'teams.addPolicies',
      {
        id: 'TEAM',
        organizationId: 'ORGANIZATION',
        policies: [{ id: 'POLICY' }]
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'teams:addPolicies',
        subject: {
          id: 'TEAM',
          organizationId: 'ORGANIZATION'
        },
        meta: {
          policies: [{ id: 'POLICY', variables: {} }]
        }
      }
    ],
    [
      'teams.amendPolicies',
      {
        id: 'TEAM',
        organizationId: 'ORGANIZATION',
        policies: [{ id: 'POLICY' }]
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'teams:amendPolicies',
        subject: {
          id: 'TEAM',
          organizationId: 'ORGANIZATION'
        },
        meta: {
          policies: [{ id: 'POLICY', variables: {} }]
        }
      }
    ],
    [
      'teams.deletePolicies',
      {
        id: 'TEAM',
        organizationId: 'ORGANIZATION'
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'teams:deletePolicies',
        subject: {
          id: 'TEAM',
          organizationId: 'ORGANIZATION'
        }
      }
    ],
    [
      'teams.deletePolicy',
      {
        teamId: 'TEAM',
        organizationId: 'ORGANIZATION',
        policyId: 'POLICY',
        instance: 1
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'teams:deletePolicy',
        subject: {
          id: 'TEAM',
          organizationId: 'ORGANIZATION'
        },
        meta: {
          policy: 'POLICY',
          instance: 1
        }
      }
    ],
    [
      'teams.addUsers',
      {
        id: 'TEAM',
        organizationId: 'ORGANIZATION',
        users: ['USER']
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'teams:addUsers',
        subject: {
          id: 'TEAM',
          organizationId: 'ORGANIZATION',
          users: ['USER']
        }
      }
    ],
    [
      'teams.replaceUsers',
      {
        id: 'TEAM',
        organizationId: 'ORGANIZATION',
        users: ['USER']
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'teams:replaceUsers',
        subject: {
          id: 'TEAM',
          organizationId: 'ORGANIZATION'
        },
        meta: {
          users: ['USER']
        }
      }
    ],
    [
      'teams.deleteMembers',
      {
        id: 'TEAM',
        organizationId: 'ORGANIZATION'
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'teams:deleteMembers',
        subject: {
          id: 'TEAM',
          organizationId: 'ORGANIZATION'
        }
      }
    ],
    [
      'teams.deleteMember',
      {
        id: 'TEAM',
        organizationId: 'ORGANIZATION',
        userId: 'USER'
      },
      {
        when: expect.any(DateTime),
        who: 'root',
        what: 'teams:deleteMember',
        subject: {
          id: 'TEAM',
          organizationId: 'ORGANIZATION'
        },
        meta: {
          user: 'USER'
        }
      }
    ]
  ]

  checkHandlers.call(this, checks)
})
