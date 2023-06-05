const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const roleSchema = new Schema({
  id: String,
  role_name: { type: String, required: true, immutable: true },
  privileges: {
    module: [{
      name: String,
      iconName: String,
      url:String,
      sub_module: [{
        db: String,
        name: String,
        iconName: String,
        isChild:Boolean,
        url:String,
        actions: {
          show: { type: Boolean, default: false },
          add: { type: Boolean, default: false },
          edit: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
          authorize: { type: Boolean, default: false },
          cancel: { type: Boolean, default: false },
          import: { type: Boolean, default: false },
          export: { type: Boolean, default: false },
        }
      }]
    }]
  },
  isDefault: { type: Boolean },
  status: { type: Boolean, default: true },
  comments: String,
  audit: auditSchema,
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },

}, { collection: 'Role' });

module.exports = mongoose.model('Role', roleSchema);
