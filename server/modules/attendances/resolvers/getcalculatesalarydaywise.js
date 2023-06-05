const { paramHandler } = require('../../../utils/paramhandler');
const Users = require('../../../models/user');
const ShiftRosters = require('../../../models/shift-roster');
const Salary = require('../../../models/salary');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const getCalculateSalarydayWise = async (_, args, { me, tenantid }) =>
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
            $and: [
              { eCode: { $eq: args.query?.eCode, }, },
              { tenantid: { $eq: ObjectId(tenantid) } }
            ]
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
                      { tenantid: ObjectId(tenantid) }
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
            $match: {
              $and: [
                { tenantid: ObjectId(tenantid) }
              ]
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
                      { tenantid: ObjectId(tenantid) }
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
              day_diff: true
            },
          },
          {
            $lookup: {
              from: 'Shifts',
              localField: 'shiftName',
              foreignField: 'code',
              as: 'shifts',
              pipeline: [
                {
                  $match: {
                    $and: [
                      { tenantid: mongoose.Types.ObjectId(tenantid) }
                    ]
                  },
                },
              ],
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
              companyDaysOFF: {
                $cond: {
                  if: {
                    $eq: [ { $arrayElemAt: ['$shifts.code', 0] }, 'OFF' ]
                  },
                  then: 1,
                  else: 0
                }
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
              overtime_by: { $first: '$shifts.payDays.overtimeReportCalculationBy' }
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
            $addFields:{
              user_overtime_per: {
                $cond: [
                  { $eq: ['hour', '$shift.payDays.overtimeReportCalculationBy'] },
                  {
                    $divide: [
                      { $divide: [ { $arrayElemAt: [ '$user_salary.CTC', 0 ] }, '$day_diff' ] },
                      '$shift.workingHours.minimumHoursRequired',
                    ],
                  },
                  {
                    $cond: {
                    	if: {
                        $gte: ['$overtime', '$shift.workingHours.minimumHoursRequiredHalfDay'],
                      },
                    	then: {
                        $divide: [ { $arrayElemAt: [ '$user_salary.CTC', 0 ] }, '$day_diff' ]
                      } ,
                    	else: {
                        $divide:[
                          { $divide: [ { $arrayElemAt: [ '$user_salary.CTC', 0 ] }, '$day_diff' ] },
                          2
                        ]
                      }
                    }
                  }
                ], 
              },
            },
          },
           {
            $addFields:{
              total_overtime_done_by_user: { 
                $multiply: [
                  "$overtime",
                  '$user_overtime_per'
                ] 
              },
            },
           },
          {   
            $group : {
              _id : "$eCode",
              eCode:{  $first: "$eCode" },
              username:{  $first: "$username" },
              totalDaysAbsent:{ $sum: "$absent" },
              companyDaysOFF:{ $sum: "$companyDaysOFF" },
              day_diff: { $first: "$day_diff" },
              overtime: { $sum: "$overtime" },
              user_salary: { $first: { $arrayElemAt: [ '$user_salary.CTC', 0 ] } },
              total_overtime_done_by_user: { $sum: { $toInt: "$total_overtime_done_by_user" } },
              salaryId: { $first: { $arrayElemAt: [ '$user_salary._id', 0 ] } },
              user_salary_object: { $first: { $arrayElemAt: [ '$user_salary', 0 ] } }
            }
          },
  				{
             $addFields:{
               totalDaysPresent: { $subtract: ["$day_diff", "$totalDaysAbsent"] },
               total_overtime: { $toInt: "$overtime" },
               securityDeposit: { $arrayElemAt: [ '$user_salary_object.securityDeposit', 0 ] },
               status: "Pending",
             }
          },
          {
            $addFields: {
              user_salary_object: {
                payHeads: {
                  $map: {
                    input: "$user_salary_object.payHeads",
                    as: "payHeads",
                    in: {
                      "_id": "$$payHeads._id",
                      "name": "$$payHeads.name",
                      "payhead_type": "$$payHeads.payhead_type",
                      "calculationType": "$$payHeads.calculationType",
                      "value": {
                        $switch: {
                          branches: [
                            { 
                              case: {
                                $and: [
                                  { $ne: ['$$payHeads.name', 'CTC'] },
                                  { $ne: ['$$payHeads.name', 'SECURITY DEPOSIT'] }
                                ]
                              }, 
                              then: {
                                $toInt: {
                                  $multiply: [
                                    { $divide: [ "$$payHeads.value", "$day_diff" ] },
                                    { $sum: [ { $subtract: ["$day_diff", "$totalDaysAbsent"], }, "$companyDaysOFF" ] }
                                  ]
                                }
                              }
                            },
                            { 
                              case: { // Update currentEMI Counter after Pay Success
                                $and: [
                                  { $eq: ['$$payHeads.name', 'SECURITY DEPOSIT'] }
                                ]
                              }, 
                              then: {
                                $toInt: { 
                                  $cond: {
                                    if: {
                                      $lt: ['$securityDeposit.currentEMI', '$securityDeposit.EMITenure']
                                    },
                                    then: {
                                      $divide: [ 
                                        "$$payHeads.value", "$securityDeposit.EMITenure" 
                                      ]
                                    },
                                    else: 0
                                  } 
                                }
                              }
                            },
                          ],
                          default: 0 // OR "$$payHeads.value" if want to calculate all payheads
                        }
                      }                  
                    }
                  }
                }
              }
            }
          },
          {
            $unwind: {
              path: '$user_salary_object.payHeads',
              preserveNullAndEmptyArrays: true,
            }
          },
          {
            $lookup: {
              from: 'PayHeads',
              localField: 'user_salary_object.payHeads.name',
              foreignField: 'name',
              as: 'pay_head',
              pipeline: [
                {
                  $match: {
                    $and: [
                      { tenantid: ObjectId(tenantid) }
                    ]
                  },
                },
              ],
            }, 
          },
          {
            $set: {
              "user_salary_object.payHeads.amountGreaterThan": { $arrayElemAt: [ '$pay_head.amountGreaterThan', 0 ] }
            }
          },
          {
            $group:{
              _id: {
                    'eCode':'$eCode',
              },
              user_range_salary: { $sum:
                {
                  $switch: {
                      branches: [
                        { 
                          case: {
                            $eq: ['$user_salary_object.payHeads.payhead_type', 'Earnings for Employees']
                          }, 
                          then: {
                            $sum: [ "$total_pay_heads_salary", '$user_salary_object.payHeads.value' ]
                          }
                        },
                        { 
                          case: {
                            $eq: ['$user_salary_object.payHeads.payhead_type', 'Employers Statutory Contributions']
                          }, 
                          then: {
                            $sum: [ "$total_pay_heads_salary", '$user_salary_object.payHeads.value' ]
                          }
                        },
                        { 
                          case: {
                            $eq: ['$user_salary_object.payHeads.payhead_type', 'Employees Statutory Deductions']
                          }, 
                          then: {
                            $sum: [ "$total_pay_heads_salary", '$user_salary_object.payHeads.value' ]
                          }
                        },
                        { 
                          case: {
                            $eq: ['$user_salary_object.payHeads.payhead_type', 'Security Deposit']
                          }, 
                          then: {
                            $sum: [ "$total_pay_heads_salary", '$user_salary_object.payHeads.value' ]
                          },
                        }
                      ],
                      default: "$total_pay_heads_salary"
                  }
                }
               },
              total_pay_heads_salary: { $sum:
                {
                  $switch: {
                      branches: [
                        { 
                          case: {
                            $eq: ['$user_salary_object.payHeads.payhead_type', 'Earnings for Employees']
                          }, 
                          then: {
                            $sum: [ "$total_pay_heads_salary", '$user_salary_object.payHeads.value' ]
                          }
                        },
                        { 
                          case: {
                            $eq: ['$user_salary_object.payHeads.payhead_type', 'Employers Statutory Contributions']
                          }, 
                          then: {
                            $sum: [ "$total_pay_heads_salary", '$user_salary_object.payHeads.value' ]
                          }
                        },
                        { 
                          case: {
                            $eq: ['$user_salary_object.payHeads.payhead_type', 'Employees Statutory Deductions']
                          }, 
                          then: {
                            $subtract: [ "$total_pay_heads_salary", '$user_salary_object.payHeads.value' ]
                          },
                        },
                        { 
                          case: {
                            $eq: ['$user_salary_object.payHeads.payhead_type', 'Security Deposit']
                          }, 
                          then: {
                            $subtract: [ "$total_pay_heads_salary", '$user_salary_object.payHeads.value' ]
                          },
                        }
                      ],
                      default: "$total_pay_heads_salary"
                  }
                }
              },
              Earnings_for_Employee: { $sum:
                {
                  $switch: {
                      branches: [
                        { 
                          case: {
                            $eq: ['$user_salary_object.payHeads.payhead_type', 'Earnings for Employees']
                          }, 
                          then: {
                            $sum: [ "$Earnings_for_Employee", '$user_salary_object.payHeads.value' ]
                          }
                        },
                      ],
                      default: "$Earnings_for_Employee"
                  }
                }
              },
              Employees_Statutory_Deductions: { $sum:
                {
                  $switch: {
                      branches: [
                        { 
                          case: {
                            $eq: ['$user_salary_object.payHeads.payhead_type', 'Employees Statutory Deductions']
                          }, 
                          then: {
                            $sum: [ "$Employees_Statutory_Deductions", '$user_salary_object.payHeads.value' ]
                          }
                        },
                      ],
                      default: "$Employees_Statutory_Deductions"
                  }
                }
              },
              Employers_Statutory_Contributions: { $sum:
                {
                  $switch: {
                      branches: [
                        { 
                          case: {
                            $eq: ['$user_salary_object.payHeads.payhead_type', 'Employers Statutory Contributions']
                          }, 
                          then: {
                            $sum: [ "$Employers_Statutory_Contributions", '$user_salary_object.payHeads.value' ]
                          }
                        },
                      ],
                      default: "$Employers_Statutory_Contributions"
                  }
                }
              },
              Security_Deposit: { $sum:
                {
                  $switch: { // Update currentEMI Counter after Pay Success
                      branches: [
                        { 
                          case: {
                            $eq: ['$user_salary_object.payHeads.payhead_type', 'Security Deposit']
                          }, 
                          then: {
                            $cond: {
                              if: {
                                $lt: ['$securityDeposit.currentEMI', '$securityDeposit.EMITenure']
                              },
                              then: {
                                $sum: [ "$Security_Deposit", '$user_salary_object.payHeads.value' ]
                              },
                              else: 0
                            }                            
                          }
                        },
                      ],
                      default: "$Security_Deposit"
                  }
                }
              },
              eCode:{  $first: "$eCode" },
              username:{  $first: "$username" },
              totalDaysAbsent:{ $first: "$totalDaysAbsent" },
              totalDaysPresent:{ $first: "$totalDaysPresent" },
              companyDaysOFF:{ $first: "$companyDaysOFF" },
              day_diff: { $first: "$day_diff" },
              overtime: { $first: { $toInt: "$overtime" } },
              user_salary: { $first: "$user_salary" },
              total_overtime:{ $first: { $toInt: "$total_overtime" } },
              total_overtime_done_by_user: { $first: "$total_overtime_done_by_user" },
              salaryId: { $first: "$salaryId" },
              status: { $first: "$status" },
              user_salary_object: { $push: '$user_salary_object' }
            }
          }
        ])
      ).exec(async function (e, d) {
        if (e) return reject(new Error(e));
        if(me?.user?.username !== 'gonngod') {
          d = d.filter(res => res.username !== 'gonngod');
        }
         resolve(d);
      });
    } catch (e) {
      reject(e);
    }

    function getDaysInMonth(year, month) {
      return new Date(year, month, 0).getDate();
    }

  });

module.exports = getCalculateSalarydayWise;
