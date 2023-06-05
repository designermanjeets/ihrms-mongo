const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
// @isAuthenticated directive to Authenticate
const typeDefs = gql`
  extend type Query {
    getNotifications(query: Pagination!): [Notification]
  }

  extend type Mutation {

    createNotification(
      eCode: String!
      title: String
      description: String
      date: ISODate!
      status: Boolean
      audit: auditInputs
      tenantAccess: [TenantsInputs]
      tenantid: ID
    ): Notification

    editNotification(
      _id:ID
      eCode: String!
      title: String
      description: String
      date: ISODate!
      status: Boolean
      audit: auditInputs
      tenantAccess: [TenantsInputs]
      tenantid: ID
    ): Notification


  }

  type Notification {
    _id: ID
    eCode: String!
    title: String
    description: String
    status: Boolean
    date: ISODate!
    audit: auditTypes
    tenantAccess: [TenantsTypes]
    tenantid: ID
  }

  type NotificationInputs {
    _id: ID
    eCode: String!
    title: String
    date: ISODate!
    description: String
    status: Boolean
    tenantId: ID
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
