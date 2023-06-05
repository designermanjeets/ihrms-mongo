const LeaveRequest = require('../../../models/leave-requests');
const generateAuditTrail = require('../../../utils/audit-trails');
const editLeaveRequest = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await LeaveRequest.findOne(
      {
        $and: [
          { userID: args.userID },
          { leaveTypeID: args.leaveTypeID },
          { tenantid },
          {
            $or: [
              { startDate: { $lte: new Date(args.startDate) }, endDate: { $gte: new Date(args.endDate) } },
              { startDate: { $gt: new Date(args.startDate) }, endDate: { $lt: new Date(args.endDate) } }
            ]
          }
        ]
      }
    );
    if (!entity || !entity?.length) {
      generateAuditTrail(null, null, me, tenantid, 'Leave Request', 'Find Leave Request', 'Edit','Failed',args, 'Leave Request  Does Not exist');
      reject(new Error('Leave Request Does Not Exist!'));
    } else {
      await LeaveRequest.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          tenantid,
          user: args.userID,
          leaveType: args.leaveTypeID,
          toManager: args.toManagerID,
          audit: {
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
          generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'Leave Request', 'Find Leave Request', 'Edit','Success',args, 'Leave Request  Upadted');
          LeaveRequest.findById(newEntity._id)
            .populate('user', ['eCode', 'username', 'title'])
            .populate('leaveType', ['name', 'days', 'carryForward', 'carryForwardDays', 'countWeekends'])
            .populate('toManager', ['eCode', 'username', 'title'])
            .exec(async function (err, newEntity) {
              generateAuditTrail(null, null, me, tenantid, 'Leave Request', 'Find Leave Request', 'Edit','Failed',args, 'Unable to update Leave Request');
              if (err) return reject(new Error('Unable to update Leave Request!'));
              resolve(newEntity);
            });
        } else {
          reject(new Error('Unable to update Leave Request!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editLeaveRequest;
