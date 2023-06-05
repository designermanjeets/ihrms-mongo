const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getLoanAdvances(query: Pagination!): [LoanAdvanceTypes]
  }

  extend type Mutation {
    createLoanAdvances (
      userId: ID!
      user: UserInputs
      loanType: String!
      loanAmount: Int!
      period: Int
      EMI: Int
      outstanding: Int
      toManagerID: ID
      toManager: UserInputs
      date: ISODate!
      status: String
      comments: String
      audit: auditInputs
    ): LoanAdvanceTypes

    editLoanAdvances (
      _id: ID
      userId: ID!
      user: UserInputs
      loanType: String!
      loanAmount: Int!
      period: Int
      EMI: Int
      outstanding: Int
      toManagerID: ID
      toManager: UserInputs
      date: ISODate!
      status: String
      comments: String
      audit: auditInputs
    ): LoanAdvanceTypes
  }

  type LoanAdvanceTypes {
    _id: ID
    userId: ID!
    user: UserTypes
    loanType: String!
    loanAmount: Int!
    period: Int
    EMI: Int
    outstanding: Int
    toManagerID: ID
    toManager: UserTypes
    date: ISODate!
    status: String
    comments: String
    audit: auditTypes
  }

  input LoanAdvanceInputs {
    _id: ID
    userId: ID!
    user: UserInputs
    loanType: String!
    loanAmount: Int!
    period: Int
    EMI: Int
    outstanding: Int
    toManagerID: ID
    toManager: UserInputs
    date: ISODate!
    status: String
    comments: String
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
