const LeaveType = require('../../../models/leave-types');
const generateAuditTrail = require('../../../utils/audit-trails');
const editLeaveType = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await LeaveType.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }, { _id: args._id, $and: [{ tenantid }] }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'LeaveType', 'Find LeaveType', 'Edit','Failed',args, 'Leave Type Does Not Exist');
      reject(new Error('Leave Type Does Not Exist!'));
    } else {
      LeaveType.findByIdAndUpdate(entity._id, {
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
          generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'LeaveType', 'Find LeaveType', 'Edit','Success',args, 'Leave Type Updated!');
          LeaveType.findById(newEntity._id)
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update Leave Type!'));
              resolve(newEntity);
            });
        } else {
          generateAuditTrail(null, null, me, tenantid, 'LeaveType', 'Find LeaveType', 'Edit','Failed',args, 'Unable to update Leave Type!');
          reject(new Error('Unable to update Leave Type!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editLeaveType;
