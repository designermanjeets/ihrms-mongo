const getAttendanceSQL = require('./attendance-sql');
const insertManyAttendanceSQL = require('./insertmanyattendance-sql');

const resolvers = {
  Query: {
    getAttendanceSQL,
  },
  Mutation: {
    insertManyAttendanceSQL,
  },
};

module.exports = resolvers;
