const { paramHandler } = require('../../../utils/paramhandler');
const Users = require('../../../models/user');
const mongoose = require('mongoose');

const getUserSalarySlip = async (_, args, { me, tenantid }) =>
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
              tenantid: true,
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
              tenantid: true,
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
              tenantid: {
                $first: '$tenantid',
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
              tenantid: true,
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
              tenantid: true,
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
              tenantid: true,
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
            },
          },
          {
            $project: {
              userId: true,
              username: true,
              eCode: true,
              tenantid: true,
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
                  eCode:{  $first: "$eCode" },
                  payHeads:{  $first: { $arrayElemAt: [ '$user_salary.payHeads',0 ] } },
                  tenantid:{  $first: "$tenantid" },
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
            $lookup: {
              from: 'Tenants',
              localField: 'tenantid',
              foreignField: '_id',
              as: 'user_tenant',
            },
          },
          {
            $unwind: {
              path: '$user_tenant',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
             $addFields:{
                pay_advice_for: "$user_tenant.profile.companyName",
                pay_advice_for_address: {
                    $concat: [
                        '$user_tenant.profile.companyAddress',
                        ' ',
                        '$user_tenant.profile.companyCity',
                        ' ',
                        '$user_tenant.profile.companyPostalOrZipCode',
                        ' ',
                        '$user_tenant.profile.companyStateProvince',
                        ' ',
                        '$user_tenant.profile.companyCountry',
                        ' ',
                    ]
                }
             }
          },
         
          {
            $lookup: {
              from: 'Users',
              localField: 'eCode',
              foreignField: 'eCode',
              as: 'user_bank_info',
            },
          },
          {
            $unwind: {
              path: '$user_bank_info',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
             $addFields:{
                user_bank_bankName: "$user_bank_info.bankName",
                name: "$user_bank_info.name",
                surname: "$user_bank_info.surname",
                user_bank_accountNo: "$user_bank_info.accountNo",
                user_bank_ifscCode: "$user_bank_info.IFSCCode",
                user_pan:"$user_bank_info.panId",
                user_bank_PFNo: "$user_bank_info.PFNo",
                user_bank_UANNo: "$user_bank_info.UANNo",
                user_bank_PensionNo: "$user_bank_info.PensionNo",
                user_gender: "$user_bank_info.gender",
                user_dob: "$user_bank_info.dob",
                user_doj: "$user_bank_info.doj",
                user_dor: "$user_bank_info.dor",
                user_location: "$user_bank_info.location",
                user_address:"$user_bank_info.permanentAddress"
             }
          },
          {
            $lookup: {
              from: 'Departments',
              localField: 'user_bank_info.unitDepartmentId',
              foreignField: '_id',
              as: 'user_department_info',
            },
          },
          {
            $unwind: {
              path: '$user_department_info',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
             $addFields:{
                user_department_id: "$user_department_info._id",
                user_department_name: "$user_department_info.name",
             }
          },
          {
            $lookup: {
              from: 'Designations',
              localField: 'user_bank_info.designationId',
              foreignField: '_id',
              as: 'user_designation_info',
            },
          },
          {
            $unwind: {
              path: '$user_designation_info',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
             $addFields:{
                user_designation_id: "$user_designation_info._id",
                user_designation_name: "$user_designation_info.name",
             }
          },
          
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

module.exports = getUserSalarySlip;
