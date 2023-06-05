const getLeaveTypes = require('./leave-types')
const createLeaveType = require('./createleave-types')
const editLeaveType = require('./editleave-types')

const resolvers = {
  Query: {
    getLeaveTypes
  },
  Mutation: {
    createLeaveType,
    editLeaveType,
  }
}

module.exports = resolvers
