const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getTasks(query: Pagination!): [TaskTypes]
  }

  extend type Mutation {
    createTask (
      userID: ID!
      user: UserInputs
      startDate: ISODate!
      endDate: ISODate!
      days: Int!
      createdByID: ID
      createdBy: UserInputs
      status: String
      timeAssigned: Int
      timeTaken: Int
      comments: String
      audit: auditInputs
      tenantid: ID
    ): TaskTypes

    editTask (
      _id: ID
      userID: ID!
      user: UserInputs
      startDate: ISODate!
      endDate: ISODate!
      days: Int!
      createdByID: ID
      createdBy: UserInputs
      status: String
      timeAssigned: Int
      timeTaken: Int
      comments: String
      audit: auditInputs
      tenantid: ID
    ): TaskTypes

    approveRejectTask (
      _id: ID
      userID: ID!
      user: UserInputs
      startDate: ISODate!
      endDate: ISODate!
      days: Int!
      createdByID: ID
      createdBy: UserInputs
      status: String
      timeAssigned: Int
      timeTaken: Int
      comments: String
      audit: auditInputs
      tenantid: ID
    ): TaskTypes
  
  }

  type TaskTypes {
    _id: ID
    userID: ID!
    user: UserTypes
    startDate: ISODate!
    endDate: ISODate!
    days: Int!
    createdByID: ID
    createdBy: UserTypes
    status: String
    timeAssigned: Int
    timeTaken: Int
    comments: String
    tenantid: ID
    audit: auditTypes
  }

  input TaskInputs {
    _id: ID
    userID: ID!
    user: UserInputs
    startDate: ISODate!
    endDate: ISODate!
    days: Int!
    createdByID: ID
    createdBy: UserInputs
    status: String
    timeAssigned: Int
    timeTaken: Int
    comments: String
    tenantid: ID
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
