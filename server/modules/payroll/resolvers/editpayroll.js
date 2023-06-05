const Payroll = require('../../../models/payroll');
const User = require('../../../models/user');
const ObjectId = require('mongoose').Types.ObjectId;
const Salary = require('../../../models/salary');

const generateAuditTrail = require('../../../utils/audit-trails');
const editPayroll = (_, args,{ me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const sal = await Payroll.findOne({ $and: [{ month: args.payrolls[0].month }, { tenantid }] });
    if (!sal) {
      generateAuditTrail(null, null, me, tenantid, 'Payroll', 'Find Payroll', 'Edit', 'Failed', args, 'Payroll Does Not Exist!');
      reject(new Error('Payroll Does Not Exist!'));
    } else {
      Payroll.findOne({ $and: [{ month: args.payrolls[0].month }, { tenantid: ObjectId(tenantid) }] }, async (err, Payroll) => {
        if(Payroll) {
          Payroll.payrolls?.forEach(payrol => {
            if(payrol.eCode === args.payrolls[0].eCode) {
              payrol.status = args.payrolls[0].status;
            }
          });

          const sal = await Salary.findOne({  $and: [{ _id: args.payrolls[0].salaryId }, { tenantid: ObjectId(tenantid) }]  })
          if(sal) {
            if(args.payrolls[0].status === 'Released') {
              sal.securityDeposit[0].currentEMI = sal.securityDeposit[0].currentEMI + 1;
              sal.securityDeposit[0].pendingAmount = sal.securityDeposit[0].pendingAmount - args.payrolls[0].Security_Deposit;
              sal.save();
            }
          }

          await Payroll.save();
          resolve(Payroll);
        }
        if(err || !Payroll) {
          generateAuditTrail(null, null, me, tenantid, 'Payroll', 'Find Payroll', 'Edit', 'Failed', args, 'Unable to update Payroll!');
          reject(Error('Unable to update Payroll!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editPayroll;
