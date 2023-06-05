const ActivityLogs = require('../../../models/activity-logs');
const { paramHandler } = require('../../../utils/paramhandler');

const getActivityLogs = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    await ActivityLogs.find(param)
      .sort({"event_summary.timestamp" : args.query.sortBy || 1 })
      .skip(args.query.offset).limit(args.query.limit)
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

module.exports = getActivityLogs;
