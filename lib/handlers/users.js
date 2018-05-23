function createUser ([{ id, organizationId, name, metadata }]) {
  return {
    who: 'root',
    what: 'users:create',
    subject: { id, organizationId, name, metadata }
  }
}

function updateUser ([{ id, organizationId, name, metadata }]) {
  return {
    who: 'root',
    what: 'users:update',
    subject: { id, organizationId, name, metadata }
  }
}

function deleteUser ([{ id, organizationId }]) {
  return {
    who: 'root',
    what: 'users:delete',
    subject: { id, organizationId }
  }
}

function replacePolicies ([{ id, organizationId, policies }]) {
  return {
    who: 'root',
    what: 'users:replacePolicies',
    subject: { id, organizationId },
    meta: { policies }
  }
}

function addPolicies ([{ id, organizationId, policies }]) {
  return {
    who: 'root',
    what: 'users:addPolicies',
    subject: { id, organizationId },
    meta: { policies }
  }
}

function amendPolicies ([{ id, organizationId, policies }]) {
  return {
    who: 'root',
    what: 'users:amendPolicies',
    subject: { id, organizationId },
    meta: { policies }
  }
}

function deletePolicies ([{ id, organizationId }]) {
  return {
    who: 'root',
    what: 'users:deletePolicies',
    subject: { id, organizationId }
  }
}

function deletePolicy ([{ userId: id, organizationId, policyId: policy, instance }]) {
  return {
    who: 'root',
    what: 'users:deletePolicy',
    subject: { id, organizationId },
    meta: { policy, instance }
  }
}

function replaceTeams ([{ id, organizationId, teams }]) {
  return {
    who: 'root',
    what: 'users:replaceTeams',
    subject: { id, organizationId },
    meta: { teams }
  }
}

function deleteTeams ([{ id, organizationId }]) {
  return {
    who: 'root',
    what: 'users:deleteTeams',
    subject: { id, organizationId }
  }
}

module.exports = {
  'users:create': createUser,
  'users:update': updateUser,
  'users:delete': deleteUser,
  'users:replacePolicies': replacePolicies,
  'users:addPolicies': addPolicies,
  'users:amendPolicies': amendPolicies,
  'users:deletePolicies': deletePolicies,
  'users:deletePolicy': deletePolicy,
  'users:replaceTeams': replaceTeams,
  'users:deleteTeams': deleteTeams
}
