const Formula = require('../../../models/payformula');
const generateAuditTrail = require('../../../utils/audit-trails');
const editPayFormula = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Formula.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }, { _id: args._id, $and: [{ tenantid }] }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'Pay Formula', 'Find Pay Formula', 'Edit', 'Failed', args, 'Formula Does Not Exist!');
      reject(new Error('Formula Does Not Exist!'));
    } else {
      Formula.findByIdAndUpdate(entity._id, {
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
          generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'Pay Formula', 'Find Pay Formula', 'Edit', 'Success', args, 'Formula updated!');
          Formula.findById(newEntity._id)
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update Formula!'));
              await newEntity.save();
              resolve(newEntity);
            });
        } else {
          generateAuditTrail(null, null, me, tenantid, 'Pay Formula', 'Find Pay Formula', 'Edit', 'Failed', args, 'Unable to update Formula!');
          reject(new Error('Unable to update Formula!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editPayFormula;
