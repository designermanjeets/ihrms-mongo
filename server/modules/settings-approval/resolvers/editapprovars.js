const Approvars = require('../../../models/approvars');
const User = require('../../../models/user');
const mongoose = require('mongoose');
const generateAuditTrail = require('../../../utils/audit-trails');
const editApprovar = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Approvars.find({ $or: [{ _id: args._id, $and: [{ tenantid }] }, { name: args.name, $and: [{ tenantid }] }] });
    if (!entity || !entity.length) {
      generateAuditTrail(null, null, me, tenantid, 'Approvars', 'Find Approvars', 'Edit','Failed',args, 'Approvars Request Does Not Exist');
      reject(new Error('Approvars Request Does Not Exist!'));
    } else {
      await Approvars.findByIdAndUpdate(entity._id,
        { $set: {
            ...args,
            tenantid,
            audit: {
              modified_at: new Date(),
              modified_by: me?.user?.username
            }
          }
        }, { new: true, useFindAndModify: false }, function (e, item) {
          if(item) {
            item.approvars.forEach(async (itemz, i) => {
              itemz.user = await User.findById( mongoose.Types.ObjectId(itemz._id), ['email', 'username', 'role']);
              if (i === (item.approvars.length - 1)) {
                generateAuditTrail(entity._id, item._doc, me, tenantid, 'Approvars', 'Find Approvars', 'Edit','Success',args, 'Approvars updated');
                await item.save();
                resolve(item);
              }
            })
          } else {
            generateAuditTrail(null, null, me, tenantid, 'Approvars', 'Find Approvars', 'Edit','Failed',args, 'Unable to update Approvars');
            reject(new Error('Unable to update Approvars!'));
          }
        }
      )
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editApprovar;
