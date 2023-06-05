const Payroll = require('../../../models/payroll');
const generateAuditTrail = require('../../../utils/audit-trails');
const ObjectId = require('mongoose').Types.ObjectId;

const deletePayroll = (_, args,{ me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const sal = await Payroll.findOne({ $and: [{ month: args.payrolls[0].month }, { tenantid: ObjectId(tenantid) }] });
    if (!sal) {
      generateAuditTrail(null, null, me, tenantid, 'Payroll', 'Find Payroll', 'Delete', 'Failed', args, 'Payroll Does Not Exist!');
      reject(new Error('Payroll Does Not Exist!'));
    } else {
      Payroll.findOneAndDelete({ $and: [{ month: args.payrolls[0].month }, { tenantid }] }, async (err, Payroll) => {
        if(Payroll) {
          generateAuditTrail(null, null, me, tenantid, 'Payroll', 'Delete Payroll', 'Delete', 'Failed', args, 'Unable to Delete Payroll!');

          resolve(Payroll);
        }
        if(err || !Payroll) {
          generateAuditTrail(null, null, me, tenantid, 'Payroll', 'Delete Payroll', 'Delete', 'Failed', args, 'Unable to Delete Payroll!');
          reject(Error('Unable to Delete Payroll!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = deletePayroll;
