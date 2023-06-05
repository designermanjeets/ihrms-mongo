const getApprovars = require('./approvars')
const createApprovar = require('./createapprovars')
const editApprovar = require('./editapprovars')


const resolvers = {
  Query: {
    getApprovars
  },
  Mutation: {
    createApprovar,
    editApprovar,
  }
}

module.exports = resolvers
