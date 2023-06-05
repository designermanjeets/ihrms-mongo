const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getDepartments(query: Pagination!): [DepartmentTypes]
  }

  extend type Mutation {
    createDepartment (
      name: String!
      departmentLeadId: ID
      departmentLead: UserInputs
      parentDepartmentId: ID
      parentDepartment: DepartmentInputs
      status: Boolean
      leaveTypesIDs: [ID]
      leaveTypes: [LeaveTypeInputs]
      comments: String
      audit: auditInputs
    ): DepartmentTypes

    editDepartment (
      _id: ID
      name: String!
      departmentLeadId: ID
      departmentLead: UserInputs
      parentDepartmentId: ID
      leaveTypesIDs: [ID]
      leaveTypes: [LeaveTypeInputs]
      parentDepartment: DepartmentInputs
      status: Boolean
      comments: String
      audit: auditInputs
    ): DepartmentTypes
  }

  type DepartmentTypes {
    _id: ID
    name: String
    departmentLeadId: ID
    departmentLead: UserTypes
    parentDepartmentId: ID
    leaveTypesIDs: [ID]
    leaveTypes: [LeaveTypeTypes]
    parentDepartment: DepartmentTypes
    status: Boolean
    comments: String
    tenantid: ID
    audit: auditTypes
  }

  input DepartmentInputs {
    _id: ID
    name: String
    departmentLeadId: ID
    departmentLead: UserInputs
    parentDepartmentId: ID
    leaveTypesIDs: [ID]
    leaveTypes: [LeaveTypeInputs]
    parentDepartment: DepartmentInputs
    status: Boolean
    comments: String
    tenantid: ID
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
