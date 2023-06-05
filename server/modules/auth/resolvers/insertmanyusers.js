const { UserInputError } = require('apollo-server-express')
const User = require('../../../models/user')
const Department = require('../../../models/departments');
const Designation = require('../../../models/designations');
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const SALT_ROUNDS = 12;
const moment = require('moment');

const insertManyUsers = (_, { input }, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
    await Promise.all(input.map(async delay => {
      await wait(delay)
      delay.password = await bcrypt.hash(delay.password?.toString() || '11', 10);
      delay.tenantid = tenantid;
      delay.dob && moment(delay.dob, "DD-MM-YYYY").isValid() ? (delay.dob = moment(delay.dob, "DD-MM-YYYY")): delay.dob = null;
      delay.doj && moment(delay.doj, "DD-MM-YYYY").isValid() ? (delay.doj = moment(delay.doj, "DD-MM-YYYY")): delay.doj = null;
      delay.dor && moment(delay.dor, "DD-MM-YYYY").isValid() ? (delay.dor = moment(delay.dor, "DD-MM-YYYY")): delay.dor = null;
      // if(delay.dept) { // IF you want Dynamic Masters
      //   const newDepartment = await new Department({
      //     ...{
      //       name: delay.dept,
      //       tenantid,
      //       audit: {
      //         created_at: new Date(),
      //         created_by: me?.user?.username
      //       }
      //     }
      //   });
      //   await newDepartment.save();
      // }
    }))

    User.insertMany(input)
      .then((res) => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });

  } catch (e) {
    reject(e)
  }


})


module.exports = insertManyUsers