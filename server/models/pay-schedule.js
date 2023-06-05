const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const payScheduleSchema = new Schema({
  calculateMonthlySalaryBasedUpon: { type: String, required: true },
  organisationWorkingDays: { type: String },
  employeePayDay: { type: String, required: true },
  employeePayDayOther: { type: String },
  status: { type: Boolean, default: true },
  audit: auditSchema,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
}, { collection: 'PaySchedule' }, {timestamps: true});


module.exports = mongoose.model('PaySchedule', payScheduleSchema);
