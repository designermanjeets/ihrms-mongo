const getPaySchedules = require('./payschedules')
const createPaySchedule = require('./createpayschedule')
const editPaySchedule= require('./editspaychedule')

const resolvers = {
  Query: {
    getPaySchedules
  },
  Mutation: {
    createPaySchedule,
    editPaySchedule,
  }
}

module.exports = resolvers
