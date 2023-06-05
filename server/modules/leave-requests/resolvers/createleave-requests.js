const LeaveRequest = require('../../../models/leave-requests');
const User = require('../../../models/user');
const mongoose = require('mongoose');
const generateAuditTrail = require('../../../utils/audit-trails');
const ObjectId = require('mongoose').Types.ObjectId;

var managers = [];

const createLeaveRequest = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    console.log(args)
    const entity = await LeaveRequest.findOne(
      {
        $or: [
          {
            $and: [
              { userID: ObjectId(args.userID) },
              { leaveTypeID: ObjectId(args.leaveTypeID) },
              { status: 'Pending' },
              { tenantid: ObjectId(tenantid) }
            ]
          },
          {
            $and: [
              { userID: ObjectId(args.userID) },
              { tenantid: ObjectId(tenantid) },
              {
                $or: [
                  { startDate: { $lte: new Date(args.startDate) }, endDate: { $gte: new Date(args.endDate) } },
                  { startDate: { $gt: new Date(args.startDate) }, endDate: { $lt: new Date(args.endDate) } }
                ]
              }
            ]
          }
        ],
      }
    );
    if (entity || entity?.length) {
      generateAuditTrail(null, null, me, tenantid, 'Leave Request', 'Find Leave Request', 'Create','Failed',args, 'Leave Request  already exist');
      reject(new Error('Leave Request already exist!'));
    } else {

      // Create New Leave Request for User Table
      User.findById(args.userID)
        .exec( async function (err, user) {
          if (err) return reject(new Error('User Does Not Exists!'));
          if(user) {
            var check_leave = '';
            var leaveTypeBalance = null;
            user.leaveTypesNBalance.forEach((ltype => {
              if(ltype._id == args.leaveTypeID ) {
                const remaining_days = ltype.remaining_days === null ? ltype.days: ltype.remaining_days;
                if(remaining_days < args.days) { // Reject if not enough days
                  check_leave = 1;
                  return reject(new Error('Not Enough Leaves!'));
                
                } else {
                  // ltype.remaining_days = (ltype.days - args.days);
                  leaveTypeBalance = ltype.remaining_days === null ? ltype.days: ltype.remaining_days
                  check_leave = 2;
                }
              }
            }));
            console.log(check_leave)

            if(!ObjectId.isValid(args.toManagerID)) { delete args.toManagerID };
            if(!ObjectId.isValid(args.leaveTypeID)) { delete args.leaveTypeID };

            let approvers = [];
            if(user.reportingManagerId) {
              approvers = await populateManager(user.reportingManagerId);
              managers = []; // Empty Managers after storing to another object
            }
            await user.save();

            // Create New Leave Request
            const newEntity = await new LeaveRequest({
              ...{
                ...args,
                tenantid,
                user: args.userID,
                leaveType: args.leaveTypeID,
                toManager: args.toManagerID,
                approvers: approvers,
                leaveTypeBalance,
                audit: {
                  created_at: new Date(),
                  created_by: me?.user?.username
                }
              }
            });

            if(!newEntity) {

              generateAuditTrail(null, null, me, tenantid, 'Leave Request', 'Find Leave Request', 'Create','Failed',args, 'Unable to create Leave Request');
              reject(new Error('Unable to create Leave Request!'));
            }

            generateAuditTrail(null, newEntity._doc, me, tenantid, 'Leave Request', 'Find Leave Request', 'Create','Success',args, 'Leave Request created');
           
            if(check_leave == 2) {
                 await newEntity.save();
                // Return Newly Created Leave Request for UI
                LeaveRequest.findById(newEntity._id)
                .populate('user', 'username email role eCode')
                .populate('toManager', 'username email role eCode _id')
                .populate('approvers', ['eCode', 'username', 'title', '_id'])
                .populate('leaveType', 'name days _id' )
                .exec( async function (err, newEntity) {
                  if (err) return reject(new Error('Unable to create Leave Request!'));
                  resolve(newEntity);
              });
            }
          }
      });
      
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createLeaveRequest;

const populateManager = async (node, isLastManager = false) => {

  if (node === null || isLastManager) {
    return false;
  }

  const reportingManager = await User.findById(node);

  if(reportingManager) {
    if (!reportingManager.reportingManagerId) { 
      isLastManager = true;
      node = reportingManager;
    } else {
      node = reportingManager.reportingManagerId;
    }

    await populateManager(node, isLastManager);

    node !== null && managers.push({
      approver: reportingManager._id,
      approverName: reportingManager.username,
      approverECode: reportingManager.eCode,
      approverID: reportingManager._id,
      approverLevel: managers.length + 1,
      approverStatus: 'Pending',
      approverComment: ''
    });
  }

  return managers;
};

