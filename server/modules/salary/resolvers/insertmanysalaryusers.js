const Salary = require('../../../models/salary');
const User = require('../../../models/user');
const PayHead = require('../../../models/payheads');
const ObjectId = require('mongoose').Types.ObjectId;

const insertManySalaryUsers = (_, { input }, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

    await Promise.all(input.map(async eachUser => {

      await wait(eachUser)

      eachUser.effectiveDate = new Date(),
      eachUser.month = new Date(),
      eachUser.tenantid = tenantid;
      eachUser.department = eachUser.departmentId;
      await eachUser.payHeads.forEach(async (k) => {
        if(k.name === 'CTC') { 
          eachUser.CTC = parseInt(k.value || 0)
        }
        if(k.name === 'GROSS') { 
          eachUser.GROSS = parseInt(k.value || 0)
        }
        k.name == 'Overtime' && (eachUser.Overtime = parseInt(k.value || 0));
        if(k.name === 'SECURITY DEPOSIT') { 
          if(!eachUser.securityDeposit) {
            eachUser['securityDeposit'] = [];
          }
          eachUser.securityDeposit.push({
            currCTC: k.value,
            payHead: k._id,
            payHeadID: k._id,
            securityAmount: k.value,
            pendingAmount: k.value,
            monthStart: k.startDate,
            EMITenure: 4,
            currentEMI: 0,
          });
        }
      });

    }));

    input.forEach(object => delete object['_id']);

    Salary.insertMany(input)
      .then((res) => {
        if(res) {
          res.forEach(async (eachSalary) => {
            const user = await User.findOne({ $and: [{ eCode: eachSalary.eCode }, { tenantid }] });
            if(user) {
              user.salary = eachSalary._id;
              user.salaryId = eachSalary._id;
              user.save();
            }
          });
        };
        resolve(res);
      })
      .catch(err => reject(err));
  } catch (e) {
    reject(e)
  }
})


module.exports = insertManySalaryUsers