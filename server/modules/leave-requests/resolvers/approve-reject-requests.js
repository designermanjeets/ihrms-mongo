const LeaveRequest = require('../../../models/leave-requests');
const generateAuditTrail = require('../../../utils/audit-trails');
const User = require('../../../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

const approveRejectLeaveRequest = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await LeaveRequest.findOne(
      {
        $and: [
          { userID: args.userID },
          { _id: args._id },
          { tenantid }
          // {
          //   $or: [
          //     { startDate: { $lte: new Date(args.startDate) }, endDate: { $gte: new Date(args.endDate) } },
          //     { startDate: { $gt: new Date(args.startDate) }, endDate: { $lt: new Date(args.endDate) } }
          //   ]
          // }
        ]
      }
    );
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'Leave Request', 'Find Leave Request', 'approveReject','Failed',args, 'Leave Request  Does Not exist');
      reject(new Error('Leave Request Does Not Exist!'));
    } else {

      // console.log(args); // args.status ==== 'Approved', 'Rejected', 'Declined'
      User.findById(entity.userID)
        .exec( async function (err, user) {
          if (err) return reject(new Error('User Does Not Exists!'));
          if(user) {
            
            LeaveRequest.findByIdAndUpdate(entity._id, {
              $set: {
                tenantid,
                audit: {
                  ...entity.audit,
                  modified_at: new Date(),
                  modified_by: me?.user?.username
                }
              }
            }, { new: true, useFindAndModify: false }, async (err, newEntity) => {
              if(newEntity) {

                let isPendingOrRejected = false;
                newEntity.approvers.forEach(appr => {
                  if(appr.approverID.toString() === args.approvers[0].approverID.toString()) {
                    appr.approverStatus = args.status;
                  }
                  if(appr.approverStatus === 'Pending') { 
                    newEntity.status = 'Pending'; // Final Leave Status
                    isPendingOrRejected = true;
                  }
                  if(appr.approverStatus === 'Rejected') { 
                    newEntity.status = 'Rejected'; // Final Leave Status
                    isPendingOrRejected = true;
                  }
                  if(appr.approverStatus === 'Declined') { 
                    newEntity.status = 'Declined'; // Final Leave Status
                    isPendingOrRejected = true;
                  }
                });

                if(!isPendingOrRejected) { 
                  newEntity.status = 'Approved';
                  user.leaveTypesNBalance.forEach((ltype => {
                    if(ltype._id.toString() == entity.leaveTypeID.toString()) {
                      // if(args.status === 'Rejected' || args.status === 'Declined') {
                      //   ltype.remaining_days = (ltype.remaining_days + entity.days);
                      // }
                      console.log(ltype.remaining_days);
                      console.log(ltype.days);
                      console.log(newEntity.days);
                      ltype.remaining_days = (ltype.days - newEntity.days); // Minus when All Approved || Reverse Previous Logic
                    }
                  }));
                  await user.save();
                
                } // Final Leave Status

                await newEntity.save();

                generateAuditTrail(null, newEntity._doc, me, tenantid, 'Leave Request', 'Find Leave Request', 'approveReject','Success',args, 'Leave Request  updated');
                
                LeaveRequest.findById(newEntity._id)
                  .populate('user', ['eCode', 'username', 'title'])
                  .populate('leaveType', ['name', 'days', 'carryForward', 'carryForwardDays', 'countWeekends'])
                  .populate('toManager', ['eCode', 'username', 'title'])
                  .exec(async function (err, newEntity) {
                    generateAuditTrail(null, null, me, tenantid, 'Leave Request', 'Find Leave Request', 'approveReject','Failed',args, 'Unable to update Leave Request');
                    if (err) return reject(new Error('Unable to update Leave Request!'));
                    resolve(newEntity);
                  });
              } else {
                reject(new Error('Unable to update Leave Request!'));
              }
            });

          }

      });

    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = approveRejectLeaveRequest;
