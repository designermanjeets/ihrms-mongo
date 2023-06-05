const Role = require('../../../models/role');
const generateAuditTrail = require('../../../utils/audit-trails');
const editRole = (_, args,{ me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    let query;
    if(me?.user?.username === 'gonngod') {
      query = { $or: [{ _id: args._id }, { role_name: args.role_name }]};
    } else {
      query = { $or: [{ _id: args._id, $and: [{ tenantid }]}, { role_name: args.role_name, $and: [{ tenantid }] }]};
    }
    const rol = await Role.findOne(query);
    if (!rol) {
      generateAuditTrail(null, null, me, tenantid, 'Role', 'Find Role', 'Edit', 'Failed', args, 'Role Does Not Exist!');
      reject(new Error('Role Does Not Exist!'));
    } else {
      Role.findByIdAndUpdate(rol._id, {
        $set: {
          ...args,
          audit: {
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, async (err, role) => {
        if(role) {
          // Below is getting in infinite loop so avoiding for now
          // generateAuditTrail(rol._doc, role._doc, me, tenantid, 'Role', 'Find Role', 'Edit', 'Success', args, 'Role updated');
          await role.save();
          resolve(role);
        }
        if(err || !role) {
          generateAuditTrail(null, null, me, tenantid, 'Role', 'Find Role', 'Edit', 'Failed', args, 'Unable to update Role!');
          reject(Error('Unable to update Role!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editRole;
