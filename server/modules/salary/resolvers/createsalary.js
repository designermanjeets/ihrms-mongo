const Salary = require('../../../models/salary');
const generateAuditTrail = require('../../../utils/audit-trails');
const createSalary = (_, args,{ me, tenantid }) => new Promise(async (resolve, reject) => {
  try {

    const salary = await Salary.findOne({ $and: [{ eCode: args.input.eCode}, { tenantid: { $eq: ObjectId(tenantid) } }] });
    if (salary) {
      generateAuditTrail(null, null, me, tenantid, 'Salary', 'Create Salary', 'Create', 'Failed', args, 'Salary already Exist!');
      reject(new Error('Salary already exist!'));
    } else {
      new Salary( {
        ...args,
        tenantid,
        department: args.departmentId,
        audit: {
          created_at: new Date(),
          created_by: me?.user?.username
        }
      }).save().then((item) => {
        if(item) {
          generateAuditTrail(null, item, me, tenantid, 'Salary', 'Create Salary', 'Create', 'Success', args, 'Salary Created!');
          resolve(item);
        } else {
          generateAuditTrail(null, null, me, tenantid, 'Salary', 'Create Salary', 'Create', 'Failed', args, 'Unable to create Salary!');
          reject(new Error('Unable to create Salary!'));
        }
      });
   }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createSalary;
