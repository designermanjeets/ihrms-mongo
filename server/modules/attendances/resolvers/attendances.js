const { paramHandler } = require('../../../utils/paramhandler');
const Attendance = require('../../../models/attendances');

const getAttendances = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    await Attendance.find(param)
      // .skip(args.query.offset).limit(args.query.limit)
      .populate('user', 'eCode username email role')
      .exec(async function (err, data) {
        if (err) return reject();
        if(args.query.sortBy) {
          let sorted = [];
          if(args.query.sortBy === "-1") {
            sorted = data.sort(function(a, b) {
              var keyA = new Date(a.date),
                  keyB = new Date(b.date);
              // Compare the 2 dates
              if (keyA < keyB) return 1;
              if (keyA > keyB) return -1;
              return 0;
            });
            resolve(sorted.slice(0, args.query.limit));
          }
          if(args.query.sortBy === "1") {
            sorted = data.sort(function(a, b) {
              var keyA = new Date(a.date),
                  keyB = new Date(b.date);
              // Compare the 2 dates
              if (keyA < keyB) return -1;
              if (keyA > keyB) return 1;
              return 0;
            });
            resolve(sorted.slice(0, args.query.limit));
          }
        } else {
          resolve(data.slice(0, args.query.limit));
        }
      })
  }
  catch (e) {
    reject(e);
  }
});

module.exports = getAttendances;
