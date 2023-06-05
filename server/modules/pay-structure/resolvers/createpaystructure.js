const PayStructure = require('../../../models/paystructure');
const User = require('../../../models/user');
const generateAuditTrail = require('../../../utils/audit-trails');
const createPayStructure = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await PayStructure.findOne({ $or: [{ salaryStructure: args.salaryStructure, $and: [{ tenantid }] }] });
    if (entity) {
      generateAuditTrail(null, null, me, tenantid, 'Pay Structure', 'Find Pay Structure', 'Create','Failed',args, 'Pay Structure already exist!');
      reject(new Error('Pay Structure already exist!'));
    } else {    
      const newEntity = await new PayStructure({
        ...{
          ...args,
          payHeads: args.payHeadIDs,
          tenantid,
          audit: {
            created_at: new Date(),
            created_by: me?.user?.username
          }
        }
      });
      if(!newEntity) {
        generateAuditTrail(null, null, me, tenantid, 'Pay Structure', 'Create Pay Structure', 'Create','Failed', args, 'Unable to create Pay Structure!');
        reject(new Error('Unable to create Pay Structure!'));
      }
      else {
        await newEntity.save();
        generateAuditTrail(null, newEntity.doc, me, tenantid, 'Pay Structure', 'Create Pay Structure', 'Create','Success', args, ' Pay Structure created!');
        PayStructure.findById(newEntity._id)
          .populate({ 
            path: 'payHeads', select: ['name', '_id','calculationType'], 
            populate: { path: 'computedFormula', select: 'name formula _id'},
          })
        .exec( async function (err, paystructure) {
          if (!paystructure) return reject(err);
          await paystructure.save();
          resolve(paystructure);
        });
    }}}
      catch (e) {
    reject(e);
  }
});

module.exports = createPayStructure;
