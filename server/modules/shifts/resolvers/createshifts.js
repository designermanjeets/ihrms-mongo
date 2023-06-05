const Shift = require('../../../models/shifts');
const mongoose = require('mongoose');
const generateAuditTrail = require('../../../utils/audit-trails');
const createShift = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Shift.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }, { name: args.code, $and: [{ tenantid }] }] });
    if (entity) {
      generateAuditTrail(null, null, me, tenantid, 'Shift', 'Create Shift', 'Create', 'Failed', args, 'Shift already Exist!');
      reject(new Error('Shift already exist!'));
    } else {
      const newEntity = await new Shift({
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
        generateAuditTrail(null, null, me, tenantid, 'Shift', 'Find Shift', 'Create', 'Failed', args, 'Unable to create Shift!');
        reject(new Error('Unable to create Shift!'));
      }
      else{ generateAuditTrail(null, newEntity.doc, me, tenantid, 'Shift', 'Create Shift', 'Create', 'Success', args,'Shift created!');
      await newEntity.save();
      Shift.findById(newEntity._id)
        .exec( async function (err, newEntity) {
          if (err) return reject(new Error('Unable to create Shift!'));
          await newEntity.save();
          resolve(newEntity);
        });
    }}
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createShift;
