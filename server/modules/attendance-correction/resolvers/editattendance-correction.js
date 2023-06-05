const AttendanceCorrection = require('../../../models/attendance-corrections');

const editAttendanceCorrection = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const currDate = args.date.substring(0, 10);
    await AttendanceCorrection.findOne({ $and: [{ date: currDate }, { userId: args.userId }] })
      .then( async entity => {
        if(entity) {
          entity.user = args.userId;
          entity.toManager = args.toManagerID;
          await entity.save();
          AttendanceCorrection.findById(entity._id)
          .populate(
            { 
              path: 'user', 
              select: ['email', 'username', 'eCode', 'role'], 
              populate: { path: 'role', select: 'role_name' }, 
              populate: { path: 'employeeShifts', select: 'name' }
            }
          )
          .populate('toManager', ['eCode', 'username', 'title'])
            .exec( async function (err, entity) {
              if (err) return reject(new Error('Unable to update Attendance Correction!'));
              resolve(entity);
            });
        }
    });
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editAttendanceCorrection;

getFormattedDate = function (date) {
  const _date = new Date(date);
  const year = _date.getFullYear();
  const month = _date.getMonth() + 1;
  const day = _date.getDate();
  const time = _date.toTimeString();
  const dateString = (day <= 9 ? '0' + day : day) + '/' + (month <= 9 ? '0' + month : month) + '/' + year;
  return dateString;
}