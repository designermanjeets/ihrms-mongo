const AttendanceCorrection = require('../../../models/attendance-corrections');
const Attendances = require('../../../models/attendances');

const approveRejectTimeCorrection = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {

    try {
    const entity = await AttendanceCorrection.findOne(
      {
        $and: [
          { userId: args.userId },
          { _id: args._id },
          { tenantid }
        ]
      }
    );
    if (!entity) {
      reject(new Error('Attendance Time Correction Does Not Exist!'));
    } else {
      AttendanceCorrection.findByIdAndUpdate(entity._id, {
        $set: {
          status: args.status
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
            const payload = {
                userId:args.userId,
                date:args.date,
                inTime:args.inTime,
                outTime:args.outTime,
                shiftName:args.shiftName,
                comments:args.comments,
                tenantid:tenantid,
                audit: {
                    ...args.audit,
                    created_at: args.date,
                    created_by: args.created_by,
                  }
            }

             Attendances.create(
                payload
                 );
                 resolve(payload);
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

module.exports = approveRejectTimeCorrection;
