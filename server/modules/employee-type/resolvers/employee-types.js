const { paramHandler } = require('../../../utils/paramhandler');
const EmployeeType = require('../../../models/employee-types');

const getEmployeeTypes = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    await EmployeeType.find(param)
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

module.exports = getEmployeeTypes;
