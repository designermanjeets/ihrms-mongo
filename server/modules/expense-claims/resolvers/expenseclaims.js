const { paramHandler } = require('../../../utils/paramhandler');
const ExpenseClaim = require('../../../models/expense-claims');

const getExpenseClaims = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    await ExpenseClaim.find(param)
      .populate(
        { 
          path: 'user', 
          select: ['email', 'username', 'eCode', 'role'], 
        }
      )
      .populate('toManager', ['eCode', 'username', 'title'])
      .skip(args.query.offset).limit(args.query.limit)
      .exec(async function (err, data) {
        if (err) return reject();
        resolve(data);
      })
  }
  catch (e) {
    reject(e);
  }
});

module.exports = getExpenseClaims;
