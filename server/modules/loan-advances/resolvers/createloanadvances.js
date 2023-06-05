const LoanAdvance = require('../../../models/loan-advances');
const mongoose = require('mongoose');

const createLoanAdvances = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await LoanAdvance.findOne( 
      { 
        loanType: args.loanType,
        tenantid,
        date: new Date(args.date),
        userId: args.userId
      }
    );
    if (entity) {
      reject(new Error('Loan/Advance already exist!'));
    } else {
      const newEntity = await new LoanAdvance({
        ...{
          ...args,
          user: args.userId,
          toManager: args.toManagerID,
          tenantid,
          audit: {
            created_at: new Date(),
            created_by: me?.user?.username
          }
        }
      });
      if(!newEntity) {
        reject(new Error('Unable to create Loan/Advance!'));
      }
      await newEntity.save();
      LoanAdvance.findById(newEntity._id)
        .populate(
          { 
            path: 'user', 
            select: ['email', 'username', 'eCode', 'role'], 
          }
        )
        .populate('toManager', ['eCode', 'username', 'title'])
        .exec( async function (err, newEntity) {
          if (err) return reject(new Error('Unable to create Loan/Advance!'));
          resolve(newEntity);
        });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createLoanAdvances;
