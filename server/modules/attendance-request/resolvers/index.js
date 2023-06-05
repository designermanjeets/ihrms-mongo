const getAttendanceRequests = require('./attendance-request')
const createAttendanceRequest = require('./createattendance-request')
const editAttendanceRequest= require('./editattendance-request')
const approveRejectAttendanceRequest= require('./approve-reject-attendancerequests')

const resolvers = {
  Query: {
    getAttendanceRequests
  },
  Mutation: {
    createAttendanceRequest,
    editAttendanceRequest,
    approveRejectAttendanceRequest
  }
}

module.exports = resolvers
