function isUserAuthorized ([{ resource, action, userId, organizationId, sourceIpAddress, sourcePort }], result) {
  return {
    who: {
      id: `${organizationId}/${userId}`,
      user: userId,
      organization: organizationId
    },
    what: 'authorization:isUserAuthorized',
    subject: { id: resource, action },
    where: { ip: sourceIpAddress, port: sourcePort },
    meta: { result }
  }
}

function batchAuthorization ([{ resourceBatch: batch, userId, organizationId, sourceIpAddress, sourcePort }], result) {
  return {
    who: {
      id: `${organizationId}/${userId}`,
      user: userId,
      organization: organizationId
    },
    what: 'authorization:batchAuthorization',
    subject: { batch },
    where: { ip: sourceIpAddress, port: sourcePort },
    meta: { result }
  }
}

function listActions ([{ resource, userId, organizationId, sourceIpAddress, sourcePort }], result) {
  return {
    who: {
      id: `${organizationId}/${userId}`,
      user: userId,
      organization: organizationId
    },
    what: 'authorization:listActions',
    subject: resource,
    where: { ip: sourceIpAddress, port: sourcePort },
    meta: { result }
  }
}

function listAuthorizationsOnResources ([{ resources, userId, organizationId, sourceIpAddress, sourcePort }], result) {
  return {
    who: {
      id: `${organizationId}/${userId}`,
      user: userId,
      organization: organizationId
    },
    what: 'authorization:listAuthorizationsOnResources',
    subject: { resources },
    where: { ip: sourceIpAddress, port: sourcePort },
    meta: { result }
  }
}

module.exports = {
  'authorize:isUserAuthorized': isUserAuthorized,
  'authorize:batchAuthorization': batchAuthorization,
  'authorize:listActions': listActions,
  'authorize:listAuthorizationsOnResources': listAuthorizationsOnResources
}
