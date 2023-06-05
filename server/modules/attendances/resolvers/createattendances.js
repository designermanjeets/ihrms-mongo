const ShiftRoster = require('../../../models/shift-roster');
const Attendance = require('../../../models/attendances');

const createAttendance = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  // const currDate = (args.inTime || args.outTime).substring(0, 10);
  try {
    const newEntity = await new Attendance({
      ...{
        ...args,
        user: args.userId,
        date: args.inTime || args.outTime,
        tenantid,
        audit: {
          created_at: new Date(),
          created_by: me?.user?.username
        }
      }
    });
    if(!newEntity) {
      reject(new Error('Unable to create Attendance!'));
    }
    
    await newEntity.save();
    Attendance.findById(newEntity._id)
      .populate(
        { 
          path: 'user', 
          select: ['email', 'username', 'eCode', 'role'], 
          populate: { path: 'role', select: 'role_name' }, 
          populate: { path: 'employeeShifts', select: 'name' }
        }
      )
      .exec( async function (err, newEntity) {
        if (err) return reject(new Error('Unable to create Attendance!'));
        resolve(newEntity);
    });
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createAttendance;

getFormattedDate = function (date) {
  const _date = new Date(date);
  const year = _date.getFullYear();
  const month = _date.getMonth() + 1;
  const day = _date.getDate();
  const time = _date.toTimeString();
  const dateString = (day <= 9 ? '0' + day : day) + '/' + (month <= 9 ? '0' + month : month) + '/' + year;
  return dateString;
}

getTimeOnly = function(date) {
  const _date = new Date(date);
  const time = (_date.toTimeString()).toString().slice(0, 8);
  return time;
}
