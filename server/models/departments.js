const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const departmentSchema = new Schema({
  name: { type: String, required: true },
  departmentLeadId: { type: mongoose.Schema.Types.ObjectId, default: null },
  departmentLead: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', default: null },
  parentDepartmentId: { type: mongoose.Schema.Types.ObjectId, default: null },
  parentDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Departments', default: null },
  leaveTypesIDs: [{ type: mongoose.Schema.Types.ObjectId }],
  leaveTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LeaveTypes', default: null }],
  status: { type: Boolean, default: true },
  comments: { type: String, default: null },
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
  audit: auditSchema,
}, { collection: 'Departments' }, {timestamps: true});


module.exports = mongoose.model('Departments', departmentSchema);
