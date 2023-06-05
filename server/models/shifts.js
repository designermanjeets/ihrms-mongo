const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const shiftsSchema = new Schema({
  name: { type: String, required: true, immutable: true },
  code: { type: String, required: true, immutable: true },
  color: { type: String, default: '#FFFFFF' },
  status: { type: Boolean, default: true },
  comments: String,
  general: {
    effectiveFrom: { type: Date },
    defaultTimeFrom: { type: String },
    defaultTimeTo: { type: String },
    break: { type: String },
    overTimeApplicable: { type: Boolean },
  },
  workingHours: {
    minimumHoursRequired: { type: Number },
    minimumHoursRequiredHalfDay: { type: Number },
    totalHoursCalculations: { type: String },
    graceTimeRequired: { type: Number },
    graceNumberTimeRequired: { type: Number },
  },
  shiftRotation: {
    scheduleName: { type: String },
    scheduleFrequency: { type: String },
    frequencyStartsOn: { type: String },
    timeOfSchedule: { type: String },
    frequencyDays: { type: String },
    applicableFor: { type: String },
    selectApplicableFor: { type: String },
    shiftRotateFrom: { type: String },
    shiftRotateTo: { type: String },
  },
  payDays: {
    includeWeekend: { type: Boolean },
    includeHolidays: { type: Boolean },
    includeLeave: { type: Boolean },
    carryOverBalanceHoursInOvertimeReport: { type: Boolean },
    overtimeReportCalculationBy: { type: String },
  },
  permissions: {
    webCheckInCheckout: { type: Boolean },
    mobileCheckInCheckout: { type: Boolean },
    managerCanEdit: { type: Boolean },
    notifyAdminOnEdit: { type: Boolean },
  },
  regularization: {
    regularForFutureEnable: { type: Boolean },
    requestCanBeRaisedForChangeDays: { type: Number },
  },
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
  audit: auditSchema,
}, { collection: 'Shifts' }, {timestamps: true});


module.exports = mongoose.model('Shifts', shiftsSchema);
