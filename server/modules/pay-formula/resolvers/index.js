const getPayFormulas = require('./payformula')
const createPayFormula = require('./createformula')
const editPayFormula= require('./editformula')

const resolvers = {
  Query: {
    getPayFormulas
  },
  Mutation: {
    createPayFormula,
    editPayFormula,
  }
}

module.exports = resolvers
