const Approvars = require('../../../models/approvars');
const User = require('../../../models/user');
const mongoose = require('mongoose');
const generateAuditTrail = require('../../../utils/audit-trails');
const createApprovar = (_, args, { me, secret }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Approvars.find({ $or: [{ name: args.name, $and: [{ tenantid }] }] });
    if (entity && entity.length) {
      generateAuditTrail(null, null, me, tenantid, 'Approvars', 'Find Approvars', 'Create','Failed',args, 'Approvars Request already exist');
      reject(new Error('Approvars Request already exist!'));
    } else {
      await new Approvars({
        ...args,
        tenantid,
        audit: {
          created_at: new Date(),
          created_by: me?.user?.username
        }
      }).save().then((item) => {
        if(item) {
          item.approvars.forEach(async (itemz, i) => {
            itemz.user = await User.findById( mongoose.Types.ObjectId(itemz._id), ['email', 'username', 'role']);
            if (i === (item.approvars.length - 1)) {
              await item.save();
              generateAuditTrail(null, item._doc, me, tenantid, 'Approvars', 'Find Approvars', 'Create','Failed',args, ' Approvars created');
              resolve(item);
            }
          })
        } else {
          generateAuditTrail(null, null, me, tenantid, 'Approvars', 'Find Approvars', 'Create','Failed',args, 'Unable to create Approvars');
          reject(new Error('Unable to create Approvars!'));
        }
      })
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createApprovar;
