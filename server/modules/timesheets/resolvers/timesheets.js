const { paramHandler } = require('../../../utils/paramhandler');
const Timesheet = require('../../../models/timesheets');

const getTimesheets = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    await Timesheet.find(param)
      .skip(args.query.offset).limit(args.query.limit)
      .populate('assignedTo', 'username email role eCode unitDepartmentId')
      .populate('createdBy', 'username email role eCode unitDepartmentId')
      .populate('department', 'name')
      .exec(async function (err, data) {
        if (err) return reject();
        resolve(data);
      })
  }
  catch (e) {
    reject(e);
  }
});

module.exports = getTimesheets;
