const { gql } = require('apollo-server-express');

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getAttendanceSQL(query: Pagination!): [AttendanceSQLTypes]
  }

  extend type Mutation {
    insertManyAttendanceSQL(input: Void!): [Void]
  }

  type AttendanceSQLTypes {
    _id: Int
    userId: ID
    user: UserTypes
    audit: auditTypes
    UserId: Int
    DeviceLogId: Int
    DownloadDate: ISODate
    LogDate: ISODate,
    date: ISODate,
    eCode: String,
    inTime: ISODate,
    outTime: ISODate,
  }

  input AttendanceSQLInputs {
    _id: Int
    userId: ID!
    user: UserInputs
    audit: auditInputs
    UserId: Int
    DeviceLogId: Int
    DownloadDate: ISODate
    LogDate: ISODate,
    date: ISODate,
    eCode: String,
    inTime: ISODate,
    outTime: ISODate,
  }
`;

const resolvers = require('./resolvers');

module.exports = {
  // typeDefs is an array, because it should be possible to split your schema if the schema grows to big, you can just export multiple here
  typeDefs: [typeDefs],
  resolvers,
};
