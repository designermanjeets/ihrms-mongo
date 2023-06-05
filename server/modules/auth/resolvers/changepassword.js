const User = require('../../../models/user');
const bcrypt = require('bcrypt')

const changePassword = (_, { username, eCode, oldPassword, newPassword }, { me, secret, tenantid } ) => new Promise(async (resolve, reject) => {
  try{
    const getuser = await User.findOne({ $or: [{ eCode: eCode }] }); //, $and: [{ tenantid }]
    if(getuser && getuser.username !== 'gonngod') {
      const validOld = await bcrypt.compare(oldPassword, getuser.password);
      const validNew = newPassword !== oldPassword;
      if(validOld) {
        if(validNew) {
            const new_password= await bcrypt.hash(newPassword, 10);
            const user = await User.findOneAndUpdate({ $or: [{ eCode: eCode }] }, //, $and: [{ tenantid }] 
                { $set: { password: new_password } },
                { new: true, useFindAndModify: false },
            );
            if(user) {
                user.save();
                resolve({user});
            }
        } else {
          reject(new Error('New Password should not be same as Old Password!'))
        }
      } else {
        reject(new Error('Incorrect Old Password!'))
      }
    } else {
      reject(new Error('No User Found!'))
    }
  } catch(error){
    reject(error);
  }
});

module.exports = changePassword;