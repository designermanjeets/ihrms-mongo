const Role = require('../../../models/role');
const { paramHandler } = require('../../../utils/paramhandler');

const getRoles = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid});
  Role.find(param,(err, result) => {
    if (err) reject(err);
    else {
      if(me?.user?.username !== 'gonngod') {
        result = result.filter(res => res.role_name !== 'GONNGOD');
      }
      resolve(result);
    }
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = getRoles;
