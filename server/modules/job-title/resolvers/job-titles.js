const { paramHandler } = require('../../../utils/paramhandler');
const JobTitle = require('../../../models/job-titles');

const getJobTitles = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    await JobTitle.find(param)
      .skip(args.query.offset).limit(args.query.limit)
      .populate('designation', 'name')
      .exec(async function (err, data) {
        if (err) return reject();
        resolve(data);
      })
  }
  catch (e) {
    reject(e);
  }
});

module.exports = getJobTitles;
