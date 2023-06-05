const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getEmployeeTypes(query: Pagination!): [EmployeeTypeTypes]
  }

  extend type Mutation {
    createEmployeeType (
      name: String!
      status: Boolean
      comments: String
      audit: auditInputs
    ): EmployeeTypeTypes

    editEmployeeType (
      _id: ID
      name: String!
      status: Boolean
      comments: String
      audit: auditInputs
    ): EmployeeTypeTypes
  }

  type EmployeeTypeTypes {
    _id: ID
    name: String
    status: Boolean
    comments: String
    tenantId: ID
    audit: auditTypes
  }

  input EmployeeTypeInputs {
    _id: ID
    name: String
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
