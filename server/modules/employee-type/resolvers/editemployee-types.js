const EmployeeType = require('../../../models/employee-types');
const generateAuditTrail = require('../../../utils/audit-trails');
const editEmployeeType = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await EmployeeType.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }, { _id: args._id, $and: [{ tenantid }] }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'EmployeeType ', 'Edit EmployeeType ', 'Edit', 'Failed', args, 'EmployeeType  Does Not Exist!');
      reject(new Error('EmployeeType Does Not Exist!'));
    } else {
      EmployeeType.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          tenantid,
          audit: {
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
          generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'EmployeeType ', 'Edit EmployeeType ', 'Edit', 'Success', args, 'EmployeeType Updated !');
          EmployeeType.findById(newEntity._id)
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update EmployeeType!'));
              await newEntity.save();
              resolve(newEntity);
            });
        } else {
          generateAuditTrail(null, null, me, tenantid, 'EmployeeType ', 'Edit EmployeeType ', 'Edit', 'Failed', args, 'Unable to update EmployeeType!');
          reject(new Error('Unable to update EmployeeType!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editEmployeeType;
