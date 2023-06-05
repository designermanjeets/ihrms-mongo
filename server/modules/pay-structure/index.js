const { gql } = require('apollo-server-express');

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getPayStructures(query: Pagination!): [PayStructureTypes]
  }

  extend type Mutation {
    createPayStructure(
      salaryStructure: String!
      payHeads: [PayHeadInputs]
      payHeadIDs: [ID]
      printName: String
      effectiveFrom: ISODate
      calculatedOn: String
      calculatedType: String
      isCTC: Boolean
      isESI: Boolean
      isPF: Boolean
      status: Boolean
      audit: auditInputs
      tenantid: ID
    ): PayStructureTypes

    editPayStructure(
      _id: ID!
      salaryStructure: String!
      payHeads: [PayHeadInputs]
      payHeadIDs: [ID]
      printName: String
      effectiveFrom: ISODate
      calculatedOn: String
      calculatedType: String
      isCTC: Boolean
      isESI: Boolean
      isPF: Boolean
      status: Boolean
      audit: auditInputs
      tenantid: ID
    ): PayStructureTypes

    salaryCalculateRequest (
      _id: ID
      paystructurename: String
      paystructureid: String
      amount: [Void]
      action: String
      audit: auditInputs
    ): SalaryCalculateTypes

    calculatePayStructure(
      input: CalculatedPayStructureInput!
    ): CalculatedPayStructureTypes

  }

  type SalaryCalculateTypes {
    _id: ID
    paystructurename: String
    paystructureid: String
    amount: [Void]
    action: String
    audit: auditTypes
  }

  type PayStructureTypes {
    _id: ID
    salaryStructure: String!
    payHeads: [PayHeadTypes]
    payHeadIDs: [ID]
    printName: String
    effectiveFrom: ISODate
    calculatedOn: String
    calculatedType: String
    isCTC: Boolean
    isESI: Boolean
    isPF: Boolean
    status: Boolean
    audit: auditTypes
    tenantid: ID
  }

  type CalculatedPayHeadTypes {
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
    calculatedValue: String!
    valueCalculated: Boolean!
  }

  type CalculatedPayStructureTypes {
    _id: ID!
    username: String
    eCode: String
    salaryStructure: String!
    calculatedPayHeads: [CalculatedPayHeadTypes]!
    tenantid: ID
  }

  input CalculatedPayHeadInputs {
    name: String!
    value: String!
    payhead_type: String
    calculationType: String
  }

  input CalculatedPayStructureInput {
    username: String
    eCode: String
    salaryStructure: String!
    payHeads: [CalculatedPayHeadInputs]!
    tenantid: ID
  }

  input PayStructureInputs {
    _id: ID
    salaryStructure: String!
    payHeads: [PayHeadInputs]
    payHeadIDs: [ID]
    printName: String
    effectiveFrom: ISODate
    calculatedOn: String
    calculatedType: String
    isCTC: Boolean
    isESI: Boolean
    isPF: Boolean
    status: Boolean
    comments: String
    audit: auditInputs
    tenantid: ID
  }
`;

const resolvers = require('./resolvers');

module.exports = {
  // typeDefs is an array, because it should be possible to split your schema if the schema grows to big, you can just export multiple here
  typeDefs: [typeDefs],
  resolvers,
};
