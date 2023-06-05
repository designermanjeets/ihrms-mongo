const getTenants = require('./tenants')
const createTenant = require('./createtenants')
const editTenant= require('./edittenants')

const resolvers = {
  Query: {
    getTenants
  },
  Mutation: {
    createTenant,
    editTenant,
  }
}

module.exports = resolvers
