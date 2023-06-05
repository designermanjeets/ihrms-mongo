const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getAttendanceRequests(query: Pagination!): [AttendanceRequestTypes]
  }

  extend type Mutation {
    createAttendanceRequest (
      userId: ID!
      user: UserInputs
      startDate: ISODate!
      endDate: ISODate!
      days: Int!
      attendanceType: String!
      toManagerID: ID
      toManager: UserInputs
      approvers: [ApproverInputs]
      status: String
      comments: String
      audit: auditInputs
    ): AttendanceRequestTypes

    editAttendanceRequest (
      _id: ID
      userId: ID!
      user: UserInputs
      startDate: ISODate!
      endDate: ISODate!
      days: Int!
      attendanceType: String!
      toManagerID: ID
      toManager: UserInputs
      approvers: [ApproverInputs]
      status: String
      comments: String
      audit: auditInputs
    ): AttendanceRequestTypes

    approveRejectAttendanceRequest (
      _id: ID
      userId: ID!
      user: UserInputs
      startDate: ISODate!
      endDate: ISODate!
      days: Int!
      attendanceType: String!
      toManagerID: ID
      toManager: UserInputs
      approvers: [ApproverInputs]
      status: String
      comments: String
      audit: auditInputs
    ): AttendanceRequestTypes
  }

  type AttendanceRequestTypes {
    _id: ID
    userId: ID!
    user: UserTypes
    startDate: ISODate!
    endDate: ISODate!
    days: Int!
    attendanceType: String!
    toManagerID: ID
    toManager: UserTypes
    approvers: [ApproverTypes]
    status: String
    comments: String
    audit: auditTypes
  }

  input AttendanceRequestInputs {
    _id: ID
    userId: ID!
    user: UserInputs
    startDate: ISODate!
    endDate: ISODate!
    days: Int!
    attendanceType: String!
    toManagerID: ID
    toManager: UserInputs
    approvers: [ApproverInputs]
    status: String
    comments: String
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
