const getRoles = require('./roles')
const createRole = require('./createrole')
const editRole = require('./editerole')


const resolvers = {
  Query: {
    getRoles
  },
  Mutation: {
    createRole,
    editRole,
  }
}

module.exports = resolvers
