const getShiftRosters = require('./shiftrosters')
const createShiftRoster = require('./createshiftrosters')
const editShiftRoster= require('./editshiftrosters')
const uploadFileRoster= require('./fileuploadroster')
const shiftSwapRequest= require('./swapshift')

const resolvers = {
  Query: {
    getShiftRosters
  },
  Mutation: {
    createShiftRoster,
    editShiftRoster,
    uploadFileRoster,
    shiftSwapRequest
  }
}

module.exports = resolvers
