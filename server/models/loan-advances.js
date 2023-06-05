const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const loanAdvancesSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, immutable: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  loanType: { type: String, immutable: true },
  loanAmount: { type: Number },
  date: { type: Date },
  period: { type: Number }, // In Months
  EMI: { type: Number },
  outstanding: { type: Number },
  toManagerID: { type: mongoose.Schema.Types.ObjectId },
  toManager: { type: Object, ref: 'Users' },
  status: {
    type: String,
    enum: ['Pending', 'Declined', 'Approved', 'Recalled'],
    default: 'Pending',
  },
  comments: String,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
  audit: auditSchema,
}, { collection: 'LoanAdvances' }, {timestamps: true});


module.exports = mongoose.model('LoanAdvances', loanAdvancesSchema);
