const Notification = require('../../../models/notification');
const mongoose = require('mongoose');
const generateAuditTrail = require('../../../utils/audit-trails');
const createNotification = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    console.log(args)
    const entity = await Notification.findOne({ $or: [{ title: args.title, $and: [{ tenantid }] }] });
    if (entity) {
      generateAuditTrail(null, null, me, tenantid, 'Notification', 'Find Notification', 'Create','Failed',args, 'Notification already exist');
      reject(new Error('Notification already exist!'));
    } else {
      const newEntity = await new Notification({
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
        generateAuditTrail(null, null, me, tenantid, 'Holiday', 'Find Holiday', 'Create','Failed',args, 'Unable to create Holiday');
        reject(new Error('Unable to create Holiday!'));
      }else{
        generateAuditTrail(null, newEntity._doc, me, tenantid, 'Holiday', 'Find Holiday', 'Create','Success',args, 'Holiday created');
      await newEntity.save();
      Notification.findById(newEntity._id)
        .exec( async function (err, newEntity) {
          if (err) return reject(new Error('Unable to create Holiday!'));
          resolve(newEntity);
        })};
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createNotification;
