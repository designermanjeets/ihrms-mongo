const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getShifts(query: Pagination!): [ShiftTypes]
  }

  extend type Mutation {
    createShift (
      name: String!
      code: String!
      color: String
      status: Boolean
      comments: String
      general: generalInputs
      workingHours: workingHoursInputs
      shiftRotation: shiftRotationInputs
      payDays: payDaysInputs
      permissions: permissionsInputs
      regularization: regularizationInputs
      audit: auditInputs
    ): ShiftTypes

    editShift (
      _id: ID
      name: String!
      code: String
      color: String
      status: Boolean
      comments: String
      general: generalInputs
      workingHours: workingHoursInputs
      shiftRotation: shiftRotationInputs
      payDays: payDaysInputs
      permissions: permissionsInputs
      regularization: regularizationInputs
      audit: auditInputs
    ): ShiftTypes
  }

  type ShiftTypes {
    _id: ID
    name: String
    code: String
    color: String
    status: Boolean
    comments: String
    tenantId: ID
    general: generalTypes
    workingHours: workingHoursTypes
    shiftRotation: shiftRotationTypes
    payDays: payDaysTypes
    permissions: permissionsTypes
    regularization: regularizationTypes
    audit: auditTypes
  }

  input ShiftInputs {
    _id: ID
    name: String
    code: String
    color: String
    status: Boolean
    comments: String
    tenantId: ID
    general: generalInputs
    workingHours: workingHoursInputs
    shiftRotation: shiftRotationInputs
    payDays: payDaysInputs
    permissions: permissionsInputs
    regularization: regularizationInputs
    audit: auditInputs
  }

  type generalTypes {
    effectiveFrom: ISODate
    defaultTimeFrom: String
    defaultTimeTo: String
    break: String
    overTimeApplicable: Boolean
  }

  input generalInputs {
    effectiveFrom: ISODate
    defaultTimeFrom: String
    defaultTimeTo: String
    break: String
    overTimeApplicable: Boolean
  }

  type workingHoursTypes {
    minimumHoursRequired: Int
    minimumHoursRequiredHalfDay: Int
    totalHoursCalculations: String
    graceTimeRequired: Int
    graceNumberTimeRequired: Int
  }

  input workingHoursInputs {
    minimumHoursRequired: Int
    minimumHoursRequiredHalfDay: Int
    totalHoursCalculations: String
    graceTimeRequired: Int
    graceNumberTimeRequired: Int
  }

  type shiftRotationTypes {
    scheduleName: String
    scheduleFrequency: String
    frequencyStartsOn: String
    timeOfSchedule: String
    frequencyDays: String
    applicableFor: String
    selectApplicableFor: String
    shiftRotateFrom: String
    shiftRotateTo: String
  }

  input shiftRotationInputs {
    scheduleName: String
    scheduleFrequency: String
    frequencyStartsOn: String
    timeOfSchedule: String
    frequencyDays: String
    applicableFor: String
    selectApplicableFor: String
    shiftRotateFrom: String
    shiftRotateTo: String
  }

  type payDaysTypes {
    includeWeekend: Boolean
    includeHolidays: Boolean
    includeLeave: Boolean
    carryOverBalanceHoursInOvertimeReport: Boolean
    overtimeReportCalculationBy: String
  }

  input payDaysInputs {
    includeWeekend: Boolean
    includeHolidays: Boolean
    includeLeave: Boolean
    carryOverBalanceHoursInOvertimeReport: Boolean
    overtimeReportCalculationBy: String
  }

  type permissionsTypes {
    webCheckInCheckout: Boolean
    mobileCheckInCheckout: Boolean
    managerCanEdit: Boolean
    notifyAdminOnEdit: Boolean
  }

  input permissionsInputs {
    webCheckInCheckout: Boolean
    mobileCheckInCheckout: Boolean
    managerCanEdit: Boolean
    notifyAdminOnEdit: Boolean
  }

  type regularizationTypes {
    regularForFutureEnable: Boolean
    requestCanBeRaisedForChangeDays: Int
  }

  input regularizationInputs {
    regularForFutureEnable: Boolean
    requestCanBeRaisedForChangeDays: Int
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
