const AttendanceSQL = require('../../../models/attendance-sql');
const Attendances = require('../../../models/attendances');
const Users = require('../../../models/user');

const insertManyAttendanceSQL = (_, { input }, { me, tenantid }) => new Promise(async (resolve, reject) => {

  try {
    await input.forEach(async (u, idx) => {
      u.tenantid = tenantid;
      const user = await Users.findOne({ eCode: u.eCode });
      if (user) {
        u.userId = user._id;
        u.user = user._id;
        input[idx].userId = user._id;
        input[idx].user = user._id;
      }
    });

    try {
      AttendanceSQL.insertMany(input, { ordered: false }) //, w: "majority", wtimeout: 100
        .then(async (res) => {
          input.forEach((wr, idx) => { 
            delete wr._id;
            input[idx].user = wr.user.toString();
            input[idx].userId = wr.userId.toString();
          })
          await Attendances.insertMany(input, { ordered: false });
          resolve(res);
        })
        .catch(async (err) => {

          let writeErrorsIds = [];
          insertedOnly = err.writeErrors.forEach(wr => writeErrorsIds.push(wr['err'].op._id));

          let insertedIdsOnly = [];
          for (let x in err.insertedIds) { insertedIdsOnly.push(err.insertedIds[x]) }
          const insertedDiff = insertedIdsOnly.filter(x => !writeErrorsIds.includes(x));

          let toBeInserted = [];
          input.forEach(wr => { if(insertedDiff.includes(wr._id)) { delete wr._id; toBeInserted.push(wr) } })

          await Attendances.insertMany(toBeInserted, { ordered: false });
          reject(err);
        });
    } catch (e) {
      // print(e);
      reject(err);
    }
  } catch (e) {
    reject(e);
  }


})


module.exports = insertManyAttendanceSQL