const Salary = require('../../../models/salary');
const User = require('../../../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

const generateAuditTrail = require('../../../utils/audit-trails');
const editSalary = (_, args,{ me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const sal = await Salary.findOne({ $and: [{ _id: args._id }, { tenantid }] });
    if (!sal) {
      generateAuditTrail(null, null, me, tenantid, 'Salary', 'Find Salary', 'Edit', 'Failed', args, 'Salary Does Not Exist!');
      reject(new Error('Salary Does Not Exist!'));
    } else {
      Salary.findByIdAndUpdate(sal._id, {
        $set: {
          payHeads: args.payHeads,
          audit: {
            ...sal.audit,
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, async (err, salary) => {
        if(salary) {
        await salary.payHeads.forEach(async (k) => {
          if(k.name === 'CTC') { 
            salary.CTC = parseInt(k.value || 0)
          }
          if(k.name === 'GROSS') { 
            salary.GROSS = parseInt(k.value || 0)
          }
          k.name == 'Overtime' && (salary.Overtime = parseInt(k.value || 0));
          if(k.name === 'SECURITY DEPOSIT') { 
            // if(!salary.securityDeposit) {
            //   salary['securityDeposit'] = [];
            // }
            // salary.securityDeposit.push({
            //   currCTC: k.value,
            //   payHead: k._id,
            //   payHeadID: k._id,
            //   securityAmount: k.value,
            //   pendingAmount: k.value,
            //   monthStart: k.startDate,
            //   EMITenure: 4,
            //   currentEMI: 0,
            // });
          }
        });

          await salary.save();
          resolve(salary);
        }
        if(err || !salary) {
          generateAuditTrail(null, null, me, tenantid, 'Salary', 'Find Salary', 'Edit', 'Failed', args, 'Unable to update Salary!');
          reject(Error('Unable to update Salary!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editSalary;
