const Shift = require('../../../models/shifts');
const mongoose = require('mongoose');
const generateAuditTrail = require('../../../utils/audit-trails');
const editShift = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Shift.findOne({ $or: [{ _id: args._id, $and: [{ tenantid }] }, { name: args.code, $and: [{ tenantid }] }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'Shift', 'Find Shift', 'Edit', 'Failed', args, 'Shift Does Not Exist!');
      reject(new Error('Shift Does Not Exist!'));
    } else {
      Shift.findByIdAndUpdate(entity._id, {
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
          Shift.findById(newEntity._id)
            .exec(async function (err, newEntity) {
              if (!newEntity){
               return reject(new Error('Unable to update Shift!'));}
               else{
               generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'Shift', 'Edit Shift', 'Edit', 'Success', args, 'Shift Updated!');
             
               await newEntity.save();
              resolve(newEntity);
            }
          });
        } else {
          generateAuditTrail(null, null, me, tenantid, 'Shift', 'Find Shift', 'Edit', 'Failed', args, 'Unable to update Shift!');
          reject(new Error('Unable to update Shift!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editShift;
