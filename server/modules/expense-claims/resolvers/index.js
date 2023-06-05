const getExpenseClaims = require('./expenseclaims')
const createExpenseClaims = require('./createexpenseclaims')
const editExpenseClaims = require('./editexpenseclaims')

const resolvers = {
  Query: {
    getExpenseClaims
  },
  Mutation: {
    createExpenseClaims,
    editExpenseClaims,
  }
}

module.exports = resolvers
