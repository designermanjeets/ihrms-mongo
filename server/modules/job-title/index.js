const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getJobTitles(query: Pagination!): [JobTitleTypes]
  }

  extend type Mutation {
    createJobTitle (
      name: String!
      status: Boolean
      designationId: ID
      designation: DesignationInputs
      comments: String
      audit: auditInputs
    ): JobTitleTypes

    editJobTitle (
      _id: ID
      name: String!
      status: Boolean
      designationId: ID
      designation: DesignationInputs
      comments: String
      audit: auditInputs
    ): JobTitleTypes
  }

  type JobTitleTypes {
    _id: ID
    name: String
    status: Boolean
    designationId: ID
    designation: DesignationTypes
    comments: String
    tenantId: ID
    audit: auditTypes
  }

  input JobTitleInputs {
    _id: ID
    name: String
    status: Boolean
    designationId: ID
    designation: DesignationInputs
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
