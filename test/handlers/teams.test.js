'use strict'

const context = require('./_setup')()
const { v4: uuid } = require('uuid')
const { describe, it: test } = context.lab

module.exports.lab = context.lab

async function setupModels () {
  const organizationId = uuid()
  const userId = uuid()
  const teamId = uuid()
  const teamUserId = uuid()
  const otherTeamId = uuid()
  const otherTeamUserId = uuid()
  const policyId = uuid()

  await context.udaru.organizations.create({
    id: organizationId,
    name: 'NAME',
    description: 'DESCRIPTION',
    metadata: { a: '1' },
    user: {
      id: userId,
      name: 'NAME'
    }
  })

  await context.udaru.teams.create({
    id: teamId,
    name: 'NAME',
    description: 'DESCRIPTION',
    metadata: { a: '1' },
    organizationId,
    parentId: null,
    user: {
      id: teamUserId,
      name: 'NAME'
    }
  })

  await context.udaru.teams.create({
    id: otherTeamId,
    name: 'NAME',
    description: 'DESCRIPTION',
    metadata: { a: '1' },
    organizationId,
    parentId: null,
    user: {
      id: otherTeamUserId,
      name: 'NAME'
    }
  })

  await context.udaru.policies.create({
    id: policyId,
    version: '1',
    name: 'NAME',
    organizationId,
    statements: {
      Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
    }
  })

  return { organizationId, teamId, userId, teamUserId, policyId }
}

describe('teams hooks', () => {
  test('- teams:create', async () => {
    const teamId = uuid()
    const userId = uuid()
    const { organizationId } = await setupModels()

    return context.checkHandler(
      'teams.create',
      {
        id: teamId,
        name: 'NAME',
        description: 'DESCRIPTION',
        metadata: { a: '1' },
        parentId: null,
        organizationId,
        user: {
          id: userId,
          name: 'NAME'
        }
      },
      {
        who: 'root',
        what: 'teams:create',
        subject: {
          id: teamId,
          name: 'NAME',
          description: 'DESCRIPTION',
          metadata: { a: '1' },
          parentId: null,
          organizationId,
          user: {
            id: userId,
            name: 'NAME'
          }
        }
      }
    )
  })

  test('- teams:update', async () => {
    const { teamId, organizationId } = await setupModels()

    return context.checkHandler(
      'teams.update',
      {
        id: teamId,
        name: 'NAME',
        description: 'DESCRIPTION',
        metadata: { a: '1' },
        organizationId
      },
      {
        who: 'root',
        what: 'teams:update',
        subject: {
          id: teamId,
          name: 'NAME',
          description: 'DESCRIPTION',
          metadata: { a: '1' },
          organizationId
        }
      }
    )
  })

  test('- teams:delete', async () => {
    const { teamId, organizationId } = await setupModels()

    return context.checkHandler(
      'teams.delete',
      {
        id: teamId,
        organizationId
      },
      {
        who: 'root',
        what: 'teams:delete',
        subject: {
          id: teamId,
          organizationId
        }
      }
    )
  })

  test('- teams:move', async () => {
    const { teamId, otherTeamId, organizationId } = await setupModels()

    return context.checkHandler(
      'teams.move',
      {
        id: teamId,
        parentId: otherTeamId,
        organizationId
      },
      {
        who: 'root',
        what: 'teams:move',
        subject: {
          id: teamId,
          parentId: otherTeamId,
          organizationId
        }
      }
    )
  })

  test('- teams:replacePolicies', async () => {
    const { teamId, organizationId, policyId } = await setupModels()

    return context.checkHandler(
      'teams.replacePolicies',
      {
        id: teamId,
        organizationId,
        policies: [{ id: policyId }]
      },
      {
        who: 'root',
        what: 'teams:replacePolicies',
        subject: {
          id: teamId,
          organizationId
        },
        meta: {
          policies: [{ id: policyId, variables: {} }]
        }
      }
    )
  })

  test('- teams:addPolicies', async () => {
    const { teamId, organizationId, policyId } = await setupModels()

    return context.checkHandler(
      'teams.addPolicies',
      {
        id: teamId,
        organizationId,
        policies: [{ id: policyId }]
      },
      {
        who: 'root',
        what: 'teams:addPolicies',
        subject: {
          id: teamId,
          organizationId
        },
        meta: {
          policies: [{ id: policyId, variables: {} }]
        }
      }
    )
  })

  test('- teams:amendPolicies', async () => {
    const { teamId, organizationId, policyId } = await setupModels()

    return context.checkHandler(
      'teams.amendPolicies',
      {
        id: teamId,
        organizationId,
        policies: [{ id: policyId }]
      },
      {
        who: 'root',
        what: 'teams:amendPolicies',
        subject: {
          id: teamId,
          organizationId
        },
        meta: {
          policies: [{ id: policyId, variables: {} }]
        }
      }
    )
  })

  test('- teams:deletePolicies', async () => {
    const { teamId, organizationId } = await setupModels()

    return context.checkHandler(
      'teams.deletePolicies',
      {
        id: teamId,
        organizationId
      },
      {
        who: 'root',
        what: 'teams:deletePolicies',
        subject: {
          id: teamId,
          organizationId
        }
      }
    )
  })

  test('- teams:deletePolicy', async () => {
    const { teamId, organizationId, policyId } = await setupModels()

    return context.checkHandler(
      'teams.deletePolicy',
      {
        teamId: teamId,
        organizationId,
        policyId: policyId,
        instance: 1
      },
      {
        who: 'root',
        what: 'teams:deletePolicy',
        subject: {
          id: teamId,
          organizationId
        },
        meta: {
          policy: policyId,
          instance: 1
        }
      }
    )
  })

  test('- teams:addUsers', async () => {
    const { teamId, organizationId, userId } = await setupModels()

    return context.checkHandler(
      'teams.addUsers',
      {
        id: teamId,
        organizationId,
        users: [userId]
      },
      {
        who: 'root',
        what: 'teams:addUsers',
        subject: {
          id: teamId,
          organizationId,
          users: [userId]
        }
      }
    )
  })

  test('- teams:replaceUsers', async () => {
    const { teamId, organizationId, userId } = await setupModels()

    return context.checkHandler(
      'teams.replaceUsers',
      {
        id: teamId,
        organizationId,
        users: [userId]
      },
      {
        who: 'root',
        what: 'teams:replaceUsers',
        subject: {
          id: teamId,
          organizationId
        },
        meta: {
          users: [userId]
        }
      }
    )
  })

  test('- teams:deleteMembers', async () => {
    const { teamId, organizationId } = await setupModels()

    return context.checkHandler(
      'teams.deleteMembers',
      {
        id: teamId,
        organizationId
      },
      {
        who: 'root',
        what: 'teams:deleteMembers',
        subject: {
          id: teamId,
          organizationId
        }
      }
    )
  })

  test('- teams:deleteMember', async () => {
    const { teamId, organizationId, userId } = await setupModels()

    return context.checkHandler(
      'teams.deleteMember',
      {
        id: teamId,
        organizationId,
        userId: userId
      },
      {
        who: 'root',
        what: 'teams:deleteMember',
        subject: {
          id: teamId,
          organizationId
        },
        meta: {
          user: userId
        }
      }
    )
  })
})
