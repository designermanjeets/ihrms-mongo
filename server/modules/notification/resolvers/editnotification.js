const Notification = require('../../../models/notification');
const generateAuditTrail = require('../../../utils/audit-trails');
const editNotification = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    console.log(args)
    const entity = await Notification.findOne({ $or: [{ _id: args._id, $and: [{ tenantid }] }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'Notification', 'edit Notification', 'edit','Failed',args, 'Notification Does Not exist');
      reject(new Error('Notification Does Not Exist!'));
    } else {
      Notification.findByIdAndUpdate(entity._id, {
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
          Notification.findById(newEntity._id)
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update Notification!'));
              generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'Notification', 'edit Notification', 'Edit','Success',args, 'Holiday Updated');
              resolve(newEntity);
            });
        } else {
          generateAuditTrail(null, null, me, tenantid, 'Notification', 'Find Notification', 'Edit','Failed',args, 'Unable to update Holiday');
          reject(new Error('Unable to update Notification!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editNotification;
