const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getApprovars(query: Pagination!): [approvarTypes]
  }

  extend type Mutation {

    createApprovar (
      name: String!
      maxLevel: Int!
      approvars: [userApprovarInputs]
      audit: auditInputs
    ): approvarTypes

    editApprovar (
      _id: ID
      name: String!
      maxLevel: Int!
      approvars: [userApprovarInputs]
      audit: auditInputs
    ): approvarTypes

  }

  type approvarTypes {
    _id: ID
    name: String!
    maxLevel: Int!
    approvars: [userApprovarTypes]
    audit: auditTypes
  }

  type userApprovarTypes {
    _id: ID
    user: UserTypes
    level: Int
  }

  input userApprovarInputs {
    _id: ID
    user: UserInputs
    level: Int
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
