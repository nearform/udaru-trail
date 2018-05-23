'use strict'

const { DateTime } = require('luxon')
const { bootstrap, beforeEachHandler, afterEachHandler, checkHandlers } = require('./utils')

describe('authorization hooks', () => {
  beforeEach(async () => {
    await bootstrap.call(this)

    beforeEachHandler.call(this)
  })

  afterEach(async () => {
    return afterEachHandler.call(this)
  })

  const checks = [
    [
      'authorize.isUserAuthorized',
      {
        resource: 'RESOURCE',
        action: 'ACTION',
        userId: 'USER',
        organizationId: 'ORGANIZATION',
        sourceIpAddress: '127.0.0.1',
        sourcePort: '3000'
      },
      {
        when: expect.any(DateTime),
        who: {
          id: 'ORGANIZATION/USER',
          user: 'USER',
          organization: 'ORGANIZATION'
        },
        what: 'authorization:isUserAuthorized',
        subject: { id: 'RESOURCE', action: 'ACTION' },
        where: { ip: '127.0.0.1', port: '3000' },
        meta: {
          result: { access: false }
        }
      }
    ],
    [
      'authorize.batchAuthorization',
      {
        resourceBatch: [{ resource: 'RESOURCE', action: 'ACTION' }],
        userId: 'USER',
        organizationId: 'ORGANIZATION',
        sourceIpAddress: '127.0.0.1',
        sourcePort: '3000'
      },
      {
        when: expect.any(DateTime),
        who: {
          id: 'ORGANIZATION/USER',
          user: 'USER',
          organization: 'ORGANIZATION'
        },
        what: 'authorization:batchAuthorization',
        subject: {
          batch: [{ resource: 'RESOURCE', action: 'ACTION', access: false }]
        },
        where: {
          ip: '127.0.0.1',
          port: '3000'
        },
        meta: {
          result: [{ resource: 'RESOURCE', action: 'ACTION', access: false }]
        }
      }
    ],
    [
      'authorize.listActions',
      {
        resource: 'RESOURCE',
        userId: 'USER',
        organizationId: 'ORGANIZATION',
        sourceIpAddress: '127.0.0.1',
        sourcePort: '3000'
      },
      {
        when: expect.any(DateTime),
        who: {
          id: 'ORGANIZATION/USER',
          user: 'USER',
          organization: 'ORGANIZATION'
        },
        what: 'authorization:listActions',
        subject: 'RESOURCE',
        where: { ip: '127.0.0.1', port: '3000' },
        meta: {
          result: { actions: [] }
        }
      }
    ],
    [
      'authorize.listAuthorizationsOnResources',
      {
        resources: ['RESOURCE'],
        userId: 'USER',
        organizationId: 'ORGANIZATION',
        sourceIpAddress: '127.0.0.1',
        sourcePort: '3000'
      },
      {
        when: expect.any(DateTime),
        who: {
          id: 'ORGANIZATION/USER',
          user: 'USER',
          organization: 'ORGANIZATION'
        },
        what: 'authorization:listAuthorizationsOnResources',
        subject: { resources: ['RESOURCE'] },
        where: { ip: '127.0.0.1', port: '3000' },
        meta: {
          result: [{ actions: [], resource: 'RESOURCE' }]
        }
      }
    ]
  ]

  checkHandlers.call(this, checks)
})
