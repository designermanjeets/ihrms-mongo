const Holiday = require('../../../models/holidays');
const generateAuditTrail = require('../../../utils/audit-trails');
const editHolidays = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Holiday.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }, { _id: args._id, $and: [{ tenantid }] }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'Holiday', 'edit Holiday', 'edit','Failed',args, 'Holiday Does Not exist');
      reject(new Error('Holiday Does Not Exist!'));
    } else {
      Holiday.findByIdAndUpdate(entity._id, {
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
          Holiday.findById(newEntity._id)
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update Holiday!'));
              generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'Holiday', 'edit Holiday', 'Edit','Success',args, 'Holiday Updated');
              resolve(newEntity);
            });
        } else {
          generateAuditTrail(null, null, me, tenantid, 'Holiday', 'Find Holiday', 'Edit','Failed',args, 'Unable to update Holiday');
          reject(new Error('Unable to update Holiday!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editHolidays;
