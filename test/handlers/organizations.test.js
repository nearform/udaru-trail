'use strict'

const context = require('./_setup')()
const { v4: uuid } = require('uuid')
const { describe, it: test } = context.lab

module.exports.lab = context.lab

async function setupModels () {
  const organizationId = uuid()
  const userId = uuid()
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

  await context.udaru.policies.create({
    id: policyId,
    version: '1',
    name: 'NAME',
    organizationId: organizationId,
    statements: {
      Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['*'] }]
    }
  })

  return { organizationId, userId, policyId }
}

describe('organization hooks', () => {
  test('- organization:create', () => {
    const organizationId = uuid()
    const userId = uuid()

    return context.checkHandler(
      'organizations.create',
      {
        id: organizationId,
        name: 'NAME',
        description: 'DESCRIPTION',
        metadata: { a: '1' },
        user: {
          id: userId,
          name: 'NAME'
        }
      },
      {
        who: 'root',
        what: 'organization:create',
        subject: {
          id: organizationId,
          name: 'NAME',
          description: 'DESCRIPTION',
          metadata: { a: '1' }
        }
      }
    )
  })

  test('- organization:update', async () => {
    const { organizationId } = await setupModels()

    return context.checkHandler(
      'organizations.update',
      {
        id: organizationId,
        name: 'NAME',
        description: 'DESCRIPTION',
        metadata: { a: '1' }
      },
      {
        who: 'root',
        what: 'organization:update',
        subject: {
          id: organizationId,
          name: 'NAME',
          description: 'DESCRIPTION',
          metadata: { a: '1' }
        }
      }
    )
  })

  test('- organization:delete', async () => {
    const { organizationId } = await setupModels()

    return context.checkHandler('organizations.delete', organizationId, {
      who: 'root',
      what: 'organization:delete',
      subject: {
        id: organizationId
      }
    })
  })

  test('- organization:addPolicies', async () => {
    const { organizationId, policyId } = await setupModels()

    return context.checkHandler(
      'organizations.addPolicies',
      {
        id: organizationId,
        policies: [{ id: policyId }]
      },
      {
        who: 'root',
        what: 'organization:addPolicies',
        subject: { id: organizationId },
        meta: { policies: [{ id: policyId, variables: {} }] }
      }
    )
  })

  test('- organization:amendPolicies', async () => {
    const { organizationId, policyId } = await setupModels()

    return context.checkHandler(
      'organizations.amendPolicies',
      {
        id: organizationId,
        policies: [{ id: policyId }]
      },
      {
        who: 'root',
        what: 'organization:amendPolicies',
        subject: { id: organizationId },
        meta: { policies: [{ id: policyId, variables: {} }] }
      }
    )
  })

  test('- organization:replacePolicies', async () => {
    const { organizationId, policyId } = await setupModels()

    return context.checkHandler(
      'organizations.replacePolicies',
      {
        id: organizationId,
        policies: [{ id: policyId }]
      },
      {
        who: 'root',
        what: 'organization:replacePolicies',
        subject: { id: organizationId },
        meta: { policies: [{ id: policyId, variables: {} }] }
      }
    )
  })

  test('- organization:deletePolicies', async () => {
    const { organizationId } = await setupModels()

    return context.checkHandler(
      'organizations.deletePolicies',
      {
        id: organizationId
      },
      {
        who: 'root',
        what: 'organization:deletePolicies',
        subject: { id: organizationId }
      }
    )
  })

  test('- organization:deletePolicy', async () => {
    const { organizationId, policyId } = await setupModels()

    return context.checkHandler(
      'organizations.deletePolicy',
      {
        id: organizationId,
        policyId: policyId,
        instance: 1
      },
      {
        who: 'root',
        what: 'organization:deletePolicy',
        subject: { id: organizationId },
        meta: { policy: policyId, instance: 1 }
      }
    )
  })
})
