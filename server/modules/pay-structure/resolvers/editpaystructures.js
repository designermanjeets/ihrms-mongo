const PayStructure = require('../../../models/paystructure');
 const generateAuditTrail = require('../../../utils/audit-trails');
const editPayStructure = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await PayStructure.findOne({ $or: [{ salaryStructure: args.salaryStructure, $and: [{ tenantid }] }, { _id: args._id, $and: [{ tenantid }] }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'PayStructure', 'Find PayStructure', 'Edit', 'Failed', args, 'PayStructure Does Not Exist!');
      reject(new Error('Pay Structure Does Not Exist!'));
    } else {
      PayStructure.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          payHeads: args.payHeadIDs,
          tenantid,
          audit: {
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
          generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'PayStructure', 'Edit PayStructure', 'Edit', 'Success', args, 'PayStructure updated!');
          PayStructure.findById(newEntity._id)
            .populate({ 
              path: 'payHeads', select: ['name', '_id'], 
              populate: { path: 'computedFormula', select: 'name formula _id',},
            })
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update Pay Structure!'));
              await newEntity.save();
              resolve(newEntity);
            });
        } else {
          generateAuditTrail(null, null, me, tenantid, 'PayStructure', 'Edit PayStructure', 'Edit', 'Failed', args, 'Unable to update Pay Structure!');
          reject(new Error('Unable to update Pay Structure!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editPayStructure;
