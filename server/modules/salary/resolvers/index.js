const getSalary = require('./salary')
const createSalary = require('./createsalary')
const editSalary = require('./editesalary')
const insertManySalaryUsers = require('./insertmanysalaryusers')


const resolvers = {
  Query: {
    getSalary
  },
  Mutation: {
    createSalary,
    editSalary,
    insertManySalaryUsers
  }
}

module.exports = resolvers
