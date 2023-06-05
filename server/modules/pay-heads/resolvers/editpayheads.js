const PayHead = require('../../../models/payheads');
const generateAuditTrail = require('../../../utils/audit-trails');
const editPayHead = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await PayHead.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }, { _id: args._id, $and: [{ tenantid }] }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'PayHead', 'Find PayHead', 'Edit', 'Failed', args, 'PayHead Does Not Exist!');
      reject(new Error('PayHead Does Not Exist!'));
    } else {
      PayHead.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          tenantid,
          computedFormula: args.computedFormulaID,
          audit: {
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
          generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'PayHead', 'Edit PaySchedule', 'Edit', 'Success', args, 'PayHead Updated!');
          PayHead.findById(newEntity._id)
            .populate('computedFormula', ['name', '_id', 'formula'])
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update PayHead!'));
              await newEntity.save();
              resolve(newEntity);
            });
        } else {
          generateAuditTrail(null, null, me, tenantid, 'PayHead', 'Find PayHead', 'Edit', 'Failed', args, 'Unable to update PayHead!!');
          reject(new Error('Unable to update PayHead!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editPayHead;
