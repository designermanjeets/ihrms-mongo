const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const notificationSchema = new Schema({

  // Official Details
  eCode: { type: String, immutable: true },
  title: { type: String },
  date: { type: Date },
  description: { type: String },
  status: { type: Boolean, default: true },
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
  audit: auditSchema,
}, { collection: 'Notification' });


module.exports = mongoose.model('Notification', notificationSchema);
