const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getTenants(query: Pagination!): [TenantsTypes]
  }

  extend type Mutation {
    createTenant (
      name: String!
      printName: String
      logo: String
      website: String
      email: String
      phone: String
      fax: String
      address: String
      pinCode: String
      enquiryNo: String
      emergencyContact: String
      adminEmailAddress: String
      connectionString: String
      stateId: String
      countryId: String

      profile: profileInputs
      tax: taxInputs
      epf: epfInputs
      esi: esiInputs
      professionalTax: professionalTaxInputs
      lwf: lwfInputs

      status: Boolean
      comments: String
      audit: auditInputs
    ): TenantsTypes

    editTenant (
      _id: ID!
      name: String!
      printName: String
      logo: String
      website: String
      email: String
      phone: String
      fax: String
      address: String
      pinCode: String
      enquiryNo: String
      emergencyContact: String
      adminEmailAddress: String
      connectionString: String
      stateId: String
      countryId: String
      
      profile: profileInputs
      tax: taxInputs
      epf: epfInputs
      esi: esiInputs
      professionalTax: professionalTaxInputs
      lwf: lwfInputs

      status: Boolean
      comments: String
      audit: auditInputs
    ): TenantsTypes
  }

  type TenantsTypes {
    _id: ID
    name: String
    printName: String
    logo: String
    website: String
    email: String
    phone: String
    fax: String
    address: String
    pinCode: String
    enquiryNo: String
    emergencyContact: String
    adminEmailAddress: String
    connectionString: String
    stateId: String
    countryId: String
      
    profile: profileTypes
    tax: taxTypes
    epf: epfTypes
    esi: esiTypes
    professionalTax: professionalTaxTypes
    lwf: lwfTypes

    status: Boolean
    comments: String
    audit: auditTypes
  }

  input TenantsInputs {
    _id: ID
    name: String
    printName: String
    logo: String
    website: String
    email: String
    phone: String
    fax: String
    address: String
    pinCode: String
    enquiryNo: String
    emergencyContact: String
    adminEmailAddress: String
    connectionString: String
    stateId: ID
    countryId: ID
      
    profile: profileInputs
    tax: taxInputs
    epf: epfInputs
    esi: esiInputs
    professionalTax: professionalTaxInputs
    lwf: lwfInputs

    status: Boolean
    comments: String
    audit: auditInputs
  }

  input profileInputs {
    companyName: String
    companyLegalName: String
    companyContactPerson: String
    companyAddress: String
    companyPostalOrZipCode: String
    companyCity: String
    companyStateProvince: String
    companyCountry: String
    companyEmail: String
    companyPhone: String
    companyPhone2: String
    companyMobilePhone: String
    companyFax: String
    companyWebsite: String
    companyRegistration: String
    companyVAT: String
  }
  input taxInputs {
    PAN: String
    taxPayFrequency: String
    TAN: String
    TDSCircleAOSCode: String
  }
  input epfInputs {
    EPFNumber: String
    deductionCycle: String
    employerContributionRate: String
    employeeContributionRate: String
    includeEmployerContributionInCTC: Boolean
    overridePFContriAtEmployeeLevel: Boolean
    proRateRestrictedPFWage: Boolean
    considerAllIfWageLessThanAmount: Boolean
  }
  input esiInputs {
    ESINumber: String
    deductionCycle: String
    employerContributionRate: String
    employeeContributionRate: String
    includeEmployerContributionInCTC: Boolean
  }
  input professionalTaxInputs {
    workLocation: String
    PTNumber: String
    deductionCycle: String
  }
  input lwfInputs {
    workLocation: String
    deductionCycle: String
    employerContributionRate: String
    employeeContributionRate: String
  }

  type profileTypes {
    companyName: String
    companyLegalName: String
    companyContactPerson: String
    companyAddress: String
    companyPostalOrZipCode: String
    companyCity: String
    companyStateProvince: String
    companyCountry: String
    companyEmail: String
    companyPhone: String
    companyPhone2: String
    companyMobilePhone: String
    companyFax: String
    companyWebsite: String
    companyRegistration: String
    companyVAT: String
  }
  type taxTypes {
    PAN: String
    taxPayFrequency: String
    TAN: String
    TDSCircleAOSCode: String
  }
  type epfTypes {
    EPFNumber: String
    deductionCycle: String
    employerContributionRate: String
    employeeContributionRate: String
    includeEmployerContributionInCTC: Boolean
    overridePFContriAtEmployeeLevel: Boolean
    proRateRestrictedPFWage: Boolean
    considerAllIfWageLessThanAmount: Boolean
  }
  type esiTypes {
    ESINumber: String
    deductionCycle: String
    employerContributionRate: String
    employeeContributionRate: String
    includeEmployerContributionInCTC: Boolean
  }
  type professionalTaxTypes {
    workLocation: String
    PTNumber: String
    deductionCycle: String
  }
  type lwfTypes {
    workLocation: String
    deductionCycle: String
    employerContributionRate: String
    employeeContributionRate: String
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
