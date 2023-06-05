const { paramHandler } = require('../../../utils/paramhandler');
const Task = require('../../../models/tasks');

const getTasks = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    await Task.find(param)
      .skip(args.query.offset).limit(args.query.limit)
      .populate({ 
        path: 'user', select: ['email', 'username', 'role', 'eCode', 'designationId', 'unitDepartmentId'], 
        populate: { path: 'unitDepartment', select: 'name',},
      })
      .populate({ 
        path: 'user', select: ['email', 'username', 'role', 'eCode', 'designationId', 'unitDepartmentId'],
        populate: { path: 'designation', select: 'name' }
      }) 
      .populate('createdBy', ['eCode', 'username', 'title'])
      .exec(async function (err, data) {
        if (err) return reject();
        resolve(data);
      })
  }
  catch (e) {
    reject(e);
  }
});

module.exports = getTasks;
