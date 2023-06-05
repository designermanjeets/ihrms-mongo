const { paramHandler } = require('../../../utils/paramhandler');
const AttendanceRequest = require('../../../models/attendance-request');
const mongoose = require('mongoose');

const getAttendanceRequestsByDayWiseOverview = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    await AttendanceRequest.aggregate([
        {
            $match: { 
                $and: [
                    { 
                        startDate: { 
                            $gte: args.query.dates.gte ? new Date(args.query.dates.gte): new Date('July 20, 69 20:17:40 GMT+00:00'), 
                            $lt: args.query.dates.lt ? new Date(args.query.dates.lt): new Date()
                        }
                    },
                ]
             },
        },
        {
            $match: { 
                tenantid: { $eq:  mongoose.Types.ObjectId(tenantid) }
             },
        },
        {
            $group : {
                day: { $first: "$startDate"},
                date: { $first: "$startDate"},
                month: { $first: "$startDate"},
                _id:{
                    $dateToString:
                       {
                          format: "%Y-%m-%d",
                          date: "$startDate"
                       }
                },
                startDate: { $first:"$startDate" },
                endDate: { $first:"$endDate" },
                days: { $first:"$days" },
                attendanceType: { $first:"$attendanceType" },
                userId: { $first: "$userId" },
                toManagerID: { $first: "$toManagerID" },
                toManager: { $first: "$toManager" },
                comments: { $first: "$comments" },
                status: { $first: "$status" },
                created_at: { $first: "$audit.created_at" }
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
                totalAmount: 1,
                year : { $year : "$day" }, 
                week : { $week : "$day" },
                day: { $dayOfMonth: "$day" },
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
        {
            $lookup: {
                from: "LeaveRequests",
                localField: "startDate",
                foreignField: "startDate",
                as: "leaverequest_data"
            }
        },
        {
            $set: {
                leaveTypeID: { $arrayElemAt: ["$leaverequest_data.leaveTypeID", 0] },
            }
        },
        {
          $project: {
            leaverequest_data: 0,
          }
        },
        {
            $lookup: {
                from: "LeaveTypes",
                localField: "leaveTypeID",
                foreignField: "_id",
                as: "leavetype_data"
            }
        },
        {
            $set: {
                leaveTypeName: { $arrayElemAt: ["$leavetype_data.name", 0] },
                leaveTypeDays: { $arrayElemAt: ["$leavetype_data.days", 0] },
            }
        },
        {
          $project: {
            attendanceType: 1,
            leaveTypeName: 1,
            leavetype_data: 1,
          }
        },
        // {   
        //     $group: {
        //         _id: {
        //             "attendanceType": "$attendanceType",   
        //         },
        //         count: { $sum: 1 }
        //     }
        // },
    ])
    .exec(async function ( e, d ) {
        if (e) return reject(new Error(e));
        resolve(d)        
    });
  }
  catch (e) {
    reject(e);
  }
});

module.exports = getAttendanceRequestsByDayWiseOverview;
