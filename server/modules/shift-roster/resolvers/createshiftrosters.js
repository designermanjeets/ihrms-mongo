const ShiftRoster = require('../../../models/shift-roster');
const Shift = require('../../../models/shifts');
const async = require('async');
const generateAuditTrail = require('../../../utils/audit-trails');

const createShiftRoster = (_, args, { me, secret }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await ShiftRoster.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }] });
    if (entity) {
      generateAuditTrail(null, null, me, tenantid, 'ShiftRoster', 'Find ShiftRoster', 'Create','Failed',args, 'ShiftRoster already exist!');
      reject(new Error('ShiftRoster already exist!'));
    } else {

      // await async.forEach(args?.roster, async (rstr, callback) => {
      //   await async.forEach(rstr?.dateRange, async (range, callback) => {
      //     await async.forEach(range?.shifts, async (shift, callback) => {
      //       shift.general = await Shift.findById(shift._id).distinct('general');
      //     });
      //   });
      // });

      const newEntity = await new ShiftRoster({
        ...{
          ...args,
          tenantid,
          audit: {
            created_at: new Date(),
            created_by: me?.user?.username
          }
        }
      });
      if(!newEntity) {
        generateAuditTrail(null, null, me, tenantid, 'ShiftRoster', 'Find ShiftRoster', 'Create','Failed',args, 'Unable to create ShiftRoster!');
        reject(new Error('Unable to create ShiftRoster!'));
      }else{
      generateAuditTrail(null, newEntity.doc, me, tenantid, 'ShiftRoster', 'Create ShiftRoster', 'Create', 'Success', args,'ShiftRoster created!');

      await newEntity.save();
      resolve(newEntity);
    }}
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createShiftRoster;
