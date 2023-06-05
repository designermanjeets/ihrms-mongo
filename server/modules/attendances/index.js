const { gql } = require('apollo-server-express');

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getAttendances(query: Pagination!): [AttendancesTypes]
    getAttendancesByDayWise(query: Pagination!): [Void]
    getAttendanceRequestsByDayWise(query: Pagination!): [Void]
    getAttendanceRequestsByDayWiseOverview(query: Pagination!): [Void]
    getAttendancesByDayWiseAllUsers(query: Pagination!): [Void]
    getAttendancesByDayWiseAvg(query: Pagination!): [Void]
    getAttendancesByDayWiseAllUsersAvg(query: Pagination!): [Void]

    getDayWiseAttendances(query: AttendanceSheetInput!): [Void]
    getCalculateSalarydayWise(query: AttendanceSheetInput!): [Void]
    getOvertimeMonthWise(query: AttendanceSheetInput!): [Void]
    getUserSalarySlip(query: AttendanceSheetInput!): [Void]
  }

  extend type Mutation {
    createAttendance(
      userId: ID!
      user: UserInputs
      eCode: String
      date: ISODate
      inTime: ISODate
      outTime: ISODate
      shift: ShiftInputs
      overTime: Int
      totalDayWorkingHours: String
      comments: String
      audit: auditInputs
    ): AttendancesTypes

    editAttendance(
      _id: ID
      userId: ID!
      user: UserInputs
      eCode: String
      date: ISODate
      inTime: ISODate
      outTime: ISODate
      shift: ShiftInputs
      overTime: Int
      totalDayWorkingHours: String
      comments: String
      audit: auditInputs
    ): AttendancesTypes

    uploadFileAttendance(file: Upload!): [Void]
    insertManyAttendances(input: Void!): [Void]
  }

  type AttendancesTypes {
    _id: ID
    userId: ID!
    user: UserTypes
    eCode: String
    date: ISODate
    inTime: ISODate
    outTime: ISODate
    shift: ShiftTypes
    overTime: Int
    totalDayWorkingHours: String
    comments: String
    audit: auditTypes
  }

  input AttendancesInputs {
    _id: ID
    userId: ID!
    user: UserInputs
    eCode: String
    username:String
    date: ISODate
    inTime: ISODate
    outTime: ISODate
    shift: ShiftInputs
    overTime: Int
    totalDayWorkingHours: String
    comments: String
    audit: auditInputs
  }

  input AttendanceSheetInput {
    eCode: String
    username:String
    dates: Dates!
    limit: Int
    approvers: [ApproverInputs]
  }
`;

const resolvers = require('./resolvers');

module.exports = {
  // typeDefs is an array, because it should be possible to split your schema if the schema grows to big, you can just export multiple here
  typeDefs: [typeDefs],
  resolvers,
};
