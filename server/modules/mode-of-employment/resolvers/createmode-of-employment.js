const ModeOfEmployment = require('../../../models/mode-of-employment');
const generateAuditTrail = require('../../../utils/audit-trails');
const createModeOfEmployment = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await ModeOfEmployment.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }] });
    if (entity) {
      generateAuditTrail(null, null, me, tenantid, 'ModeOfEmployment', 'Find ModeOfEmployment', 'Create','Failed',args, 'Mode Of Employment already exist!');
      reject(new Error('Mode Of Employment already exist!'));
    } else {
      const newEntity = await new ModeOfEmployment({
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
        generateAuditTrail(null, null, me, tenantid, 'ModeOfEmployment', 'Find ModeOfEmployment', 'Create','Failed',args, 'Unable to create Mode Of Employment!');
        reject(Error('Unable to create Mode Of Employment!'));
      }else{
        generateAuditTrail(null, newEntity._doc, me, tenantid, 'ModeOfEmployment', 'Find ModeOfEmployment', 'Create','Success',args, 'Mode Of Employment Created!');
      await newEntity.save();
      ModeOfEmployment.findById(newEntity._id)
        .exec( async function (err, newEntity) {
          if (err) return reject(new Error('Unable to create Mode Of Employment!'));
          await newEntity.save();
          resolve(newEntity);
        })};
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createModeOfEmployment;
