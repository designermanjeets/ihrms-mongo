const { paramHandler } = require('../../../utils/paramhandler');
const Tenants = require('../../../models/tenants');
const User = require('../../../models/user');
const { request } = require('../../../utils/context')
const mongoose = require('mongoose');

const getTenants = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = paramHandler({...args.query}) // tenantid
  try {
     await Tenants.find(param)
       .skip(args.query.offset).limit(args.query.limit)
       .exec(async function (err, data) {
         if (err) return reject();
         if(me?.user?.username == 'gonngod') {
          data = data.filter(res => res.name !== 'GONN');
        }else{
          const tenants_access = await User.findOne({username: me?.user?.username,});
          // if(tenants_access) {
          //   const dataz = await Tenants.find({ '_id': { $in: tenants_access.tenantAccess } });
          //   if(dataz) {
          //     resolve(dataz);
          //   } else {
          //     resolve(data);
          //   }
          // }
       }
       resolve(data);
       
      })

  }
  catch (e) {
    reject(e);
  }
});

module.exports = getTenants;
