const getPayHeads = require('./payheads')
const createPayHead = require('./createpayheads')
const editPayHead= require('./editpayheads')

const resolvers = {
  Query: {
    getPayHeads
  },
  Mutation: {
    createPayHead,
    editPayHead,
  }
}

module.exports = resolvers
