const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const tenantsSchema = new Schema({
  name: { type: String, required: true },
  printName: { type: String, required: true },
  logo: String,
  website: String,
  email: String,
  phone: String,
  fax: String,
  address: String,
  pinCode: String,
  enquiryNo: String,
  emergencyContact: String,
  adminEmailAddress: String,
  connectionString: String,
  stateId: String,
  countryId: String,
  profile: {
    companyName: { type: String },
    companyLegalName: { type: String },
    companyContactPerson: { type: String },
    companyAddress: { type: String },
    companyPostalOrZipCode: { type: String },
    companyCity: { type: String },
    companyStateProvince: { type: String },
    companyCountry: { type: String },
    companyEmail: { type: String },
    companyPhone: { type: String },
    companyPhone2: { type: String },
    companyMobilePhone: { type: String },
    companyFax: { type: String },
    companyWebsite: { type: String },
    companyRegistration: { type: String },
    companyVAT: { type: String },
  },
  tax: {
    PAN: { type: String },
    taxPayFrequency: { type: String },
    TAN: { type: String },
    TDSCircleAOSCode: { type: String },
  },
  epf: {
    EPFNumber: { type: String },
    deductionCycle: { type: String },
    employerContributionRate: { type: String },
    employeeContributionRate: { type: String },
    includeEmployerContributionInCTC: { type: Boolean },
    overridePFContriAtEmployeeLevel: { type: Boolean },
    proRateRestrictedPFWage: { type: Boolean },
    considerAllIfWageLessThanAmount: { type: Boolean },
  },
  esi: {
    ESINumber: { type: String },
    deductionCycle: { type: String },
    employerContributionRate: { type: String },
    employeeContributionRate: { type: String },
    includeEmployerContributionInCTC: { type: Boolean },
  },
  professionalTax: {
    workLocation: { type: String },
    PTNumber: { type: String },
    deductionCycle: { type: String },
  },
  lwf: {
    workLocation: { type: String },
    deductionCycle: { type: String },
    employerContributionRate: { type: String },
    employeeContributionRate: { type: String },
  },
  status: { type: Boolean, default: true },
  comments: String,
  audit: auditSchema,
}, { collection: 'Tenants' }, {timestamps: true});


module.exports = mongoose.model('Tenants', tenantsSchema);
