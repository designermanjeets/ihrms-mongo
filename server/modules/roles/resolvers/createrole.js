const Role = require('../../../models/role');
const generateAuditTrail = require('../../../utils/audit-trails');
const createRole = (_, args,{ me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const rol = await Role.findOne({ $or: [{ role_name: args.role_name, $and: [{ tenantid }] }] });
    if (rol) {
      generateAuditTrail(null, null, me, tenantid, 'Role', 'Create Role', 'Create', 'Failed', args, 'Role already Exist!');
      reject(new Error('Role already exist!'));
    } else {
      new Role( {
        ...args,
        tenantid,
        audit: {
          created_at: new Date(),
          created_by: me?.user?.username
        }
      }).save().then((item) => {
        if(item) {
          generateAuditTrail(null, item, me, tenantid, 'Role', 'Create Role', 'Create', 'Success', args, 'Role Created!');
          resolve(item);
        } else {
          generateAuditTrail(null, null, me, tenantid, 'Role', 'Create Role', 'Create', 'Failed', args, 'Unable to create Role!');
          reject(new Error('Unable to create Role!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createRole;
