const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getAttendanceCorrections(query: Pagination!): [AttendanceCorrectionTypes]
  }

  extend type Mutation {
    createAttendanceCorrection (
      userId: ID!
      user: UserInputs
      toManagerID: ID
      toManager: UserInputs
      approvers: [ApproverInputs]
      eCode: String
      date: ISODate
      inTime: ISODate
      outTime: ISODate
      shiftName: String
      overTime: Int
      totalDayWorkingHours: String
      comments: String
      status: String
      audit: auditInputs
    ): AttendanceCorrectionTypes

    editAttendanceCorrection (
      _id: ID
      userId: ID!
      user: UserInputs
      toManagerID: ID
      toManager: UserInputs
      approvers: [ApproverInputs]
      eCode: String
      date: ISODate
      inTime: ISODate
      outTime: ISODate
      shiftName: String
      overTime: Int
      totalDayWorkingHours: String
      comments: String
      status: String
      audit: auditInputs
    ): AttendanceCorrectionTypes

    approveRejectAttendanceCorrection (
      _id: ID
      userId: ID!
      user: UserInputs
      toManagerID: ID
      toManager: UserInputs
      approvers: [ApproverInputs]
      eCode: String
      date: ISODate
      inTime: ISODate
      outTime: ISODate
      shiftName: String
      overTime: Int
      totalDayWorkingHours: String
      comments: String
      status: String
      audit: auditInputs
    ): AttendanceCorrectionTypes

    approveRejectTimeCorrection (
      _id: ID
      userId: ID!
      user: UserInputs
      toManagerID: ID
      toManager: UserInputs
      approvers: [ApproverInputs]
      eCode: String
      date: ISODate
      inTime: ISODate
      outTime: ISODate
      shiftName: String
      created_by: String
      overTime: Int
      totalDayWorkingHours: String
      comments: String
      status: String
      audit: auditInputs
    ): AttendanceTimeCorrectionTypes
  }

  type AttendanceTimeCorrectionTypes {
    _id: ID
    userId: ID!
    user: UserTypes
    toManagerID: ID
    toManager: UserTypes
    approvers: [ApproverTypes]
    eCode: String
    date: ISODate
    inTime: ISODate
    outTime: ISODate
    shiftName: String
    created_by: String
    overTime: Int
    totalDayWorkingHours: String
    comments: String
    status: String
    audit: auditTypes
  }

  type AttendanceCorrectionTypes {
    _id: ID
    userId: ID!
    user: UserTypes
    toManagerID: ID
    toManager: UserTypes
    approvers: [ApproverTypes]
    eCode: String
    date: ISODate
    inTime: ISODate
    outTime: ISODate
    shiftName: String
    overTime: Int
    totalDayWorkingHours: String
    comments: String
    status: String
    audit: auditTypes
  }


  input AttendanceCorrectionInputs {
    _id: ID
    userId: ID!
    user: UserInputs
    toManagerID: ID
    toManager: UserInputs
    approvers: [ApproverInputs]
    eCode: String
    date: ISODate
    inTime: ISODate
    outTime: ISODate
    shiftName: String
    overTime: Int
    totalDayWorkingHours: String
    comments: String
    status: String
    audit: auditInputs
  }

`

const resolvers = require('./resolvers')

module.exports = {
  // typeDefs is an array, because it should be possible to split your schema if the schema grows to big, you can just export multiple here
  typeDefs: [
    typeDefs
  ],
  resolvers
}
