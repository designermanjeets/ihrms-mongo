const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const attendanceSQLSchema = new Schema({
  _id: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, immutable: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  audit: auditSchema,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
  // Below Machine Specific Columns
  UserId: { type: String, immutable: true },
  DeviceLogId: { type: Number },
  DownloadDate: { type: Date },
  LogDate: { type: Date },
  date: { type: Date },
  eCode: { type: String },
  inTime: { type: Date },
  outTime: { type: Date },
  Direction: { type: String },
}, { collection: 'AttendancesSQL' });


module.exports = mongoose.model('AttendancesSQL', attendanceSQLSchema);
