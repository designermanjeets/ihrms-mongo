const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getPayHeads(query: Pagination!): [PayHeadTypes]
  }

  extend type Mutation {
    createPayHead (
      name: String!
      namePayslip: String!
      payhead_type: String
      stattutoryPaytype: String
      underAccountGroup: String
      affectNetSalary: Boolean
      currencyOfLedger: String
      calculationType: String
      calculationPeroid: String
      computedFormulaID: ID
      computedFormula: PayFormulaInputs
      effectiveFrom: ISODate
      amountGreaterThan: String
      amountUpto: String
      slabType: String
      slabValue: String
      roundOff: String
      limit: String
      status: Boolean
      comments: String
      audit: auditInputs
      tenantid: ID
    ): PayHeadTypes

    editPayHead (
      _id: ID!
      name: String
      namePayslip: String!
      payhead_type: String
      stattutoryPaytype: String
      underAccountGroup: String
      affectNetSalary: Boolean
      currencyOfLedger: String
      calculationType: String
      calculationPeroid: String
      computedFormulaID: ID
      computedFormula: PayFormulaInputs
      effectiveFrom: ISODate
      amountGreaterThan: String
      amountUpto: String
      slabType: String
      slabValue: String
      roundOff: String
      limit: String
      status: Boolean
      comments: String
      audit: auditInputs
      tenantid: ID
    ): PayHeadTypes
  }

  type PayHeadTypes {
    _id: ID
    name: String
    namePayslip: String!
    payhead_type: String
    stattutoryPaytype: String
    underAccountGroup: String
    affectNetSalary: Boolean
    currencyOfLedger: String
    calculationType: String
    calculationPeroid: String
    computedFormulaID: ID
    computedFormula: PayFormulaTypes
    effectiveFrom: ISODate
    amountGreaterThan: String
    amountUpto: String
    slabType: String
    slabValue: String
    roundOff: String
    limit: String
    status: Boolean
    comments: String
    audit: auditTypes
    tenantid: ID
  }

  input PayHeadInputs {
    _id: ID
    name: String
    namePayslip: String!
    payhead_type: String
    stattutoryPaytype: String
    underAccountGroup: String
    affectNetSalary: Boolean
    currencyOfLedger: String
    calculationType: String
    calculationPeroid: String
    computedFormulaID: ID
    computedFormula: PayFormulaInputs
    effectiveFrom: ISODate
    amountGreaterThan: String
    amountUpto: String
    slabType: String
    slabValue: String
    roundOff: String
    limit: String
    status: Boolean
    comments: String
    audit: auditInputs
    tenantid: ID
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
