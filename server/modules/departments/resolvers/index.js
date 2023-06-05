const getDepartments = require('./departments')
const createDepartment = require('./createdepartments')
const editDepartment = require('./editdepartments')

const resolvers = {
  Query: {
    getDepartments
  },
  Mutation: {
    createDepartment,
    editDepartment,
  }
}

module.exports = resolvers
