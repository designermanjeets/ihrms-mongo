const getActivityLogs = require('./activity-logs')
const createActivityLogs = require('./createatactivity-logs')

const resolvers = {
  Query: {
    getActivityLogs
  },
  Mutation: {
    createActivityLogs,
  }
}

module.exports = resolvers
