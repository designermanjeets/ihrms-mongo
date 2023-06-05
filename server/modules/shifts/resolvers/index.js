const getShifts = require('./shifts')
const createShift = require('./createshifts')
const editShift = require('./editshifts')

const resolvers = {
  Query: {
    getShifts
  },
  Mutation: {
    createShift,
    editShift,
  }
}

module.exports = resolvers
