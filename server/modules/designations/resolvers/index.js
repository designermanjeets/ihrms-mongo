const getDesignations = require('./designations')
const createDesignation = require('./createdesignations')
const editDesignation = require('./editdesignations')

const resolvers = {
  Query: {
    getDesignations
  },
  Mutation: {
    createDesignation,
    editDesignation,
  }
}

module.exports = resolvers
