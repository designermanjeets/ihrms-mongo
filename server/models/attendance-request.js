const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const attendanceRequestSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, immutable: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, default: 0 },
  attendanceType: { 
    type: String, 
    required: true, 
    enum: ['WFH', 'Remote', 'OnDuty'],
  },
  approvers: [
    { 
      approver: { type: Object, ref: 'Users' },
      approverName: { type: String },
      approverECode: { type: String },
      approverID: { type: mongoose.Schema.Types.ObjectId },
      approverLevel: { type: Number },
      approverStatus: { type: String, enum: ['Pending', 'Declined', 'Approved', 'Rejected'], default: 'Pending' },
      approverComment: { type: String }
    }
  ],
  status: {
    type: String,
    enum: ['Pending', 'Declined', 'Approved'],
    default: 'Pending',
  },
  toManagerID: { type: mongoose.Schema.Types.ObjectId },
  toManager: { type: Object, ref: 'Users' },
  latitude: { type: String },
  longitude: { type: String },
  location: { type: String },
  manualLocation: { type: String },
  comments: { type: String },
  audit: auditSchema,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
}, { collection: 'AttendanceRequests' });


module.exports = mongoose.model('AttendanceRequests', attendanceRequestSchema);
