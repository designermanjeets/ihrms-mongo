const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const TimesheetsSchema = new Schema({
  projectName: { type: String, required: true },
  assignedToID: { type: mongoose.Schema.Types.ObjectId, required: true },
  assignedTo: { type: Object, ref: 'Users' },
  createdByID: { type: mongoose.Schema.Types.ObjectId },
  createdBy: { type: Object, ref: 'Users' },
  departmentID: { type: mongoose.Schema.Types.ObjectId },
  department: { type: Object, ref: 'Departments' },
  assignedDate: { type: Date },
  startDate: { type: Date },
  endDate: { type: Date },
  hours: { type: Number },
  description: { type: String },
  comments: String,
  status: { type: Boolean, default: true },
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
  audit: auditSchema,
}, { collection: 'Timesheets' }, {timestamps: true});


module.exports = mongoose.model('Timesheets', TimesheetsSchema);
