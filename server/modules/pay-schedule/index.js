const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getPaySchedules(query: Pagination!): [PayScheduleTypes]
  }

  extend type Mutation {
    createPaySchedule (
      calculateMonthlySalaryBasedUpon: String!
      organisationWorkingDays: String
      employeePayDay: String!
      employeePayDayOther: String
      status: Boolean
      audit: auditInputs
      tenantid: ID
    ): PayScheduleTypes

    editPaySchedule (
      _id: ID!
      calculateMonthlySalaryBasedUpon: String!
      organisationWorkingDays: String
      employeePayDay: String!
      employeePayDayOther: String
      status: Boolean
      audit: auditInputs
      tenantid: ID
    ): PayScheduleTypes
  }

  type PayScheduleTypes {
    _id: ID
    calculateMonthlySalaryBasedUpon: String!
    organisationWorkingDays: String
    employeePayDay: String!
    employeePayDayOther: String
    status: Boolean
    audit: auditTypes
    tenantid: ID
  }

  input PayScheduleInputs {
    _id: ID
    calculateMonthlySalaryBasedUpon: String!
    organisationWorkingDays: String
    employeePayDay: String!
    employeePayDayOther: String
    status: Boolean
    audit: auditInputs
    tenantid: ID
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
