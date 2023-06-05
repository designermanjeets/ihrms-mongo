const getAttendances = require('./attendances');
const getAttendancesByDayWise = require('./getattendancebydaywise');
const getAttendancesByDayWiseAllUsers = require('./getattendancebydaywiseallusers');
const getAttendanceRequestsByDayWise = require('./getattendancerequestbydaywise');
const getAttendancesByDayWiseAvg = require('./getattendancebydaywiseavg');
const getAttendancesByDayWiseAllUsersAvg = require('./getattendancebydaywiseallusersavg');
const getAttendanceRequestsByDayWiseOverview = require('./getattendancerequestbydaywiseoverview');
const getDayWiseAttendances = require('./getdaywiseattendances');
const getCalculateSalarydayWise = require('./getcalculatesalarydaywise');
const createAttendance = require('./createattendances');
const editAttendance = require('./editattendances');
const uploadFileAttendance = require('./fileuploadattendance');
const insertManyAttendances = require('./insertmanyattendance');
const getOvertimeMonthWise = require('./getovertimemonthwise');
const getUserSalarySlip = require('./getuserspayslip');

const resolvers = {
  Query: {
    getAttendances,
    getAttendancesByDayWise,
    getAttendanceRequestsByDayWise,
    getAttendancesByDayWiseAllUsers,
    getAttendancesByDayWiseAvg,
    getAttendancesByDayWiseAllUsersAvg,
    getAttendanceRequestsByDayWiseOverview,
    getDayWiseAttendances,
    getCalculateSalarydayWise,
    getOvertimeMonthWise,
    getUserSalarySlip,
  },
  Mutation: {
    createAttendance,
    editAttendance,
    uploadFileAttendance,
    insertManyAttendances,
  },
};

module.exports = resolvers;
