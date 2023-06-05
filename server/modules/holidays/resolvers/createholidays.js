const Holiday = require('../../../models/holidays');
const mongoose = require('mongoose');
const generateAuditTrail = require('../../../utils/audit-trails');
const createHolidays = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Holiday.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }, { date: args.date, $and: [{ tenantid }] }] });
    if (entity) {
      generateAuditTrail(null, null, me, tenantid, 'Holiday', 'Find Holiday', 'Create','Failed',args, 'Holiday already exist');
      reject(new Error('Holiday already exist!'));
    } else {
      const newEntity = await new Holiday({
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
      Holiday.findById(newEntity._id)
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

module.exports = createHolidays;
