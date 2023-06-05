const getTasks = require('./tasks')
const createTask = require('./createtasks')
const editTask = require('./edittasks')
const approveRejectTask = require('./approve-reject-tasks')

const resolvers = {
  Query: {
    getTasks
  },
  Mutation: {
    createTask,
    editTask,
    approveRejectTask
  }
}

module.exports = resolvers
