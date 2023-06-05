const getAttendanceCorrections = require('./attendance-correction')
const createAttendanceCorrection = require('./createattendance-correction')
const editAttendanceCorrection= require('./editattendance-correction')
const approveRejectAttendanceCorrection= require('./approve-reject-attendancecorrections')
const approveRejectTimeCorrection= require('./approve-reject-timecorrections')


const resolvers = {
  Query: {
    getAttendanceCorrections
  },
  Mutation: {
    createAttendanceCorrection,
    editAttendanceCorrection,
    approveRejectAttendanceCorrection,
    approveRejectTimeCorrection
  }
}

module.exports = resolvers
