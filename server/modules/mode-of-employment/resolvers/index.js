const getModeOfEmployments = require('./mode-of-employment')
const createModeOfEmployment = require('./createmode-of-employment')
const editModeOfEmployment= require('./editmode-of-employment')

const resolvers = {
  Query: {
    getModeOfEmployments
  },
  Mutation: {
    createModeOfEmployment,
    editModeOfEmployment,
  }
}

module.exports = resolvers
