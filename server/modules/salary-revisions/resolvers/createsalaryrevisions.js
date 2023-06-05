const SalaryRevisons = require('../../../models/salary-revisions');
const Salary = require('../../../models/salary');
const generateAuditTrail = require('../../../utils/audit-trails');
const createSalaryRevisons = (_, args,{ me, tenantid }) => new Promise(async (resolve, reject) => {
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

        const sal = await Salary.findOne({ $and: [{ _id: args._id }, { tenantid }] });
        if (!sal) {
          generateAuditTrail(null, null, me, tenantid, 'Salary', 'Find Salary', 'Edit', 'Failed', args, 'Salary Does Not Exist!');
          reject(new Error('Salary Does Not Exist!'));
        } else {
          Salary.findByIdAndUpdate(sal._id, {
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
              generateAuditTrail(null, null, me, tenantid, 'Salary', 'Find Salary', 'Edit', 'Failed', args, 'Unable to update Salary!');
              reject(Error('Unable to update Salary!'));
            }
          });
        }

      delete args._id;
      console.log(args)

      SalaryRevisons.create( {
        ...args,
        tenantid,
        department: args.departmentId,
       // effectiveDate : new Date(),
        audit: {
          created_at: new Date(),
          created_by: me?.user?.username
        }
      }).then((item) => {
        if(item) {
          generateAuditTrail(null, item, me, tenantid, 'Salary Revisions', 'Create Salary', 'Create', 'Success', args, 'Salary Revisons Created!');
          resolve(item);
        } else {
          generateAuditTrail(null, null, me, tenantid, 'Salary Revisions', 'Create Salary', 'Create', 'Failed', args, 'Unable to create Salary!');
          reject(new Error('Unable to create Salary Revisions!'));
        }
      });
  
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createSalaryRevisons;
