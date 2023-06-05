const getSalaryRevisions = require('./salaryrevisions')
const createSalaryRevisons = require('./createsalaryrevisions')
const editSalaryRevisons = require('./editesalaryrevisions')

const resolvers = {
  Query: {
    getSalaryRevisions
  },
  Mutation: {
    createSalaryRevisons,
    editSalaryRevisons,
  }
}

module.exports = resolvers
