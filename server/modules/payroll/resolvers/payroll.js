const Payroll = require('../../../models/payroll');
const { paramHandler } = require('../../../utils/paramhandler');

const getPayroll = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid});
  try {
    await Payroll.find(param)
      .skip(args.query.offset).limit(args.query.limit)
      .exec(async function (err, data) {
        if (err) return reject();
        if(param.eCode) {
          data[0].payrolls = data[0].payrolls.filter(pr => pr.eCode === param.eCode);
        }
        resolve(data);
      }
    )
  }
  catch (e) {
    reject(e);
  }
});

module.exports = getPayroll;
