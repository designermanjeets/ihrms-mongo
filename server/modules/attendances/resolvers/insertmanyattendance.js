const { UserInputError } = require('apollo-server-express')
const Attendances = require('../../../models/attendances')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const SALT_ROUNDS = 12;

const insertManyAttendances = (_, { input },{ me, tenantid }) => new Promise(async (resolve, reject) => {

  try {
    input.forEach(async(u) => {
      u.tenantid = tenantid
    });

   Attendances.insertMany(input)  
    .then((res) => {
        resolve(res);
    })
    .catch(err => {
        reject(err);
    });

      } catch (e) {
        reject()
      }


})


module.exports = insertManyAttendances