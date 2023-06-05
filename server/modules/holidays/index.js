const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getHolidays(query: Pagination!): [HolidayTypes]
  }

  extend type Mutation {
    createHolidays (
      name: String!
      status: Boolean
      date: ISODate!
      comments: String
      audit: auditInputs
    ): HolidayTypes

    editHolidays (
      _id: ID
      name: String!
      date: ISODate!
      status: Boolean
      comments: String
      audit: auditInputs
    ): HolidayTypes
  }

  type HolidayTypes {
    _id: ID
    name: String
    date: ISODate!
    status: Boolean
    comments: String
    tenantId: ID
    audit: auditTypes
  }

  input HolidayInputs {
    _id: ID
    name: String
    date: ISODate!
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
