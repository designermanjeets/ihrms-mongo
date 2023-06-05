const PaySchedule = require('../../../models/pay-schedule');
const generateAuditTrail = require('../../../utils/audit-trails');
const createPaySchedule = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await PaySchedule.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }] });
    if (entity) {
      generateAuditTrail(null, null, me, tenantid, 'Pay Schedule', 'Create Pay Schedule', 'Create', 'Failed', args, 'Pay Schedule already Exist!');

      reject(new Error('Pay Schedule already exist!'));
    } else {
      const newEntity = await new PaySchedule({
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
        generateAuditTrail(null, null, me, tenantid, 'PaySchedule', 'Create PaySchedule', 'Create', 'Failed', args, 'Unable to Create Pay Schedule!');
        reject(new Error('Unable to create Pay Schedule!'));
      }else{
        generateAuditTrail(null, newEntity._doc, me, tenantid, 'PaySchedule', 'Create PaySchedule', 'Edit', 'Success', args, 'PaySchedule Created!');
      await newEntity.save();
      PaySchedule.findById(newEntity._id)
        .exec( async function (err, newEntity) {
          if (err) return reject(new Error('Unable to create Pay Schedule!'));
          await newEntity.save();
          resolve(newEntity);
      })};
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createPaySchedule;
