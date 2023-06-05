const { paramHandler } = require('../../../utils/paramhandler');
const Users = require('../../../models/user');
const mongoose = require('mongoose');

const getOvertimeMonthWise = async (_, args, { me, tenantid }) =>
  new Promise(async (resolve, reject) => {
    const param =
      me?.user?.username === 'gonngod'
        ? paramHandler({ ...args.query })
        : paramHandler({ ...args.query, tenantid });
    try {
      let aggregation = [];
      const dateStart = new Date(
        args.query?.dates?.gte || 'July 20, 69 00:00:00 GMT+00:00'
      );
      const dateEnd = args.query?.dates?.lt
        ? new Date(args.query?.dates?.lt)
        : new Date(+new Date().setUTCHours(0, 0, 0, 0) + 86400000);

      if (args.query?.eCode) {
        aggregation.push({
          $match: {
            eCode: {
              $eq: args.query?.eCode,
            },
          },
        });
      }

      await Users.aggregate(
        aggregation.concat([
          {
            $lookup: {
              from: 'Attendances',
              localField: '_id',
              foreignField: 'userId',
              as: 'attendances',
              pipeline: [
                {
                  $match: {
                    $and: [
                      {
                        date: {
                          $lt: dateEnd,
                          $gte: dateStart,
                        },
                      },
                      { tenantid: mongoose.Types.ObjectId(tenantid) }
                    ]
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              day_diff: {
                $divide: [
                  {
                    $subtract: [dateEnd, dateStart],
                  },
                  86400000,
                ],
              },
            },
          },
          {
            $project: {
              userId: '$_id',
              title: true,
              name: true,
              surname: true,
              gender: true,
              username: true,
              eCode: true,
              overtime: true,
              attendances: '$attendances',
              day_diff: '$day_diff',
              dates_in_between: {
                $map: {
                  input: {
                    $range: [
                      0,
                      {
                        $toInt: {
                          $add: ['$day_diff', 0],
                        },
                      },
                    ],
                  },
                  as: 'dd',
                  in: {
                    $add: [
                      dateStart,
                      {
                        $multiply: ['$$dd', 86400000],
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            $unwind: {
              path: '$dates_in_between',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: true,
              userId: true,
              username: true,
              eCode: true,
              title: true,
              name: true,
              surname: true,
              gender: true,
              overtime: true,
              day_diff: true,
              date: '$dates_in_between',
              attendances: {
                $filter: {
                  input: '$attendances',
                  as: 'd',
                  cond: {
                    $and: [
                      {
                        $gte: ['$$d.date', '$dates_in_between'],
                      },
                      {
                        $lt: [
                          '$$d.date',
                          {
                            $dateAdd: {
                              startDate: '$dates_in_between',
                              unit: 'day',
                              amount: 1,
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            $addFields: {
              absent: {
                $cond: {
                  if: {
                    $eq: [0, { $size: '$attendances' }],
                  },
                  then: 1,
                  else: 0,
                },
              },
              month: {
                $dateToString: {
                  date: '$date',
                  format: '%Y-%m-01T00:00:00.000Z',
                },
              },
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
          {
            $group: {
              _id: {
                _id: '$userId',
                date: {
                  $dateToString: { format: '%Y-%m-%d', date: '$date' },
                },
              },
              fullDate: {
                $first: '$date',
              },
              userId: {
                $first: '$userId',
              },
              eCode: {
                $first: '$eCode',
              },
              username: {
                $first: '$username',
              },
              title: {
                $first: '$title',
              },
              name: {
                $first: '$name',
              },
              surname: {
                $first: '$surname',
              },
              gender: {
                $first: '$gender',
              },
              isOvertimeAllowed: {
                $first: '$overtime',
              },
              date: {
                $first: '$date',
              },
              month: {
                $first: '$month',
              },
              absent: {
                $sum: '$absent',
              },
              attendances: {
                $first: '$attendances',
              },
              day_diff: {
                $first: "$day_diff"
              }
            },
          },
          {
            $sort: {
              '_id.date': 1,
            },
          },
          {
            $project: {
              userId: true,
              absent: true,
              date: '$_id.date',
              fullDate: true,
              month: true,
              username: true,
              eCode: true,
              title: true,
              name: true,
              surname: true,
              gender: true,
              isOvertimeAllowed: true,
              inTime: {
                $ifNull: [
                  {
                    $min: '$attendances.inTime',
                  },
                  null,
                ],
              },
              outTime: {
                $ifNull: [
                  {
                    $max: '$attendances.outTime',
                  },
                  null,
                ],
              },
              swipes: {
                $map: {
                  input: '$attendances',
                  as: 'a',
                  in: {
                    punchIn: '$$a.inTime',
                    punchOut: '$$a.outTime',
                  },
                },
              },
              day_diff: true
            },
          },
          {
            $lookup: {
              from: 'ShiftRosters',
              localField: 'month',
              foreignField: 'month',
              as: 'shifts',
              pipeline: [
                {
                  $match: {
                    $and: [
                      { tenantid: mongoose.Types.ObjectId(tenantid) }
                    ]
                  },
                },
                {
                  $project: {
                    _id: true,
                    month: true,
                    users: true,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              shift_users: { $first: '$shifts.users' },
            },
          },
          {
            $project: {
              userId: true,
              username: true,
              eCode: true,
              title: true,
              name: true,
              surname: true,
              gender: true,
              isOvertimeAllowed: true,
              date: '$_id.date',
              month: true,
              absent: true,
              punchIn: {
                $ifNull: [
                  {
                    $dateToString: {
                      format: '%H:%M',
                      date: {
                        $min: '$inTime',
                      },
                    },
                  },
                  null,
                ],
              },
              punchOut: {
                $ifNull: [
                  {
                    $dateToString: {
                      format: '%H:%M',
                      date: {
                        $max: '$outTime',
                      },
                    },
                  },
                  null,
                ],
              },
              totalDays :{
                $cond: {
                  if: {
                    $ne: ['$absent', 0],
                  },
                  then: 0,
                  else: {
                    $add: [
                      "$absent",
                      1,
                    ],
                  },
                },
              },
              totalHours: {
                $cond: {
                  if: {
                    $ne: ['$absent', 0],
                  },
                  then: 0,
                  else: {
                    $divide: [
                      {
                        $dateDiff: {
                          startDate: '$inTime',
                          endDate: '$outTime',
                          unit: 'minute',
                        },
                      },
                      60,
                    ],
                  },
                },
              },
              swipes: true,
              roster: {
                $ifNull: [
                  {
                    $first: {
                      $map: {
                        input: {
                          $filter: {
                            input: '$shift_users',
                            cond: {
                              $eq: ['$$this.eCode', '$eCode'],
                            },
                          },
                        },
                        as: 'su',
                        in: {
                          $first: {
                            $filter: {
                              input: '$$su.dateRange',
                              cond: {
                                $eq: [
                                  '$$this.date',
                                  {
                                    $dateToString: {
                                      date: '$fullDate',
                                      format: '%Y-%m-%dT00:00:00.000Z',
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  null,
                ],
              },
              day_diff: true
            },
          },
          {
            $project: {
              userId: true,
              username: true,
              eCode: true,
              title: true,
              name: true,
              surname: true,
              gender: true,
              isOvertimeAllowed: true,
              date: true,
              month: true,
              absent: true,
              shiftName: { $first: '$roster.shifts' },
              punchIn: true,
              punchOut: true,
              totalHours: true,
              totalDays: true,
              swipes: true,
              roster: true,
              day_diff: true,
              year : { $year : { $toDate: "$date" } }, 
              week : { $week : { $toDate: "$date" } },
              day: { $dayOfMonth: { $toDate: "$date" } },
            },
          },
          {
            $lookup: {
              from: 'Shifts',
              localField: 'shiftName',
              foreignField: 'code',
              as: 'shifts',
            },
          },
          {
            $project: {
              userId: true,
              username: true,
              eCode: true,
              title: true,
              name: true,
              surname: true,
              gender: true,
              isOvertimeAllowed: true,
              date: true,
              month: true,
              absent: true,
              shiftName: true,
              punchIn: true,
              punchOut: true,
              totalHours: true,
              totalDays: true,
              shiftMinHours: {
                $arrayElemAt: ['$shifts.workingHours.minimumHoursRequired', 0],
              },
              overtime: {
                $cond: {
                  if: {
                    $lt: ['$totalHours', {
                      $arrayElemAt: [ '$shifts.workingHours.minimumHoursRequired', 0, ],
                    }],
                  },
                  then: 0,
                  else: {
                    $cond: [
                      { $arrayElemAt: [ '$shifts.payDays.carryOverBalanceHoursInOvertimeReport', 0, ], },
                      {
                        $cond: [
                          '$isOvertimeAllowed',
                          {
                            $subtract: [
                              '$totalHours',
                              {
                                $arrayElemAt: [ '$shifts.workingHours.minimumHoursRequired', 0, ],
                              },
                            ],
                          },
                          0
                        ]
                      },
                      0
                    ],
                  },
                },
              },
              shiftDefaultTimeFrom: {
                $ifNull: [
                  {
                    $arrayElemAt: ['$shifts.general.defaultTimeFrom', 0],
                  },
                  '00:00',
                ],
              },
              earlyOrLateMinutes: {
                $dateDiff: {
                  startDate: {
                    $dateFromString: {
                      dateString: {
                        $concat: [
                          '1970-01-01T',
                          {
                            $substr: [
                              {
                                $ifNull: [
                                  {
                                    $arrayElemAt: [
                                      '$shifts.general.defaultTimeFrom',
                                      0,
                                    ],
                                  },
                                  '00:00',
                                ],
                              },
                              0,
                              5,
                            ],
                          },
                          ':00.000',
                        ],
                      },
                    },
                  },
                  endDate: {
                    $dateFromString: {
                      dateString: {
                        $concat: [
                          '1970-01-01T',
                          {
                            $substr: [{ $ifNull: ['$punchIn', '00:00'] }, 0, 5],
                          },
                          ':00.000',
                        ],
                      },
                    },
                  },
                  unit: 'minute',
                },
              },
              swipes: true,
              roster: true,
              day_diff: true,
              shift: { $first: '$shifts' },
              year : true, 
              week : true,
              day: true,
            },
          },
          {
            $lookup: {
              from: 'Salary',
              localField: 'eCode',
              foreignField: 'eCode',
              as: 'user_salary',
            },
          },
          {   
              $group : {
                  _id : "$eCode",
                  eCode: {  $first: "$eCode" },
                  username:{  $first: "$username" },
                  totalDaysAbsent:{ $sum: "$absent" },
                  day_diff: {
                    $first: "$day_diff"
                  },
                  salaryId: { $first: { $arrayElemAt: [ '$user_salary._id', 0 ] } },
                  user_salary: {
                    $first: { $arrayElemAt: [ '$user_salary.CTC', 0 ] },
                  },
                  user_overtime: {
                    $first: { $arrayElemAt: [ '$user_salary.Overtime', 0 ] },
                  },
                  total_overtime_done_by_user: { $sum: "$overtime" },
                  year : {  $first: "$year" }, 
                  week : {  $first: "$week" },
                  day: {  $first: "$day" },
              }
          },
          {
             $addFields:{
               totalDaysPresent: { $subtract: ["$day_diff", "$totalDaysAbsent"] },
               user_range_salary: {
                 $round: {
                  $sum: [
                    {
                      $multiply: [
                        "$user_overtime",
                        "$total_overtime_done_by_user"
                      ]
                    },
                    {
                      $multiply: [
                        {
                          $subtract: ["$day_diff", "$totalDaysAbsent"]
                        },
                        {
                          $divide: [
                            "$user_salary",
                            "$day_diff"
                           ]
                        }
                       ]
                    }
                   ]
                 }
               },
               status: "Pending"
             }
          },
        {   
            $group : {
                _id : {
                    year : "$year",                      
                    month : "$month",                      
                    week : "$week"
                },
                totalOvertimeHours:{ $sum: "$total_overtime_done_by_user" }, 
            }
        }
      ])
      ).option({ allowDiskUse: true }).exec(async function (e, d) {
        if (e) return reject(new Error(e));
        if(me?.user?.username !== 'gonngod') {
          d = d.filter(res => res.username !== 'gonngod');
        }
         resolve(d);
      });
    } catch (e) {
      reject(e);
    }

  });

module.exports = getOvertimeMonthWise;
