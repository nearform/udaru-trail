'use strict'

const { checkHandler, lab } = require('./_setup')()
const { v4: uuid } = require('uuid')
const { describe, it: test } = lab

module.exports.lab = lab

describe('authorization hooks', () => {
  const resource = uuid()
  const action = uuid()
  const user = uuid()
  const organization = uuid()

  test('- authorization:isUserAuthorized', () => {
    return checkHandler(
      'authorize.isUserAuthorized',
      {
        resource: resource,
        action: action,
        userId: user,
        organizationId: organization,
        sourceIpAddress: '127.0.0.1',
        sourcePort: '3000'
      },
      {
        who: {
          id: `${organization}/${user}`,
          user,
          organization
        },
        what: 'authorization:isUserAuthorized',
        subject: { id: resource, action },
        where: { ip: '127.0.0.1', port: '3000' },
        meta: {
          result: { access: false }
        }
      }
    )
  })

  test('- authorization:batchAuthorization', () => {
    return checkHandler(
      'authorize.batchAuthorization',
      {
        resourceBatch: [{ resource: resource, action }],
        userId: user,
        organizationId: organization,
        sourceIpAddress: '127.0.0.1',
        sourcePort: '3000'
      },
      {
        who: {
          id: `${organization}/${user}`,
          user,
          organization
        },
        what: 'authorization:batchAuthorization',
        subject: {
          batch: [{ resource: resource, action, access: false }]
        },
        where: {
          ip: '127.0.0.1',
          port: '3000'
        },
        meta: {
          result: [{ resource: resource, action, access: false }]
        }
      }
    )
  })

  test('- authorization:listActions', () => {
    return checkHandler(
      'authorize.listActions',
      {
        resource: resource,
        userId: user,
        organizationId: organization,
        sourceIpAddress: '127.0.0.1',
        sourcePort: '3000'
      },
      {
        who: {
          id: `${organization}/${user}`,
          user,
          organization
        },
        what: 'authorization:listActions',
        subject: resource,
        where: { ip: '127.0.0.1', port: '3000' },
        meta: {
          result: { actions: [] }
        }
      }
    )
  })

  test('- authorization:listAuthorizationsOnResources', () => {
    return checkHandler(
      'authorize.listAuthorizationsOnResources',
      {
        resources: [resource],
        userId: user,
        organizationId: organization,
        sourceIpAddress: '127.0.0.1',
        sourcePort: '3000'
      },
      {
        who: {
          id: `${organization}/${user}`,
          user,
          organization
        },
        what: 'authorization:listAuthorizationsOnResources',
        subject: { resources: [resource] },
        where: { ip: '127.0.0.1', port: '3000' },
        meta: {
          result: [{ actions: [], resource: resource }]
        }
      }
    )
  })
})
