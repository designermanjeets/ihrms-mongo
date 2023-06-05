const Payroll = require('../../../models/payroll');
const generateAuditTrail = require('../../../utils/audit-trails');
const createPayroll = (_, args,{ me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const payrol = await Payroll.findOne({ $or: [{ month: args.month, $and: [{ tenantid }] }] });
    if (payrol) {
      generateAuditTrail(null, null, me, tenantid, 'Payroll', 'Create Payroll', 'Create', 'Failed', args, 'Payroll already Generated!');
      reject(new Error('Payroll already Generated!'));
    } else {
      new Payroll({
        ...args,
        tenantid,
        audit: {
          created_at: new Date(),
          created_by: me?.user?.username
        }
      }).save().then((item) => {
        if(item) {
          generateAuditTrail(null, item, me, tenantid, 'Payroll', 'Create Payroll', 'Create', 'Success', args, 'Payroll Created!');
          resolve(item);
        } else {
          generateAuditTrail(null, null, me, tenantid, 'Payroll', 'Create Payroll', 'Create', 'Failed', args, 'Unable to create Payroll!');
          reject(new Error('Unable to create Payroll!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createPayroll;
