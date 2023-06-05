const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getLeaveTypes(query: Pagination!): [LeaveTypeTypes]
  }

  extend type Mutation {
    createLeaveType (
      name: String!
      days: Int!
      carryForward: Boolean
      carryForwardDays: Int
      countWeekends: Boolean
      status: Boolean
      comments: String
      audit: auditInputs
    ): LeaveTypeTypes

    editLeaveType (
      _id: ID
      name: String!
      days: Int!
      carryForward: Boolean
      carryForwardDays: Int
      countWeekends: Boolean
      status: Boolean
      comments: String
      audit: auditInputs
    ): LeaveTypeTypes
  }

  type LeaveTypeTypes {
    _id: ID
    name: String
    days: Int!
    remaining_days: Int
    carryForward: Boolean
    carryForwardDays: Int
    countWeekends: Boolean
    status: Boolean
    comments: String
    tenantId: ID
    audit: auditTypes
  }

  input LeaveTypeInputs {
    _id: ID
    name: String
    days: Int!
    remaining_days: Int
    carryForward: Boolean
    carryForwardDays: Int
    countWeekends: Boolean
    status: Boolean
    comments: String
    tenantId: ID
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
