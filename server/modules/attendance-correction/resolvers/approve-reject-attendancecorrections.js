const AttendanceCorrection = require('../../../models/attendance-corrections');

const approveRejectAttendanceCorrection = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await AttendanceCorrection.findOne(
      {
        $and: [
          { userID: args.userId },
          { _id: args._id },
          { tenantid }
        ]
      }
    );
    if (!entity) {
      reject(new Error('Attendance Correction Does Not Exist!'));
    } else {
      AttendanceCorrection.findByIdAndUpdate(entity._id, {
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
          AttendanceCorrection.findById(newEntity._id)
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
              if (err) return reject(new Error('Unable to update Attendance Correction!'));
              resolve(newEntity);
            });
        } else {
          reject(new Error('Unable to update Attendance Correction!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = approveRejectAttendanceCorrection;
