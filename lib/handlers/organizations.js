'use strict'

function createOrganization ([{ id, name, description, metadata, user }]) {
  return {
    who: 'root',
    what: 'organization:create',
    subject: { id, name, description, metadata }
  }
}

function updateOrganization ([{ id, name, description, metadata }]) {
  return {
    who: 'root',
    what: 'organization:update',
    subject: { id, name, description, metadata }
  }
}

function deleteOrganization ([id]) {
  return {
    who: 'root',
    what: 'organization:delete',
    subject: { id }
  }
}

function addPolicies ([{ id, policies }]) {
  return {
    who: 'root',
    what: 'organization:addPolicies',
    subject: { id },
    meta: { policies }
  }
}

function amendPolicies ([{ id, policies }]) {
  return {
    who: 'root',
    what: 'organization:amendPolicies',
    subject: { id },
    meta: { policies }
  }
}

function replacePolicies ([{ id, policies }]) {
  return {
    who: 'root',
    what: 'organization:replacePolicies',
    subject: { id },
    meta: { policies }
  }
}

function deletePolicies ([{ id, policies }]) {
  return {
    who: 'root',
    what: 'organization:deletePolicies',
    subject: { id }
  }
}

function deletePolicy ([{ id, policyId: policy, instance }]) {
  return {
    who: 'root',
    what: 'organization:deletePolicy',
    subject: { id },
    meta: { policy, instance }
  }
}

module.exports = {
  'organization:create': createOrganization,
  'organization:delete': deleteOrganization,
  'organization:update': updateOrganization,
  'organization:addPolicies': addPolicies,
  'organization:amendPolicies': amendPolicies,
  'organization:replacePolicies': replacePolicies,
  'organization:deletePolicies': deletePolicies,
  'organization:deletePolicy': deletePolicy
}
