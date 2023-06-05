
const createNotification = require('./createnotification')
const editNotification = require('./editnotification')
const getNotifications = require('./getnotification')

const resolvers = {
  Query: {
    getNotifications,
  },
  Mutation: {
    createNotification,
    editNotification,
  }
}

module.exports = resolvers
