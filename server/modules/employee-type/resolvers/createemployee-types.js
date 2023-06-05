const EmployeeType = require('../../../models/employee-types');
const generateAuditTrail = require('../../../utils/audit-trails');
const createEmployeeType = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await EmployeeType.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }] });
    if (entity) {
      generateAuditTrail(null, null, me, tenantid, 'EmployeeType ', 'Create EmployeeType ', 'Create', 'Failed', args, 'EmployeeType already exist');
      throw(new Error('EmployeeType already exist!'));
    } else {
      const newEntity = await new EmployeeType({
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
        generateAuditTrail(null, null, me, tenantid, 'EmployeeType ', 'Create EmployeeType ', 'Create', 'Failed', args, 'Unable to create EmployeeType');
        reject(new Error('Unable to create EmployeeType!'));
      }else{
      generateAuditTrail(null, newEntity.doc, me, tenantid, 'EmployeeType', 'Create EmployeeType', 'Create', 'Success', args,'EmployeeType created!');
      await newEntity.save();
      EmployeeType.findById(newEntity._id)
        .exec( async function (err, newEntity) {
          if (err) return reject(new Error('Unable to create EmployeeType!'));
          await newEntity.save();
          resolve(newEntity);
        })};
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createEmployeeType;
