const SalaryRevisons = require('../../../models/salary-revisions');
const { paramHandler } = require('../../../utils/paramhandler');

const getSalaryRevisions = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid});
  try {
    await SalaryRevisons.find(param)
      .skip(args.query.offset).limit(args.query.limit)
      .populate('department', 'name')
      .populate('payHeads', '_id name value payhead_type calculationType')
      .exec(async function (err, data) {
        if (err) return reject();
        resolve(data);
      }
    )
  }
  catch (e) {
    reject(e);
  }
});

module.exports = getSalaryRevisions;
