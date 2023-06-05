const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getPayroll(query: Pagination!): [PayrollTypes]
  }

  extend type Mutation {
    createPayroll (
      salaryId: ID
      month: ISODate
      payrolls: [PayrollsInputs]
      payrollInputs: PayrollInputsInputs
      audit: auditInputs
    ): PayrollTypes

    editPayroll (
      _id: ID
      salaryId: ID
      month: ISODate
      payrolls: [PayrollsInputs]
      payrollInputs: PayrollInputsInputs
      audit: auditInputs
    ): PayrollTypes

    deletePayroll (
      _id: ID
      salaryId: ID
      month: ISODate
      payrolls: [PayrollsInputs]
      payrollInputs: PayrollInputsInputs
      audit: auditInputs
    ): PayrollTypes

    insertManyPayrollUsers(input: Void!): [Void]
  }

  type PayrollTypes {
    _id: ID
    salaryId: ID
    month: ISODate
    payrolls: [PayrollsTypes]
    payrollInputs: PayrollInputsTypes
    audit: auditTypes
  }

  input PayrollInputs {
    _id: ID
    salaryId: ID
    month: ISODate
    payrolls: [PayrollsInputs]
    payrollInputs: PayrollInputsInputs
    audit: auditInputs
  }

  type PayrollInputsTypes {
    payInputs: Boolean
    empViewRelease: Boolean
    statementView: Boolean
    payrollProcess: Boolean
  }

  input PayrollInputsInputs {
    payInputs: Boolean
    empViewRelease: Boolean
    statementView: Boolean
    payrollProcess: Boolean
  }

  type PayrollsTypes {
    salaryId: ID
    month: ISODate
    eCode: String!
    day_diff: Int
    totalDaysAbsent: Int
    totalDaysPresent: Int
    user_overtime: Int
    total_overtime_done_by_user: Int
    user_range_salary: Int
    user_salary: Int
    username: String
    status: String
    total_pay_heads_salary: Int
    Earnings_for_Employee: Int
    Employees_Statutory_Deductions: Int
    Employers_Statutory_Contributions: Int
    Security_Deposit: Int
    companyDaysOFF: Int
    overtime: Int
    total_overtime: Int
  }

  input PayrollsInputs {
    salaryId: ID
    month: ISODate
    eCode: String!
    day_diff: Int
    totalDaysAbsent: Int
    totalDaysPresent: Int
    user_overtime: Int
    total_overtime_done_by_user: Int
    user_range_salary: Int
    user_salary: Int
    username: String
    status: String
    total_pay_heads_salary: Int
    Earnings_for_Employee: Int
    Employees_Statutory_Deductions: Int
    Employers_Statutory_Contributions: Int
    Security_Deposit: Int
    companyDaysOFF: Int
    overtime: Int
    total_overtime: Int
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
