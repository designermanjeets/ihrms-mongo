const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getActivityLogs(query: Pagination!): [ActivityLogsTypes]
  }

  extend type Mutation {
    createActivityLogs (
      event_summary: EventSummaryInputs
      change_history: ChangeHistoryInputs
    ): ActivityLogsTypes

  }

  type ActivityLogsTypes {
    _id: ID
    event_summary: EventSummaryTypes
    change_history: ChangeHistoryTypes
  }

  input ActivityLogsInputs {
    _id: ID
    event_summary: EventSummaryInputs
    change_history: ChangeHistoryInputs
  }

  type EventSummaryTypes {
    operation_name: String
    timestamp: ISODate
    event_initiated_by_user: String
    status: String
    tenant_id: String,
    success_or_error_msg: String
  }

  input EventSummaryInputs {
    operation_name: String
    timestamp: ISODate
    event_initiated_by_user: String
    status: String
    tenant_id: String,
    success_or_error_msg: String
  }

  type ChangeHistoryTypes {
    change_type: String
    change_table: String
    changedFields: [Void]
    request_parameters: Void
    new_object: Void
    old_object: Void
  }

  input ChangeHistoryInputs {
    change_type: String
    change_table: String
    changedFields: [Void]
    request_parameters: Void
    new_object: Void
    old_object: Void
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
