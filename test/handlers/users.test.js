'use strict'

const context = require('./_setup')()
const { v4: uuid } = require('uuid')
const { describe, it: test } = context.lab

module.exports.lab = context.lab

async function setupModels () {
  const userId = uuid()
  const organizationId = uuid()
  const organizationUserId = uuid()
  const teamId = uuid()
  const teamUserId = uuid()
  const policyId = uuid()

  await context.udaru.organizations.create({
    id: organizationId,
    name: 'NAME',
    description: 'DESCRIPTION',
    metadata: { a: '1' },
    user: {
      id: organizationUserId,
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

  await context.udaru.users.create({
    id: userId,
    name: 'NAME',
    organizationId,
    metadata: { a: '1' }
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

  return { userId, organizationId, organizationUserId, teamId, teamUserId, policyId }
}

describe('users hooks', () => {
  test('- users:create', async () => {
    const userId = uuid()
    const { organizationId } = await setupModels()

    return context.checkHandler(
      'users.create',
      {
        id: userId,
        name: 'NAME',
        organizationId,
        metadata: { a: '1' }
      },
      {
        who: 'root',
        what: 'users:create',
        subject: {
          id: userId,
          name: 'NAME',
          organizationId,
          metadata: { a: '1' }
        }
      }
    )
  })

  test('- users:update', async () => {
    const { userId, organizationId } = await setupModels()

    return context.checkHandler(
      'users.update',
      {
        id: userId,
        name: 'NAME',
        organizationId,
        metadata: { a: '1' }
      },
      {
        who: 'root',
        what: 'users:update',
        subject: {
          id: userId,
          name: 'NAME',
          organizationId,
          metadata: { a: '1' }
        }
      }
    )
  })

  test('- users:delete', async () => {
    const { userId, organizationId } = await setupModels()

    return context.checkHandler(
      'users.delete',
      {
        id: userId,
        organizationId
      },
      {
        who: 'root',
        what: 'users:delete',
        subject: {
          id: userId,
          organizationId
        }
      }
    )
  })

  test('- users:replacePolicies', async () => {
    const { userId, organizationId, policyId } = await setupModels()

    return context.checkHandler(
      'users.replacePolicies',
      {
        id: userId,
        organizationId,
        policies: [{ id: policyId }]
      },
      {
        who: 'root',
        what: 'users:replacePolicies',
        subject: {
          id: userId,
          organizationId
        },
        meta: {
          policies: [{ id: policyId, variables: {} }]
        }
      }
    )
  })

  test('- users:addPolicies', async () => {
    const { userId, organizationId, policyId } = await setupModels()

    return context.checkHandler(
      'users.addPolicies',
      {
        id: userId,
        organizationId,
        policies: [{ id: policyId }]
      },
      {
        who: 'root',
        what: 'users:addPolicies',
        subject: {
          id: userId,
          organizationId
        },
        meta: {
          policies: [{ id: policyId, variables: {} }]
        }
      }
    )
  })

  test('- users:amendPolicies', async () => {
    const { userId, organizationId, policyId } = await setupModels()

    return context.checkHandler(
      'users.amendPolicies',
      {
        id: userId,
        organizationId,
        policies: [{ id: policyId }]
      },
      {
        who: 'root',
        what: 'users:amendPolicies',
        subject: {
          id: userId,
          organizationId
        },
        meta: {
          policies: [{ id: policyId, variables: {} }]
        }
      }
    )
  })

  test('- users:deletePolicies', async () => {
    const { userId, organizationId } = await setupModels()

    return context.checkHandler(
      'users.deletePolicies',
      {
        id: userId,
        organizationId
      },
      {
        who: 'root',
        what: 'users:deletePolicies',
        subject: {
          id: userId,
          organizationId
        }
      }
    )
  })

  test('- users:deletePolicy', async () => {
    const { userId, organizationId, policyId } = await setupModels()

    return context.checkHandler(
      'users.deletePolicy',
      {
        userId,
        organizationId,
        policyId: policyId,
        instance: 1
      },
      {
        who: 'root',
        what: 'users:deletePolicy',
        subject: {
          id: userId,
          organizationId
        },
        meta: {
          policy: policyId,
          instance: 1
        }
      }
    )
  })

  test('- users:replaceTeams', async () => {
    const { userId, organizationId, teamId } = await setupModels()

    return context.checkHandler(
      'users.replaceTeams',
      {
        id: userId,
        organizationId,
        teams: [teamId]
      },
      {
        who: 'root',
        what: 'users:replaceTeams',
        subject: {
          id: userId,
          organizationId
        },
        meta: {
          teams: [teamId]
        }
      }
    )
  })

  test('- users:deleteTeams', async () => {
    const { userId, organizationId } = await setupModels()

    return context.checkHandler(
      'users.deleteTeams',
      {
        id: userId,
        organizationId
      },
      {
        who: 'root',
        what: 'users:deleteTeams',
        subject: {
          id: userId,
          organizationId
        }
      }
    )
  })
})
