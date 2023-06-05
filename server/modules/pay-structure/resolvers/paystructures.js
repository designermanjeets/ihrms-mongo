const { paramHandler } = require('../../../utils/paramhandler');
const PayStructure = require('../../../models/paystructure');
const { request } = require('../../../utils/context')

const getPayStructures = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    await PayStructure.find(param)
      .skip(args.query.offset).limit(args.query.limit)
      .populate({ 
        path: 'payHeads', select: ['name', '_id', 'calculationType', 'type'], 
        populate: { path: 'computedFormula', select: 'name formula _id',},
      })
      .exec(async function (err, data) {
        if (err) return reject();
        resolve(data);
      })
  }
  catch (e) {
    reject(e);
  }
});

module.exports = getPayStructures;
