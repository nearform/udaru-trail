'use strict'

const context = require('./_setup')()
const { v4: uuid } = require('uuid')
const { describe, it: test } = context.lab

module.exports.lab = context.lab

async function setupModels () {
  const organizationId = uuid()
  const userId = uuid()
  const policyId = uuid()
  const sharedPolicyId = uuid()

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

  await context.udaru.policies.create({
    id: policyId,
    version: '1',
    name: 'NAME',
    organizationId,
    statements: {
      Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
    }
  })

  await context.udaru.policies.createShared({
    id: sharedPolicyId,
    version: '1',
    name: 'NAME',
    statements: {
      Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
    }
  })

  return { organizationId, userId, policyId, sharedPolicyId }
}

describe('policies hooks', () => {
  test('- policy:create', async () => {
    const policyId = uuid()
    const { organizationId } = await setupModels()

    return context.checkHandler(
      'policies.create',
      {
        id: policyId,
        version: '1',
        name: 'NAME',
        organizationId,
        statements: {
          Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
        }
      },
      {
        who: 'root',
        what: 'policy:create',
        subject: {
          id: policyId,
          version: '1',
          name: 'NAME',
          organizationId,
          statements: {
            Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
          }
        }
      }
    )
  })

  test('- policy:update', async () => {
    const { policyId, organizationId } = await setupModels()

    return context.checkHandler(
      'policies.update',
      {
        id: policyId,
        version: '1',
        name: 'NAME',
        organizationId,
        statements: {
          Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
        }
      },
      {
        who: 'root',
        what: 'policy:update',
        subject: {
          id: policyId,
          version: '1',
          name: 'NAME',
          organizationId,
          statements: {
            Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
          }
        }
      }
    )
  })

  test('- policy:delete', async () => {
    const { policyId, organizationId } = await setupModels()

    return context.checkHandler(
      'policies.delete',
      {
        id: policyId,
        organizationId
      },
      {
        who: 'root',
        what: 'policy:delete',
        subject: { id: policyId, organizationId }
      }
    )
  })

  test('- policy:createShared', () => {
    const sharedPolicyId = uuid()

    return context.checkHandler(
      'policies.createShared',
      {
        id: sharedPolicyId,
        version: '1',
        name: 'NAME',
        statements: {
          Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
        }
      },
      {
        who: 'root',
        what: 'policy:createShared',
        subject: {
          id: sharedPolicyId,
          version: '1',
          name: 'NAME',
          statements: {
            Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
          }
        }
      }
    )
  })

  test('- policy:updateShared', async () => {
    const { sharedPolicyId } = await setupModels()

    return context.checkHandler(
      'policies.updateShared',
      {
        id: sharedPolicyId,
        version: '1',
        name: 'NAME',
        statements: {
          Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
        }
      },
      {
        who: 'root',
        what: 'policy:updateShared',
        subject: {
          id: sharedPolicyId,
          version: '1',
          name: 'NAME',
          statements: {
            Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
          }
        }
      }
    )
  })

  test('- policy:deleteShared', async () => {
    const { sharedPolicyId } = await setupModels()

    return context.checkHandler(
      'policies.deleteShared',
      {
        id: sharedPolicyId
      },
      {
        who: 'root',
        what: 'policy:deleteShared',
        subject: { id: sharedPolicyId }
      }
    )
  })
})
