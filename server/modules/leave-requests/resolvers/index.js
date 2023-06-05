const getLeaveRequests = require('./leave-requests')
const getLeaveBalance = require('./leavebalance')
const createLeaveRequest = require('./createleave-requests')
const editLeaveRequest = require('./editleave-requests')
const approveRejectLeaveRequest = require('./approve-reject-requests')

const resolvers = {
  Query: {
    getLeaveRequests,
    getLeaveBalance
  },
  Mutation: {
    createLeaveRequest,
    editLeaveRequest,
    approveRejectLeaveRequest
  }
}

module.exports = resolvers
