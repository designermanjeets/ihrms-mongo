const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const payFormulaSchema = new Schema({
  name: { type: String, required: true },
  formula: { type: String, required: true },
  status: { type: Boolean, default: true },
  audit: auditSchema,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
}, { collection: 'PayFormula' }, {timestamps: true});


module.exports = mongoose.model('PayFormula', payFormulaSchema);
