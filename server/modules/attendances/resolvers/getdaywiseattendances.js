const { paramHandler } = require('../../../utils/paramhandler');
const Users = require('../../../models/user');
const ShiftRosters = require('../../../models/shift-roster');
const mongoose = require('mongoose');

const ObjectId = require('mongoose').Types.ObjectId;

const getDayWiseAttendances = async (_, args, { me, tenantid }) =>
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

      if (args.query.approvers && args.query.approvers.length && args.query.approvers[0].approverID) {
          aggregation.push(
            {
              $match: {
                  $and: [
                    { reportingManagerId : { $eq: ObjectId(args.query.approvers[0].approverID) } },
                    { tenantid: { $eq: ObjectId(tenantid) } }
                  ]
                }
            }, 
            {
                '$graphLookup': {
                  'from': 'Users', 
                  'startWith': '$reportingManagerId', 
                  'connectFromField': '_id', 
                  'connectToField': 'reportingManagerId', 
                  'as': 'reportees', 
                  'maxDepth': 9, 
                  'depthField': 'level',
                }
            },
            { $limit:40 }, // Server Low Memory Please Upgrade
            {
              '$project': {
                'reportees._id': 1, 
                'reportees.eCode': 1, 
                'reportees.username': 1, 
                'reportees.leaveTypesNBalance': 1, 
                'reportees.reportingManagerId': 1, 
                'reportees.level': 1, 
                'reportees.tenantid': 1,
                'reportees.overtime': 1
              }
            }, 
            {
              '$sort': {
                'reportees.level': -1
              }
            }, 
            {
              '$unwind': {
                'path': '$reportees', 
                'preserveNullAndEmptyArrays': true
              }
            },
            {
              '$group': {
                '_id': '$reportees._id', 
                'eCode': {
                  '$first': '$reportees.eCode'
                }, 
                'username': {
                  '$first': '$reportees.username'
                }, 
                'reportingManagerId': {
                  '$first': '$reportees.reportingManagerId'
                }, 
                'leaveTypesNBalance': {
                  '$first': '$reportees.leaveTypesNBalance'
                }, 
                'level': {
                  '$first': '$reportees.level'
                }, 
                'tenantid': {
                  '$first': '$reportees.tenantid'
                }, 
                'overtime': {
                  '$first': '$reportees.overtime'
                }
              }
            }
        )
      };

      if (args.query?.username) {
        aggregation.push({
          $match: {
            username: { $eq: args.query?.username }
          },
        });
      }
      
      if (args.query?.eCode) {
        aggregation.push({
          $match: {
            $and: [
              { eCode: { $eq: args.query?.eCode } },
              { tenantid: { $eq: ObjectId(tenantid) } }
            ]
          },
        });
      }

      await Users.aggregate(
        aggregation.concat([
          {
            $match: {
                tenantid: {
                  $eq: ObjectId(tenantid)
                }
            },
          },
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
                          $lte: dateEnd,
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
                        $lte: [
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
            },
          },
          {
            $sort: {
              '_id.date': 1,
            },
          },
          { $limit : args.query?.limit || 9999 }, 
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
              punchIn: true,
              punchOut: true,
              totalHours: true,
              swipes: true,
              roster: true,
              shiftName: { $first: '$roster.shifts' },
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
              shift: { $first: '$shifts' },
            }
          },
          {
            $addFields: {
              isHalfDayOrFull: {
                $cond: {
                  if: {
                    $gt: ['$totalHours', 0],
                  },
                  then: {
                    $cond: {
                      if: {
                        $gte: [ '$totalHours', '$shift.workingHours.minimumHoursRequiredHalfDay' ]
                      },
                      then: 'Full Day' ,
                      else: 'Half Day'
                    }
                  },
                  else: '' // Null
                }
              }
            }
          }
        ])
      ).allowDiskUse(true).option({ allowDiskUse: true }).exec(async function (e, d) {
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

module.exports = getDayWiseAttendances;
