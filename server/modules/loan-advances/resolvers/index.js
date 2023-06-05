const getLoanAdvances = require('./loanadvances')
const createLoanAdvances = require('./createloanadvances')
const editLoanAdvances = require('./editloanadvances')

const resolvers = {
  Query: {
    getLoanAdvances
  },
  Mutation: {
    createLoanAdvances,
    editLoanAdvances,
  }
}

module.exports = resolvers
