const LeaveType = require('../../../models/leave-types');
const mongoose = require('mongoose');
const generateAuditTrail = require('../../../utils/audit-trails');
const createLeaveType = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await LeaveType.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }] });
    if (entity) {
      generateAuditTrail(null, null, me, tenantid, 'LeaveType', 'Find LeaveType', 'Create','Failed',args, 'Leave Type already exist');
      reject(new Error('Leave Type already exist!'));
    } else {
      const newEntity = await new LeaveType({
        ...{
          ...args,
          tenantid,
          audit: {
            created_at: new Date(),
            created_by: me?.user?.username
          }
        }
      });
      if(!newEntity) {
        generateAuditTrail(null, null, me, tenantid, 'LeaveType', 'Find LeaveType', 'Create','Failed',args, 'Unable to create Leave Type');
        reject(new Error('Unable to create Leave Type!'));
      }else{
        generateAuditTrail(null,newEntity._doc, me, tenantid, 'LeaveType', 'Find LeaveType', 'Create','Success',args, 'LeaveType Created');
      await newEntity.save();
      LeaveType.findById(newEntity._id)
        .exec( async function (err, newEntity) {
          if (err) return reject(new Error('Unable to create Leave Type!'));
          resolve(newEntity);
        })};
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createLeaveType;
