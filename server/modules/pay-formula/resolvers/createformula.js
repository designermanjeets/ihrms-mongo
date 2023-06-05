const Formula = require('../../../models/payformula');
const generateAuditTrail = require('../../../utils/audit-trails');
const createPayFormula = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Formula.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }] });
    if (entity) {
      generateAuditTrail(null, null, me, tenantid, 'Pay Formula', 'Create Pay Formula', 'Create', 'Failed', args, 'Formula already Exist!');
      reject(new Error('Formula already exist!'));
    } else {
      const newEntity = await new Formula({
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
        generateAuditTrail(null, null, me, tenantid, 'Pay Formula', 'Create PayFormula', 'Create', 'Failed', args, 'Unable to Create Formula!');
        reject(new Error('Unable to create Formula!'));
      }else{
        generateAuditTrail(null, newEntity._doc, me, tenantid, 'Pay Formula', 'Create PayFormula', 'Create', 'Success', args, 'Formula Created!');
      await newEntity.save();
      Formula.findById(newEntity._id)
        .exec( async function (err, newEntity) {
          if (err) return reject(new Error('Unable to create Formula!'));
          await newEntity.save();
          resolve(newEntity);
        })};
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createPayFormula;
