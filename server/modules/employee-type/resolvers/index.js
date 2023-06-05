const getEmployeeTypes = require('./employee-types')
const createEmployeeType = require('./createemployee-types')
const editEmployeeType= require('./editemployee-types')

const resolvers = {
  Query: {
    getEmployeeTypes
  },
  Mutation: {
    createEmployeeType,
    editEmployeeType,
  }
}

module.exports = resolvers
