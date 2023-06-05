const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const payStructureSchema = new Schema({
  salaryStructure: { type: String, required: true },
  payHeadIDs: [{ type: mongoose.Schema.Types.ObjectId }],
  payHeads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PayHeads' }],
  printName: { type: String },
  effectiveFrom: { type: Date },
  calculatedOn: { type: String },
  calculatedType: { type: String },
  isCTC: { type: Boolean, default: false },
  isESI: { type: Boolean, default: false },
  isPF: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
  audit: auditSchema,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
}, { collection: 'PayStructure' }, {timestamps: true});


module.exports = mongoose.model('PayStructure', payStructureSchema);
