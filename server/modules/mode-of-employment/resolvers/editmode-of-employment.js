const ModeOfEmployment = require('../../../models/mode-of-employment');
const generateAuditTrail = require('../../../utils/audit-trails');
const editModeOfEmployment = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await ModeOfEmployment.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }, { _id: args._id, $and: [{ tenantid }] }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'ModeOfEmployment', 'Find ModeOfEmployment', 'Edit','Failed',args, 'Mode Of Employment already exist!');
      reject(new Error('Mode Of Employment Does Not Exist!'));
    } else {
      ModeOfEmployment.findByIdAndUpdate(entity._id, {
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
          generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'ModeOfEmployment', 'Find ModeOfEmployment', 'Edit','Success',args, ' Mode Of Employment Updated!');
          ModeOfEmployment.findById(newEntity._id)
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update Mode Of Employment!'));
              await newEntity.save();
              resolve(newEntity);
            });
        } else {
          generateAuditTrail(null,null, me, tenantid, 'ModeOfEmployment', 'Find ModeOfEmployment', 'Edit','Failed',args, ' Unable to update Mode Of Employment!');
          reject(new Error('Unable to update Mode Of Employment!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editModeOfEmployment;
