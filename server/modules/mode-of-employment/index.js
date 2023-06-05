const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getModeOfEmployments(query: Pagination!): [ModeOfEmploymentTypes]
  }

  extend type Mutation {
    createModeOfEmployment (
      name: String!
      status: Boolean
      comments: String
      audit: auditInputs
    ): ModeOfEmploymentTypes

    editModeOfEmployment (
      _id: ID
      name: String!
      status: Boolean
      comments: String
      audit: auditInputs
    ): ModeOfEmploymentTypes
  }

  type ModeOfEmploymentTypes {
    _id: ID
    name: String
    status: Boolean
    comments: String
    tenantId: ID
    audit: auditTypes
  }

  input ModeOfEmploymentInputs {
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
