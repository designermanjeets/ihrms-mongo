const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const leaveTypesSchema = new Schema({
  name: { type: String, required: true, },
  days: { type: Number, default: 0 },
  carryForward: { type: Boolean, default: false },
  carryForwardDays: { type: Number, default: 0 },
  countWeekends: { type: Boolean, default: 0 },
  comments: String,
  status: { type: Boolean, default: true },
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
  audit: auditSchema,
}, { collection: 'LeaveTypes' }, {timestamps: true});


module.exports = mongoose.model('LeaveTypes', leaveTypesSchema);
