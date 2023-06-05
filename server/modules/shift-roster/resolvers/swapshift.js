const ShiftRoster = require('../../../models/shift-roster');
const Shift = require('../../../models/shifts');
const async = require('async');
const { paramHandler } = require('../../../utils/paramhandler');

const shiftSwapRequest = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {

  /*==============Return Type Schema was=================
    SwapShiftRostersTypes {
      _id
      action
      date
      department
      eCode
      fromShift
      fromUsereCode
      month
      name
      toShift
      toUserCode
    }
  /*===============But Now It's Void==============*/
  try {
    ShiftRoster.findOne(
      {
        $and: [
          { month: args.month },
          { tenantid },
          { department: args.department }
        ]
      },
      async (err, entity) => {
        if(entity) {
          const userFrom = entity.users.filter(en => en.eCode === args.fromUsereCode)[0];
          if(!userFrom) {
            return reject(new Error('User From Not Found!'));
          } else {
            userFrom.dateRange.forEach(date => {
              if(date.date === args.date) {
                const index = date.shifts.findIndex(sh => sh === args.fromShift);
                if(index === -1) {
                  return reject(new Error('Shift From Not Found!'));
                } else {
                  date.shifts[index] = args.toShift;
                }
              }
            });
          }
          if(args.action === 'swap') {
            const userTo = entity.users.filter(en => en.eCode === args.toUserCode)[0];
            if(!userTo) {
              return reject(new Error('User To Not Found!'));
            } else {
              userTo.dateRange.forEach(date => {
                if(date.date === args.date) {
                  const index = date.shifts.findIndex(sh => sh === args.toShift);
                  if(index === -1) {
                    return reject(new Error('Shift To Not Found!'));
                  } else {
                    date.shifts[index] = args.fromShift;
                  }
                }
              });
            }
          }
          await entity.save();
          resolve(entity);
        } else {
          reject(new Error('Unable to Update Shift Roster!'));
        }
      }
    );
  } catch (e) {
    reject(e);
  }
});


module.exports = shiftSwapRequest;
