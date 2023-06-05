const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const attendanceSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, immutable: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  eCode: { type: String },
  date: { type: Date, immutable: true, nullable: true },
  inTime: { type: Date, immutable: true, nullable: true },
  outTime: { type: Date, immutable: true, nullable: true },
  shift: { type: Object, ref: 'Shifts', nullable: true },
  overTime: { type: Number },
  totalDayWorkingHours: { type: Number },
  comments: { type: String },
  audit: auditSchema,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
}, { collection: 'Attendances' });


module.exports = mongoose.model('Attendances', attendanceSchema);
