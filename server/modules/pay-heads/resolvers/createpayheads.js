const PayHead = require('../../../models/payheads');
const User = require('../../../models/user');
const ObjectId = require('mongoose').Types.ObjectId;
generateAuditTrail = require('../../../utils/audit-trails');
const createPayHead = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await PayHead.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }] });
    if (entity) {
      generateAuditTrail(null, null, me, tenantid, 'PayHead', 'Find PayHead', 'Create', 'Failed', args, 'PayHead already Exist!');
      reject(new Error('PayHead already exist!'));
    } else {

      if(!ObjectId.isValid(args.computedFormulaID)) { delete args.computedFormulaID };

      const newEntity = await new PayHead({
        ...{
          ...args,
          tenantid,
          computedFormula: args.computedFormulaID,
          audit: {
            created_at: new Date(),
            created_by: me?.user?.username
          }
        }
      });
      if(!newEntity) {
        generateAuditTrail(null, null, me, tenantid, 'PayHead', 'Find PayHead', 'Create', 'Failed', args, 'Unable to create PayHead!');
        reject(new Error('Unable to create PayHead!'));
      }
      else {
        generateAuditTrail(null, null, me, tenantid, 'PayHead', 'Find PayHead', 'Create', 'Success', args, 'PayHead created!');
        await newEntity.save();
        PayHead.findById(newEntity._id)
          .populate('computedFormula', ['name', '_id', 'formula'])
          .exec( async function (err, newEntity) {
            if (err) return reject(new Error('Unable to create PayHead!'));
            await newEntity.save();
            resolve(newEntity);
          })
        };
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createPayHead;
