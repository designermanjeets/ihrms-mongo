const getPayroll = require('./payroll')
const createPayroll = require('./createpayroll')
const editPayroll = require('./editpayroll')
const deletePayroll = require('./deletepayroll')

const resolvers = {
  Query: {
    getPayroll
  },
  Mutation: {
    createPayroll,
    editPayroll,
    deletePayroll
  }
}

module.exports = resolvers
