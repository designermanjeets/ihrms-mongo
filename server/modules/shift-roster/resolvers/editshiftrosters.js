const ShiftRoster = require('../../../models/shift-roster');
const async = require('async');
const Shift = require('../../../models/shifts');
const generateAuditTrail = require('../../../utils/audit-trails');
const editShiftRoster = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await ShiftRoster.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }, { _id: args._id, $and: [{ tenantid }] }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'ShiftRoster', 'Find ShiftRoster', 'Edit', 'Failed', args, 'ShiftRoster Does Not Exist!');
      reject(new Error('ShiftRoster Does Not Exist!'));
    } else {

      // await async.forEach(args?.roster, async (rstr, callback) => {
      //   await async.forEach(rstr?.dateRange, async (range, callback) => {
      //     await async.forEach(range?.shifts, async (shift, callback) => {
      //       shift.general = await Shift.findById(shift._id).distinct('general');
      //     });
      //   });
      // });
    
      ShiftRoster.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          tenantid,
          audit: {
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
          generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'ShiftRoster', 'Find ShiftRoster', 'Edit', 'Success', args, 'ShiftRoster Updated!');
          resolve(newEntity);
        } else {
          generateAuditTrail(null, null, me, tenantid, 'ShiftRoster', 'Find ShiftRoster', 'Edit', 'Failed', args, 'Unable to update ShiftRoster!');

          reject(new Error('Unable to update ShiftRoster!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editShiftRoster;
