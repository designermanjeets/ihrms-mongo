const getJobTitles = require('./job-titles')
const createJobTitle = require('./createjob-titles')
const editJobTitle = require('./editjob-titles')

const resolvers = {
  Query: {
    getJobTitles
  },
  Mutation: {
    createJobTitle,
    editJobTitle,
  }
}

module.exports = resolvers
