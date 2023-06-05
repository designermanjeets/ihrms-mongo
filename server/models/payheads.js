const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const payHeadSchema = new Schema({

  name: { type: String, required: true },
  namePayslip: { type: String, required: true },
  payhead_type: { type: String },
  stattutoryPaytype: { type: String },
  underAccountGroup: { type: String },
  affectNetSalary: { type: Boolean },
  currencyOfLedger: { type: String },
  calculationType: { type: String },
  calculationPeroid: { type: String },
  
  computedFormulaID: { type: mongoose.Schema.Types.ObjectId },
  computedFormula: { type: mongoose.Schema.Types.ObjectId, ref: 'PayFormula' },
  effectiveFrom: { type: Date },
  amountGreaterThan: { type: String },
  amountUpto: { type: String },
  slabType: { type: String },
  slabValue: { type: String },
  roundOff: { type: String },
  limit: { type: String },

  status: { type: Boolean, default: true },
  comments: String,
  audit: auditSchema,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },

}, { collection: 'PayHeads' }, {timestamps: true});


module.exports = mongoose.model('PayHeads', payHeadSchema);
