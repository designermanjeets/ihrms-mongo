const Tenant = require('../../../models/tenants');
const User = require('../../../models/user');
const generateAuditTrail = require('../../../utils/audit-trails');

const editTenant = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Tenant.findOne({ $or: [{ name: args.name }, { _id: args._id }] });
    if (!entity) {

      // Audit Stuff Starts
      generateAuditTrail(null, null, me, tenantid, 'Tenant', 'Find Tenant', 'Edit', 'Failed', args, 'Tenant Does Not Exist!');
      // Audit Stuff Ends

      reject(new Error('Tenant Does Not Exist!'));
    } else {

      // if(args.adminEmailAddress !== entity.adminEmailAddress) {
      //   // Delete Previous User Access 
      //   await User.findOneAndUpdate(
      //     {email: entity.adminEmailAddress},
      //     {$pull : { tenantAccess : { _id: entity._id }}}
      //   )
      //   // Add New User Access 
      //   await User.findOne({email: args.adminEmailAddress})
      //   .exec(async function (err, user) {
      //     if (!user) {
      //       // Audit Stuff Starts
      //       generateAuditTrail(null, null, me, tenantid, 'Tenant', 'Find Admin User', 'Edit', 'Failed', args, 'Admin Email Does Not Exist!');
      //       // Audit Stuff Ends
      //       return reject(new Error('Admin Email Does Not Exist!'))
      //     } else {

      //       // Audit Stuff Starts
      //       generateAuditTrail(null, null, me, tenantid, 'Tenant', 'Find Admin User', 'Edit', 'Success', args, 'Admin User Tenant Access Updated');
      //       // Audit Stuff Ends
      //       user && user.tenantAccess.push(args._id)
      //       user && await user.save(); 
      //     }
      //   });
        
      // }

      Tenant.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          audit: {
            ...entity.audit,
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, async (err, newEntity) => {
        if(newEntity) {

          // Audit Stuff Starts
          generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'Tenant', 'Tenant Update', 'Edit', 'Success', args, 'Update Tenant Success!');
          // Audit Stuff Ends

          resolve(newEntity);
        } else {
          // Audit Stuff Starts
          generateAuditTrail(null, null, me, tenantid, 'Tenant', 'Edit Tenant', 'Edit', 'Failed', args, 'Unable to update Tenant!');
          // Audit Stuff Ends
          return reject(new Error('Unable to update Tenant!'));
        }
      });

    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editTenant;
