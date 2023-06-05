const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const leaveRequestSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, immutable: true },
  user: { type: Object, ref: 'Users' },
  startDate: { type: Date, required: true, immutable: true },
  endDate: { type: Date, required: true, immutable: true },
  days: { type: Number, default: 0, immutable: true },
  leaveTypeID: { type: mongoose.Schema.Types.ObjectId, immutable: true },
  leaveType: { type: Object, immutable: true, ref: 'LeaveTypes' },
  leaveTypeBalance: { type: Number },
  toManagerID: { type: mongoose.Schema.Types.ObjectId },
  toManager: { type: Object, ref: 'Users' },
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
    enum: ['Pending', 'Declined', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  comments: String,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
  audit: auditSchema,
}, { collection: 'LeaveRequests' }, { timestamps: true } );


module.exports = mongoose.model('LeaveRequests', leaveRequestSchema);
