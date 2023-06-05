const { paramHandler } = require('../../../utils/paramhandler');
const PayHead = require('../../../models/payheads');
const { request } = require('../../../utils/context')

const getPayHeads = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    await PayHead.find(param)
      .skip(args.query.offset).limit(args.query.limit)
      .populate('computedFormula', ['name', '_id', 'formula'])
      .exec(async function (err, data) {
        if (err) return reject();
        resolve(data);
      })
  }
  catch (e) {
    reject(e);
  }
});

module.exports = getPayHeads;
