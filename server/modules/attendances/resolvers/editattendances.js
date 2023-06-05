const Attendance = require('../../../models/attendances');
const ShiftRoster = require('../../../models/shift-roster');

const editAttendance = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const currDate = args.date.substring(0, 10);
    await Attendance.findOne({ $and: [{ date: currDate }, { userId: args.userId }] })
      .then( async entity => {
        if(entity) {
          entity.user = args.userId;
          entity.attendances.push(args.attendances[0]); // Will always receive single entry from front-end
          await entity.save();
          ShiftRoster.find(
            {
              $and: [
                { 'roster.user._id': args.userId },
                { 'roster.dateRange.date': getFormattedDate(currDate) }
              ]
            }
          )
            .distinct(
              'roster.dateRange.shifts',
              { $and: [
                  { 'roster.dateRange.date': getFormattedDate(currDate) },
                ]
              }
            )
            .exec( async function (err, shiftRoster) {
              if (err) return reject(new Error('Shift Not Found!'));
              // args.attendances[0].shifts = shiftRoster;
              // entity.attendances.push(args.attendances[0]); // Will always receive single entry from front-end
              // await entity.save();

              Attendance.findById(entity._id)
                .populate({ path: 'user', select: ['email', 'username', 'role'], populate: { path: 'role', select: 'role_name' } })
                .exec( async function (err, entity) {
                  if (err) return reject(new Error('Unable to update Attendance!'));
                  resolve(entity);
                });
            });
        } else {
          const newEntity = await new Attendance({
            ...{
              ...args,
              tenantid,
              user: args.userId,
              date: currDate,
              audit: {
                updated_at: new Date(),
                updated_by: me?.user?.username
              }
            }
          });
          if(!newEntity) {
            reject(new Error('Unable to update Attendance!'));
          }
          ShiftRoster.find(
            {
              $and: [
                { 'roster.user._id': args.userId },
                { 'roster.dateRange.date': getFormattedDate(currDate) }
              ]
            }
          )
            .distinct(
              'roster.dateRange.shifts',
              { $and: [
                  { 'roster.dateRange.date': getFormattedDate(currDate) },
                ]
              }
            )
            .exec( async function (err, shiftRoster) {
              if (err) return reject(new Error('Shift Not Found!'));
              // newEntity.attendances[0].shifts = shiftRoster;
              await newEntity.save();

              Attendance.findById(newEntity._id)
                .populate({ path: 'user', select: ['email', 'username', 'role'], populate: { path: 'role', select: 'role_name' } })
                .exec( async function (err, newEntity) {
                  if (err) return reject(new Error('Unable to update Attendance!'));
                  resolve(newEntity);
                });
            });
        }
    });
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editAttendance;

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
