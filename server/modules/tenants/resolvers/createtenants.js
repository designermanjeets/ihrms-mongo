const Tenant = require('../../../models/tenants');
const User = require('../../../models/user');
const generateAuditTrail = require('../../../utils/audit-trails');

const createTenant = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Tenant.findOne({ $or: [{ name: args.name }] });
    if (entity) {

      // Audit Stuff Starts
      generateAuditTrail(null, null, me, tenantid, 'Tenant', 'Find Tenant', 'Create', 'Failed', args, 'Tenant already exist!');
      // Audit Stuff Ends

      reject(new Error('Tenant already exist!'));
    } else {
      const newEntity = await new Tenant({
        ...{
          ...args,
          audit: {
            created_at: new Date(),
            created_by: me?.user?.username
          }
        }
      });
      if(!newEntity) {

        // Audit Stuff Starts
        generateAuditTrail(null, null, me, tenantid, 'Tenant', 'Create Tenant', 'Create', 'Failed', args, 'Unable to create Tenant!');
        // Audit Stuff Ends

        reject(new Error('Unable to create Tenant!'));
      }

      await newEntity.save();

      // await User.findOne({email: newEntity.adminEmailAddress})
      //   .exec(async function (err, user) {
      //     if (!user) {

      //       // Audit Stuff Starts
      //       generateAuditTrail(null, null, me, tenantid, 'Tenant', 'Find Admin User', 'Create', 'Warning', args, 'Admin Email Does Not Exist but Tenant Created!');
      //       // Audit Stuff Ends

      //     } else {
      //       user.tenantAccess.push(newEntity._id)
      //       await user.save();
      //     }

      //   });

      resolve(newEntity);

    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createTenant;
