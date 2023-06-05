const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
 
  extend type Query {
    getSalaryRevisions(query: Pagination!): [SalaryTypes]
  }

  extend type Mutation {
    createSalaryRevisons (
      _id: ID
      eCode: String
      effectiveDate: ISODate
      month: ISODate
      username: String
      salaryStructure: String
      salaryStructureId: ID
      departmentId: ID
      department: DepartmentInputs
      CTC: Int
      GROSS: Int
      payHeads: [SalaryPayHeadInputs]
      audit: auditInputs
    ): SalaryTypes
    
    editSalaryRevisons (
      _id: ID
      eCode: String
      effectiveDate: ISODate
      month: ISODate
      username: String
      salaryStructure: String
      salaryStructureId: ID
      departmentId: ID
      department: DepartmentInputs
      CTC: Int
      GROSS: Int
      payHeads: [SalaryPayHeadInputs]
      audit: auditInputs
    ): SalaryTypes

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
