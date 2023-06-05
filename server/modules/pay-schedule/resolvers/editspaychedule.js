const PaySchedule = require('../../../models/pay-schedule');
const generateAuditTrail = require('../../../utils/audit-trails');
const editPaySchedule = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await PaySchedule.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }, { _id: args._id, $and: [{ tenantid }] }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'PaySchedule', 'Find PaySchedule', 'Edit', 'Failed', args, 'PaySchedule Does Not Exist!');
      reject(new Error('PaySchedule Does Not Exist!'));
    } else {
      PaySchedule.findByIdAndUpdate(entity._id, {
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
         
          PaySchedule.findById(newEntity._id)
            .exec(async function (err, newEntity) {

              if (!newEntity)
             
              return reject(new Error('Unable to update Pay Schedule!'));
             
              generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'PaySchedule', 'Edit PaySchedule', 'Edit', 'Success', args, 'PaySchedule Updated!');
              await newEntity.save();
              resolve(newEntity);
            });
        } else {
          generateAuditTrail(null, null, me, tenantid, 'PaySchedule', 'Find PaySchedule', 'Edit', 'Failed', args, 'Unable to update Pay Schedule!');
          reject(new Error('Unable to update Pay Schedule!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editPaySchedule;
