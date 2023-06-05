const ExpenseClaim = require('../../../models/expense-claims');

const editExpenseClaims = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await ExpenseClaim.findOne( 
      { 
        _id: args._id,
        claimType: args.claimType,
        tenantid,
        userId: args.userId
      }
    );
    if (!entity) {
      reject(new Error('Expense Claim Does Not Exist!'));
    } else {
      ExpenseClaim.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          audit: {
            ...entity.audit,
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
          ExpenseClaim.findById(newEntity._id)
            .populate(
              { 
                path: 'user', 
                select: ['email', 'username', 'eCode', 'role'], 
              }
            )
            .populate('toManager', ['eCode', 'username', 'title'])
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update Expense Claim!'));
              resolve(newEntity);
            });
        } else {
          reject(new Error('Unable to update Expense Claim!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editExpenseClaims;
