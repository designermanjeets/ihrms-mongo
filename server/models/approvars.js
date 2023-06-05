const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const approvarsSchema = new Schema({
  name: { type: String, required: true, immutable: true },
  maxLevel: { type: Number, required: true },
  approvars: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      user: { type: Object, default: null },
      level: { type: Number },
    }
  ],
  status: { type: Boolean, default: true },
  audit: auditSchema,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
}, { collection: 'Approvars' }, {timestamps: true});


module.exports = mongoose.model('Approvars', approvarsSchema);
