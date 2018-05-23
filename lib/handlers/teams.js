'use strict'

function createTeam ([{ id, name, description, metadata, parentId, organizationId, user }]) {
  return {
    who: 'root',
    what: 'teams:create',
    subject: { id, name, description, metadata, parentId, organizationId, user }
  }
}

function updateTeam ([{ id, name, description, metadata, organizationId }]) {
  return {
    who: 'root',
    what: 'teams:update',
    subject: { id, name, description, metadata, organizationId }
  }
}

function deleteTeam ([{ id, organizationId }]) {
  return {
    who: 'root',
    what: 'teams:delete',
    subject: { id, organizationId }
  }
}

function moveTeam ([{ id, parentId, organizationId }]) {
  return {
    who: 'root',
    what: 'teams:move',
    subject: { id, parentId, organizationId }
  }
}

function replaceTeamPolicies ([{ id, organizationId, policies }]) {
  return {
    who: 'root',
    what: 'teams:replacePolicies',
    subject: { id, organizationId },
    meta: { policies }
  }
}

function addTeamPolicies ([{ id, organizationId, policies }], result) {
  return {
    who: 'root',
    what: 'teams:addPolicies',
    subject: { id, organizationId },
    meta: { policies }
  }
}

function amendTeamPolicies ([{ id, organizationId, policies }]) {
  return {
    who: 'root',
    what: 'teams:amendPolicies',
    subject: { id, organizationId },
    meta: { policies }
  }
}

function deleteTeamPolicies ([{ id, organizationId }]) {
  return {
    who: 'root',
    what: 'teams:deletePolicies',
    subject: { id, organizationId }
  }
}

function deleteTeamPolicy ([{ teamId: id, organizationId, policyId: policy, instance }]) {
  return {
    who: 'root',
    what: 'teams:deletePolicy',
    subject: { id, organizationId },
    meta: { policy, instance }
  }
}

function addUsers ([{ id, organizationId, users }]) {
  return {
    who: 'root',
    what: 'teams:addUsers',
    subject: { id, organizationId, users }
  }
}

function replaceUsers ([{ id, organizationId, users }]) {
  return {
    who: 'root',
    what: 'teams:replaceUsers',
    subject: { id, organizationId },
    meta: { users }
  }
}

function deleteMembers ([{ id, organizationId }]) {
  return {
    who: 'root',
    what: 'teams:deleteMembers',
    subject: { id, organizationId }
  }
}

function deleteMember ([{ id, organizationId, userId: user }]) {
  return {
    who: 'root',
    what: 'teams:deleteMember',
    subject: { id, organizationId },
    meta: {
      user
    }
  }
}

module.exports = {
  'team:create': createTeam,
  'team:update': updateTeam,
  'team:delete': deleteTeam,
  'team:move': moveTeam,
  'team:replacePolicies': replaceTeamPolicies,
  'team:addPolicies': addTeamPolicies,
  'team:amendPolicies': amendTeamPolicies,
  'team:deletePolicies': deleteTeamPolicies,
  'team:deletePolicy': deleteTeamPolicy,
  'team:addUsers': addUsers,
  'team:replaceUsers': replaceUsers,
  'team:deleteMembers': deleteMembers,
  'team:deleteMember': deleteMember
}
