const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getShiftRosters(query: Pagination!): [ShiftRostersTypes]
  }

  extend type Mutation {
    createShiftRoster (
      name: String!
      users: [Void]
      month: ISODate
      department: String
      status: Boolean
      comments: String
      audit: auditInputs
    ): ShiftRostersTypes

    editShiftRoster (
      _id: ID
      users: [Void]
      month: ISODate
      department: String
      name: String!
      status: Boolean
      comments: String
      audit: auditInputs
    ): ShiftRostersTypes

    uploadFileRoster(file: Upload!): [Void]

    shiftSwapRequest (
      _id: ID
      name: String
      month: ISODate
      date: ISODate
      eCode: String
      fromUsereCode: String
      fromShift: String
      toShift: String
      toUserCode: String
      department: String
      action: String
      audit: auditInputs
    ): Void

    }

    type SwapShiftRostersTypes {
      _id: ID
      name: String
      month: ISODate
      date: ISODate
      eCode: String
      fromUsereCode: String
      fromShift: String
      toShift: String
      toUserCode: String
      department: String
      action: String
      audit: auditTypes
    }

  type ShiftRostersTypes {
    _id: ID
    name: String
    users: [Void]
    month: ISODate
    department: String
    status: Boolean
    comments: String
    audit: auditTypes
  }

  input ShiftRostersInputs {
    _id: ID
    name: String
    users: [Void]
    month: ISODate
    department: String
    status: Boolean
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
