const AttendanceRequest = require('../../../models/attendance-request');

const approveRejectAttendanceRequest = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await AttendanceRequest.findOne(
      {
        $and: [
          { userID: args.userId },
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
      reject(new Error('Attendance Request Does Not Exist!'));
    } else {
      AttendanceRequest.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          tenantid,
          audit: {
            ...entity.audit,
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
          AttendanceRequest.findById(newEntity._id)
          .populate(
            { 
              path: 'user', 
              select: ['email', 'username', 'eCode', 'role'], 
              populate: { path: 'role', select: 'role_name' }, 
              populate: { path: 'employeeShifts', select: 'name' }
            }
          )
          .populate('toManager', ['eCode', 'username', 'title'])
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update Attendance Request!'));
              resolve(newEntity);
            });
        } else {
          reject(new Error('Unable to update Attendance Request!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = approveRejectAttendanceRequest;
