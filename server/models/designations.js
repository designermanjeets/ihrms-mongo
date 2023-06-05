const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const designationsSchema = new Schema({
  name: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, default: null },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Departments', default: null },
  parentDesignationId: { type: mongoose.Schema.Types.ObjectId, default: null },
  parentDesignation: { type: mongoose.Schema.Types.ObjectId, ref: 'Designations', default: null },
  status: { type: Boolean, default: true },
  comments: String,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
  audit: auditSchema,
}, { collection: 'Designations' }, {timestamps: true});


module.exports = mongoose.model('Designations', designationsSchema);
