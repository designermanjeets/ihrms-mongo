const ExpenseClaim = require('../../../models/expense-claims');
const mongoose = require('mongoose');

const createExpenseClaims = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await ExpenseClaim.findOne( 
      { 
        claimType: args.claimType,
        tenantid,
        date: new Date(args.date),
        userId: args.userId
      }
    );
    if (entity) {
      reject(new Error('Expense Claim already exist!'));
    } else {
      const newEntity = await new ExpenseClaim({
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
        reject(new Error('Unable to create Expense Claim!'));
      }
      await newEntity.save();
      ExpenseClaim.findById(newEntity._id)
        .populate(
          { 
            path: 'user', 
            select: ['email', 'username', 'eCode', 'role'], 
          }
        )
        .populate('toManager', ['eCode', 'username', 'title'])
        .exec( async function (err, newEntity) {
          if (err) return reject(new Error('Unable to create Expense Claim!'));
          resolve(newEntity);
        });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createExpenseClaims;
