const SalaryRevisons = require('../../../models/salary');
const generateAuditTrail = require('../../../utils/audit-trails');
const editSalaryRevisons = (_, args,{ me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    
    let totalSalary = 0;
    args.payHeads.forEach(async (k) => {
      if(k.name === 'CTC') { 
        eachUser.CTC = parseInt(k.value || 0)
      }
      if(k.name === 'GROSS') { 
        eachUser.GROSS = parseInt(k.value || 0)
      }
      k.name == 'Overtime' && (args.Overtime = parseInt(k.value || 0));
    });

    const sal = await SalaryRevisons.findOne({ $and: [{ _id: args._id }, { tenantid }] });
    if (!sal) {
      generateAuditTrail(null, null, me, tenantid, 'SalaryRevisons', 'Find SalaryRevisons', 'Edit', 'Failed', args, 'SalaryRevisons Does Not Exist!');
      reject(new Error('SalaryRevisons Does Not Exist!'));
    } else {
      SalaryRevisons.findByIdAndUpdate(sal._id, {
        $set: {
          Overtime: args.Overtime,
          CTC: args.CTC,
          payHeads: args.payHeads,
          audit: {
            ...sal.audit,
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, async (err, salary) => {
        if(salary) {
          await salary.save();
          resolve(salary);
        }
        if(err || !salary) {
          generateAuditTrail(null, null, me, tenantid, 'SalaryRevisons', 'Find SalaryRevisons', 'Edit', 'Failed', args, 'Unable to update SalaryRevisons!');
          reject(Error('Unable to update SalaryRevisons!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editSalaryRevisons;
