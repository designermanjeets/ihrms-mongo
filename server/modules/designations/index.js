const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getDesignations(query: Pagination!): [DesignationTypes]
  }

  extend type Mutation {
    createDesignation (
      name: String!
      departmentId: ID
      department: DepartmentInputs
      parentDesignationId: ID
      parentDesignation: DesignationInputs
      status: Boolean
      comments: String
      audit: auditInputs
    ): DesignationTypes

    editDesignation (
      _id: ID
      name: String!
      departmentId: ID
      department: DepartmentInputs
      parentDesignationId: ID
      parentDesignation: DesignationInputs
      status: Boolean
      comments: String
      audit: auditInputs
    ): DesignationTypes
  }

  type DesignationTypes {
    _id: ID
    name: String
    departmentId: ID
    department: DepartmentTypes
    parentDesignationId: ID
    parentDesignation: DesignationTypes
    status: Boolean
    comments: String
    tenantid: ID
    audit: auditTypes
  }

  input DesignationInputs {
    _id: ID
    name: String
    departmentId: ID
    department: DepartmentInputs
    parentDesignationId: ID
    parentDesignation: DesignationInputs
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
