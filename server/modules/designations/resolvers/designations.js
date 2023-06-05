const Department = require('../../../models/departments');
const { paramHandler } = require('../../../utils/paramhandler');
const mongoose = require('mongoose');
const Designation = require('../../../models/designations');

const getDesignations = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    await Designation.find(param)
      .skip(args.query.offset).limit(args.query.limit)
      .populate('department', 'name')
      .populate('parentDesignation', 'name')
      .exec(async function (err, data) {
        if (err) return reject();
        resolve(data);
      })
  }
  catch (e) {
    reject(e);
  }
});

module.exports = getDesignations;
