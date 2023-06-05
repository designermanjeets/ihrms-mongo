const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getPayFormulas(query: Pagination!): [PayFormulaTypes]
  }

  extend type Mutation {
    createPayFormula (
      name: String!
      formula: String!
      status: Boolean
      audit: auditInputs
      tenantid: ID
    ): PayFormulaTypes

    editPayFormula (
      _id: ID!
      name: String
      formula: String!
      status: Boolean
      audit: auditInputs
      tenantid: ID
    ): PayFormulaTypes
  }

  type PayFormulaTypes {
    _id: ID
    name: String
    formula: String!
    status: Boolean
    audit: auditTypes
    tenantid: ID
  }

  input PayFormulaInputs {
    _id: ID
    name: String
    formula: String!
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
