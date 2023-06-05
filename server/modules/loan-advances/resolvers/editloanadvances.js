const LoanAdvance = require('../../../models/loan-advances');

const editLoanAdvances = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await LoanAdvance.findOne( 
      { 
        _id: args._id,
        loanType: args.loanType,
        tenantid,
        userId: args.userId
      }
    );
    if (!entity) {
      reject(new Error('Loan/Advance Does Not Exist!'));
    } else {
      LoanAdvance.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          user: args.userId,
          toManager: args.toManagerID,
          tenantid,
          audit: {
            ...entity.audit,
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
          LoanAdvance.findById(newEntity._id)
            .populate(
              { 
                path: 'user', 
                select: ['email', 'username', 'eCode', 'role'], 
              }
            )
            .populate('toManager', ['eCode', 'username', 'title'])
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update Loan/Advance!'));
              resolve(newEntity);
            });
        } else {
          reject(new Error('Unable to update Loan/Advance!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editLoanAdvances;
