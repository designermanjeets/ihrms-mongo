const getTimesheets = require('./timesheets')
const createTimesheet = require('./createtimesheets')
const editTimesheet = require('./edittimesheets')

const resolvers = {
  Query: {
    getTimesheets
  },
  Mutation: {
    createTimesheet,
    editTimesheet,
  }
}

module.exports = resolvers
