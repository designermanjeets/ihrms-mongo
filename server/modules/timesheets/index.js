const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getTimesheets(query: Pagination!): [TimesheetTypes]
  }

  extend type Mutation {
    createTimesheet (
      projectName: String!
      assignedToID: ID!
      assignedTo: UserInputs
      createdByID: ID!
      createdBy: UserInputs
      departmentID: ID
      department: DepartmentInputs
      assignedDate: ISODate
      startDate: ISODate
      endDate: ISODate
      hours: Int
      description: String
      status: Boolean
      comments: String
      audit: auditInputs
    ): TimesheetTypes

    editTimesheet (
      _id: ID
      projectName: String!
      assignedToID: ID!
      assignedTo: UserInputs
      createdByID: ID!
      createdBy: UserInputs
      departmentID: ID
      department: DepartmentInputs
      assignedDate: ISODate
      startDate: ISODate
      endDate: ISODate
      hours: Int
      description: String
      status: Boolean
      comments: String
      audit: auditInputs
    ): TimesheetTypes
  }

  type TimesheetTypes {
    _id: ID
    projectName: String!
    assignedToID: ID!
    assignedTo: UserTypes
    createdByID: ID!
    createdBy: UserTypes
    departmentID: ID
    department: DepartmentTypes
    assignedDate: ISODate
    startDate: ISODate
    endDate: ISODate
    hours: Int
    description: String
    status: Boolean
    comments: String
    tenantId: ID
    audit: auditTypes
  }

  input TimesheetInputs {
    _id: ID
    projectName: String!
    assignedToID: ID!
    assignedTo: UserInputs
    createdByID: ID!
    createdBy: UserInputs
    departmentID: ID
    department: DepartmentInputs
    assignedDate: ISODate
    startDate: ISODate
    endDate: ISODate
    hours: Int
    description: String
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
