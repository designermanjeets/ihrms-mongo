const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const taskSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, immutable: true },
  user: { type: Object, ref: 'Users' },
  startDate: { type: Date, required: true, immutable: true },
  endDate: { type: Date, required: true, immutable: true },
  days: { type: Number, default: 0, immutable: true },
  createdByID: { type: mongoose.Schema.Types.ObjectId },
  createdBy: { type: Object, ref: 'Users' },
  status: {
    type: String,
    enum: ['Pending', 'Declined', 'Approved'],
    default: 'Pending',
  },
  timeAssigned: { type: Number },
  timeTaken: { type: Number },
  comments: String,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
  audit: auditSchema,
}, { collection: 'Tasks' }, { timestamps: true } );


module.exports = mongoose.model('Tasks', taskSchema);
