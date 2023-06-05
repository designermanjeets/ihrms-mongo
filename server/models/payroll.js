const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const payrollSchema = new Schema({
  month: Date,
  payrolls: [{
    salaryId: { type: mongoose.Schema.Types.ObjectId },
    month: { type: Date },
    eCode: { type: String, immutable: true },
    day_diff:{ type: Number },
    totalDaysAbsent:{ type: Number },
    totalDaysPresent:{ type: Number },
    user_overtime:{ type: Number },
    total_overtime_done_by_user:{ type: Number },
    user_range_salary:{ type: Number },
    user_salary:{ type: Number },
    username:{ type: String },
    status: {
      type: String,
      enum: ['Pending', 'Declined', 'Approved', 'Released', 'Hold'],
      default: 'Pending',
    },
    total_pay_heads_salary: { type: Number },
    Earnings_for_Employee: { type: Number },
    Employees_Statutory_Deductions: { type: Number },
    Employers_Statutory_Contributions: { type: Number },
    Security_Deposit: { type: Number },
    companyDaysOFF: { type: Number },
    overtime: { type: Number },
    total_overtime: { type: Number }
  }],
  payrollInputs: {
    payInputs: { type: Boolean },
    empViewRelease: { type: Boolean },
    statementView: { type: Boolean },
    payrollProcess: { type: Boolean },
  },
  audit: auditSchema,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
}, { collection: 'Payroll' }, {timestamps: true});


module.exports = mongoose.model('Payroll', payrollSchema);
