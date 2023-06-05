const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const shiftRosterSchema = new Schema({
  name: { type: String, required: true, immutable: true },
  status: { type: Boolean, default: true },
  month: { type: Schema.Types.Mixed },
  department: { type: String },
  users: [{
    month: { type: Schema.Types.Mixed },
    eCode: { type: String },
    department: { type: String },
    username: { type: String },
    dateRange: [
      {
        date: { type: Schema.Types.Mixed },
        shifts: [{ type: String }],
      }
    ],
  }],
  comments: String,
  audit: auditSchema,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
}, { collection: 'ShiftRosters' });


module.exports = mongoose.model('ShiftRosters', shiftRosterSchema);
