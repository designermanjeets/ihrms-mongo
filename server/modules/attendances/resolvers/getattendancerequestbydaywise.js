const { paramHandler } = require('../../../utils/paramhandler');
const AttendanceRequest = require('../../../models/attendance-request');
const mongoose = require('mongoose');

const getAttendanceRequestsByDayWise = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    await AttendanceRequest.aggregate([
        { $match: 
            { $expr : 
                { 
                    $and: [
                        { tenantid: mongoose.Types.ObjectId(tenantid) },
                        { $eq: [ '$userId' , { $toObjectId: args.query.userID } ] }
                    ]
                } 
            }
        },
        {
            $group : {
                _id:{
                    $dateToString:
                       {
                          format: "%Y-%m-%d",
                          date: "$date"
                       }
                },
                startDate: { $first:"$startDate" },
                endDate: { $first:"$endDate" },
                days: { $first:"$days" },
                attendanceType: { $first:"$attendanceType" },
                toManagerID: { $first: "$toManagerID" },
                toManager: { $first: "$toManager" },
                comments: { $first: "$comments" },
                status: { $first: "$status" },
                created_at: { $first: "$audit.created_at" },
            }
        },
        {
            $project: {
                _id: 1,
                date: 1,
                userId: 1,
                startDate: 1,
                endDate: 1,
                days: 1,
                toManager: 1,
                toManagerID: 1,
                status: 1,
                created_at: 1,
                attendanceType: 1,
                 
            }
        },
        {
            $lookup: {
                from: "Users",
                localField: "toManagerID",
                foreignField: "_id",
                as: "manager_data"
            }
        },
        {
            $set: {
                manager_username: { $arrayElemAt: ["$manager_data.username", 0] },
            }
        },
        {
          $project: {
            manager_data: 0
          }
        },
    ])
    .exec(async function ( e, d ) {
        if (e) return reject(new Error('Unable to Fetch Recent Attendance Request!'));
        resolve(d)        
    });
  }
  catch (e) {
    reject(e);
  }
});

module.exports = getAttendanceRequestsByDayWise;
