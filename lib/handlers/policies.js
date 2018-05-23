'use strict'

function createPolicy ([{ id, version, name, organizationId, statements }]) {
  return {
    who: 'root',
    what: 'policy:create',
    subject: { id, version, name, organizationId, statements }
  }
}

function updatePolicy ([{ id, version, name, organizationId, statements }]) {
  return {
    who: 'root',
    what: 'policy:update',
    subject: { id, version, name, organizationId, statements }
  }
}

function deletePolicy ([{ id, organizationId }]) {
  return {
    who: 'root',
    what: 'policy:delete',
    subject: { id, organizationId }
  }
}

function createSharedPolicy ([{ id, version, name, statements }]) {
  return {
    who: 'root',
    what: 'policy:createShared',
    subject: { id, version, name, statements }
  }
}

function updateSharedPolicy ([{ id, version, name, statements }]) {
  return {
    who: 'root',
    what: 'policy:updateShared',
    subject: { id, version, name, statements }
  }
}

function deleteSharedPolicy ([{ id }]) {
  return {
    who: 'root',
    what: 'policy:deleteShared',
    subject: { id }
  }
}

module.exports = {
  'policy:create': createPolicy,
  'policy:update': updatePolicy,
  'policy:delete': deletePolicy,
  'policy:createShared': createSharedPolicy,
  'policy:updateShared': updateSharedPolicy,
  'policy:deleteShared': deleteSharedPolicy
}
