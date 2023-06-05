const Department = require('../../../models/departments');
const { paramHandler } = require('../../../utils/paramhandler');

const getDepartments = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    await Department.find(param)
      .skip(args.query.offset).limit(args.query.limit)
      .populate('departmentLead', 'username email role eCode')
      .populate('parentDepartment', 'name')
      .populate('leaveTypes','id name')
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

module.exports = getDepartments;
