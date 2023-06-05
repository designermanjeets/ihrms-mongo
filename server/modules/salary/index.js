const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getSalary(query: Pagination!): [SalaryTypes]
  }

  extend type Mutation {
    createSalary (
      eCode: String!
      effectiveDate: ISODate!
      month: ISODate
      username: String
      salaryStructure: String
      salaryStructureId: ID
      departmentId: ID
      department: DepartmentInputs
      CTC: Int
      GROSS: Int
      payHeads: [SalaryPayHeadInputs]
      securityDeposit: [securityDepositInputs]
      audit: auditInputs
    ): SalaryTypes

    editSalary (
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
      securityDeposit: [securityDepositInputs]
      audit: auditInputs
    ): SalaryTypes

    insertManySalaryUsers(input: Void!): [Void]
  }

  type SalaryTypes {
    _id: ID
    eCode: String!
    effectiveDate: ISODate!
    month: ISODate
    username: String
    salaryStructure: String
    salaryStructureId: ID
    departmentId: ID
    department: DepartmentTypes
    CTC: Int
    GROSS: Int
    payHeads: [SalaryPayHeadTypes]
    securityDeposit: [securityDepositTypes]
    audit: auditTypes
  }

  input SalaryInputs {
    _id: ID
    eCode: String!
    effectiveDate: ISODate!
    month: ISODate
    username: String
    salaryStructure: String
    salaryStructureId: ID
    departmentId: ID
    department: DepartmentInputs
    CTC: Int
    GROSS: Int
    payHeads: [SalaryPayHeadInputs]
    securityDeposit: [securityDepositInputs]
    audit: auditInputs
  }

  type SalaryPayHeadTypes {
    _id: ID
    name: String
    value: Int
    payhead_type: String
    calculationType: String
  }

  input SalaryPayHeadInputs {
    _id: ID
    name: String
    value: Int
    payhead_type: String
    calculationType: String
  }
  
  type securityDepositTypes {
    currCTC: Int
    currGROSS: Int
    payHead: SalaryPayHeadTypes
    payHeadID: ID
    securityAmount: Int
    pendingAmount: Int
    monthStart: ISODate
    EMITenure: Int
    currentEMI: Int
  }

  input securityDepositInputs {
    currCTC: Int
    currGROSS: Int
    payHead: SalaryPayHeadInputs
    payHeadID: ID
    securityAmount: Int
    pendingAmount: Int
    monthStart: ISODate
    EMITenure: Int
    currentEMI: Int
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
