const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getLeaveRequests(query: Pagination!): [LeaveRequestTypes]
    getLeaveBalance(query: Pagination!): [Void]
  }

  extend type Mutation {
    createLeaveRequest (
      userID: ID!
      user: UserInputs
      startDate: ISODate!
      endDate: ISODate!
      days: Int!
      leaveTypeID: ID
      leaveType: LeaveTypeInputs
      leaveTypeBalance: Int
      toManagerID: ID
      toManager: UserInputs
      approvers: [ApproverInputs]
      latitude: String
      longitude: String
      location: String
      manualLocation: String
      status: String
      comments: String
      audit: auditInputs
      tenantid: ID
    ): LeaveRequestTypes

    editLeaveRequest (
      _id: ID
      userID: ID!
      user: UserInputs
      startDate: ISODate!
      endDate: ISODate!
      days: Int!
      leaveTypeID: ID
      leaveType: LeaveTypeInputs
      leaveTypeBalance: Int
      toManagerID: ID
      toManager: UserInputs
      approvers: [ApproverInputs]
      latitude: String
      longitude: String
      location: String
      manualLocation: String
      status: String
      comments: String
      audit: auditInputs
      tenantid: ID
    ): LeaveRequestTypes

    approveRejectLeaveRequest (
      _id: ID
      userID: ID!
      user: UserInputs
      startDate: ISODate!
      endDate: ISODate!
      days: Int!
      leaveTypeID: ID
      leaveType: LeaveTypeInputs
      leaveTypeBalance: Int
      toManagerID: ID
      toManager: UserInputs
      approvers: [ApproverInputs]
      latitude: String
      longitude: String
      location: String
      manualLocation: String
      status: String
      comments: String
      audit: auditInputs
      tenantid: ID
    ): LeaveRequestTypes
  
  }

  type LeaveRequestTypes {
    _id: ID
    userID: ID!
    user: UserTypes
    startDate: ISODate!
    endDate: ISODate!
    days: Int!
    leaveTypeID: ID
    leaveType: LeaveTypeTypes
    leaveTypeBalance: Int
    toManagerID: ID
    toManager: UserTypes
    approvers: [ApproverTypes]
    latitude: String
    longitude: String
    location: String
    manualLocation: String
    status: String
    comments: String
    tenantid: ID
    audit: auditTypes
  }

  input LeaveRequestInputs {
    _id: ID
    userID: ID!
    user: UserInputs
    startDate: ISODate!
    endDate: ISODate!
    days: Int!
    leaveTypeID: ID
    leaveType: LeaveTypeInputs
    toManagerID: ID
    toManager: UserInputs
    approvers: [ApproverInputs]
    latitude: String
    longitude: String
    location: String
    manualLocation: String
    status: String
    comments: String
    tenantid: ID
    audit: auditInputs
  }

  type ApproverTypes {
    approver: UserTypes,
    approverName: String,
    approverECode: String,
    approverID: ID,
    approverLevel: Int,
    approverStatus: String,
    approverComment: String
  }

  input ApproverInputs {
    approver: UserInputs,
    approverName: String,
    approverECode: String,
    approverID: ID,
    approverLevel: Int,
    approverStatus: String,
    approverComment: String
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
