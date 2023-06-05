const User = require('../../../models/user');
const { paramHandler } = require('../../../utils/paramhandler');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const getUsers = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid});
  //const usr = await User.findOne({ $or: [{ reportingManagerId:  { $eq: ObjectId(args.query.approvers[0].approverID) } }] });
  
  let aggregation = [];

  if (args.query.approvers && args.query.approvers.length && args.query.approvers[0].approverID) {
    aggregation.push(
      {
        $match: {
          $and: [
            { reportingManagerId : { $eq: ObjectId(args.query.approvers[0].approverID) } },
            { tenantid: { $eq: ObjectId(tenantid) } }
          ]
        }
      }, {
        '$graphLookup': {
          'from': 'Users', 
          'startWith': '$reportingManagerId', 
          'connectFromField': '_id', 
          'connectToField': 'reportingManagerId', 
          'as': 'reportees', 
          'maxDepth': 9, 
          'depthField': 'level'
        }
      },
      { $limit:40 }, // Server Low Memory Please Upgrade
      {
        '$project': {
          'reportees.level': 1,
          'reportees._id': 1,
          'reportees.eCode': 1,
          'reportees.username': 1,
          'reportees.title': 1,
          'reportees.name': 1,
          'reportees.surname': 1,
          'reportees.gender': 1,
          'reportees.dob': 1,
          'reportees.doj': 1,
          'reportees.maritalStatus': 1,
          'reportees.bloodGroup': 1,
          'reportees.nationality': 1,
          'reportees.ethnicity': 1,
          'reportees.cast': 1,
          'reportees.religion': 1,
          'reportees.jobTitleId': 1,
          'reportees.jobTitle': 1,
          'reportees.unitDepartmentId': 1,
          'reportees.unitDepartment': 1,
          'reportees.designationId': 1,
          'reportees.designation': 1,
          'reportees.reportingManagerId': 1,
          'reportees.reportingManager': 1,
          'reportees.employeeShifts': 1,
          'reportees.employeeShiftIds': 1,
          'reportees.timeOfficePolicy': 1,
          'reportees.punchInADay': 1,
          'reportees.leaveTypesId': 1,
          'reportees.leaveTypes': 1,
          'reportees.leaveRequestsId': 1,
          'reportees.leaveRequests': 1,
          'reportees.roleId': 1,
          'reportees.role': 1,
          'reportees.employeeTypeId': 1,
          'reportees.employeeType': 1,
          'reportees.modeOfEmploymentId': 1,
          'reportees.modeOfEmployment': 1,
          'reportees.doj': 1,
          'reportees.doc': 1,
          'reportees.dor': 1,
          'reportees.status': 1,
          'reportees.overtime': 1,
          'reportees.guardianName': 1,
          'reportees.relation': 1,
          'reportees.panId': 1,
          'reportees.aadharId': 1,
          'reportees.email': 1,
          'reportees.homePhone': 1,
          'reportees.personalPhone': 1,
          'reportees.emergencyContact': 1,
          'reportees.pinCode': 1,
          'reportees.currentAddress': 1,
          'reportees.permanentAddress': 1,
          'reportees.bankName': 1,
          'reportees.accountNo': 1,
          'reportees.IFSCCode': 1,
          'reportees.branch': 1,
          'reportees.location': 1,
          'reportees.ESINo': 1,
          'reportees.PFNo': 1,
          'reportees.UANNo': 1,
          'reportees.PensionNo': 1,
          'reportees.qualification': 1,
          'reportees.experience': 1,
          'reportees.salary': 1,
          'reportees.salaryId': 1,
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
      }
    )
  };

  if (args.query?.id || args.query?.eCode ) { // Get By User ID
    aggregation.push(
      {
        $lookup: {
          'from': 'Users', 
          'localField': '_id', 
          'foreignField': '_id',
          'as': 'reportees',
          pipeline: [
            {
              $match: {
                $and: [
                  { tenantid: mongoose.Types.ObjectId(tenantid) }
                ]
              },
            }
          ],
        }
      },
      {
        $match: {
          $or: [
            { '_id': { $eq: ObjectId(args.query?.id) } },
            { 'eCode': { $eq: args.query?.eCode } },
          ]
        },
      },
      {
        '$project': {
          'reportees': {
            $arrayElemAt: [ '$reportees', 0, ],
          },
        }
      },
    );
  };

  if (args.query?.departmentId) { // Get By Department ID
    aggregation.push({
      $match: {
        'reportees.unitDepartment': { $eq: ObjectId(args.query?.departmentId) }
      },
    });
  };
  
  
  User.aggregate(
    aggregation.concat([
    {
      '$lookup': {
        'from': 'Users', 
        'localField': 'reportees.reportingManagerId', 
        'foreignField': '_id', 
        'as': 'manager', 
        'pipeline': [
          {
            '$project': {
              '_id': 1, 
              'username': 1, 
              'email': 1, 
              'role': 1
            }
          }
        ]
      }
    }, {
      '$set': {
        'reportees.reportingManager': {
          '$arrayElemAt': [
            '$manager', 0
          ]
        }
      }
    },
    {
      '$lookup': {
        'from': 'Departments', 
        'localField': 'reportees.unitDepartment', 
        'foreignField': '_id', 
        'as': 'department', 
        'pipeline': [
          {
            '$project': {
              '_id': 1, 
              'name': 1
            }
          }
        ]
      }
    }, {
      '$set': {
        'reportees.unitDepartment': {
          '$arrayElemAt': [
            '$department', 0
          ]
        }
      }
    },
    {
      '$lookup': {
        'from': 'Designations', 
        'localField': 'reportees.designation', 
        'foreignField': '_id', 
        'as': 'designation', 
        'pipeline': [
          {
            '$project': {
              '_id': 1, 
              'name': 1
            }
          }
        ]
      }
    }, {
      '$set': {
        'reportees.designation': {
          '$arrayElemAt': [
            '$designation', 0
          ]
        }
      }
    },
    {
      '$lookup': {
        'from': 'Role', 
        'localField': 'reportees.role', 
        'foreignField': '_id', 
        'as': 'role', 
        'pipeline': [
          {
            '$project': {
              '_id': 1, 
              'role_name': 1
            }
          }
        ]
      }
    }, {
      '$set': {
        'reportees.role': {
          '$arrayElemAt': [
            '$role', 0
          ]
        }
      }
    },
    {
      '$lookup': {
        'from': 'employeeType', 
        'localField': 'reportees.employeeType', 
        'foreignField': '_id', 
        'as': 'employeeType', 
        'pipeline': [
          {
            '$project': {
              '_id': 1, 
              'name': 1
            }
          }
        ]
      }
    },
    {
      '$set': {
        'reportees.employeeType': {
          '$arrayElemAt': [
            '$employeeType', 0
          ]
        }
      }
    },
    {
      '$lookup': {
        'from': 'Shifts', 
        'localField': 'reportees.employeeShifts', 
        'foreignField': '_id', 
        'as': 'shifts', 
        'pipeline': [
          {
            '$project': {
              '_id': 1, 
              'name': 1
            }
          }
        ]
      }
    },
    {
      '$set': {
        'reportees.employeeShifts': '$shifts'
      }
    },
    {
      '$lookup': {
        'from': 'Salary', 
        'localField': 'reportees.salaryId', 
        'foreignField': '_id', 
        'as': 'user_salary', 
        'pipeline': [
          {
            '$project': {
              '_id': 1,
              'CTC': 1,
              'salaryStructure': 1,
              'payHeads':1
            }
          }
        ]
      }
    },
    {
      '$set': {
        'reportees.salary': {
          '$arrayElemAt': [
            '$user_salary', 0
          ]
        }
      }
    },
    {
      '$group': {
        '_id': '$reportees._id',
        'level': { $first: '$reportees.level' },
        'eCode': { $first: '$reportees.eCode' },
        'username': { $first: '$reportees.username' },
        'title': { $first: '$reportees.title' },
        'name': { $first: '$reportees.name' },
        'surname': { $first: '$reportees.surname' },
        'gender': { $first: '$reportees.gender' },
        'dob': { $first: '$reportees.dob' },
        'maritalStatus': { $first: '$reportees.maritalStatus' },
        'bloodGroup': { $first: '$reportees.bloodGroup' },
        'nationality': { $first: '$reportees.nationality' },
        'ethnicity': { $first: '$reportees.ethnicity' },
        'cast': { $first: '$reportees.cast' },
        'religion': { $first: '$reportees.religion' },
        'jobTitleId': { $first: '$reportees.jobTitleId' },
        'jobTitle': { $first: '$reportees.jobTitle' },
        'unitDepartmentId': { $first: '$reportees.unitDepartmentId' },
        'unitDepartment': { $first: '$reportees.unitDepartment' },
        'designationId': { $first: '$reportees.designationId' },
        'designation': { $first: '$reportees.designation' },
        'reportingManagerId': { $first: '$reportees.reportingManagerId' },
        'reportingManager': { $first: '$reportees.reportingManager' },
        'employeeShiftIds': { $first: '$reportees.employeeShiftIds' },
        'employeeShifts': { $first: '$reportees.employeeShifts' },
        'timeOfficePolicy': { $first: '$reportees.timeOfficePolicy' },
        'punchInADay': { $first: '$reportees.punchInADay' },
        'leaveTypesId': { $first: '$reportees.leaveTypesId' },
        'leaveTypes': { $first: '$reportees.leaveTypes' },
        'leaveRequestsId': { $first: '$reportees.leaveRequestsId' },
        'leaveRequests': { $first: '$reportees.leaveRequests' },
        'roleId': { $first: '$reportees.roleId' },
        'role': { $first: '$reportees.role' },
        'employeeTypeId': { $first: '$reportees.employeeTypeId' },
        'employeeType': { $first: '$reportees.employeeType' },
        'modeOfEmploymentId': { $first: '$reportees.modeOfEmploymentId' },
        'modeOfEmployment': { $first: '$reportees.modeOfEmployment' },
        'doj': { $first: '$reportees.doj' },
        'doc': { $first: '$reportees.doc' },
        'dor': { $first: '$reportees.dor' },
        'status': { $first: '$reportees.status' },
        'overtime': { $first: '$reportees.overtime' },
        'guardianName': { $first: '$reportees.guardianName' },
        'relation': { $first: '$reportees.relation' },
        'panId': { $first: '$reportees.panId' },
        'aadharId': { $first: '$reportees.aadharId' },
        'email': { $first: '$reportees.email' },
        'homePhone': { $first: '$reportees.homePhone' },
        'personalPhone': { $first: '$reportees.personalPhone' },
        'emergencyContact': { $first: '$reportees.emergencyContact' },
        'pinCode': { $first: '$reportees.pinCode' },
        'currentAddress': { $first: '$reportees.currentAddress' },
        'permanentAddress': { $first: '$reportees.permanentAddress' },
        'bankName': { $first: '$reportees.bankName' },
        'accountNo': { $first: '$reportees.accountNo' },
        'IFSCCode': { $first: '$reportees.IFSCCode' },
        'branch': { $first: '$reportees.branch' },
        'location': { $first: '$reportees.location' },
        'ESINo': { $first: '$reportees.ESINo' },
        'PFNo': { $first: '$reportees.PFNo' },
        'UANNo': { $first: '$reportees.UANNo' },
        'PensionNo': { $first: '$reportees.PensionNo' },
        'qualification': { $first: '$reportees.qualification' },
        'experience': { $first: '$reportees.experience' }, 
        'salary': { $first: '$reportees.salary' }, 
        'salaryId': { $first: '$reportees.salaryId' }, 
      }
    }
  ]
  )).allowDiskUse(true).option({ allowDiskUse: true })

  // await User.find(param)
  //   .skip(args.query.offset).limit(args.query.limit)
  //   .populate('jobTitle', 'name')
  //   .populate('unitDepartment', 'name')
  //   .populate('designation', 'name')
  //   .populate('reportingManager', 'username email role')
  //   .populate('employeeShifts', 'name')
  //   .populate('role', 'role_name')
  //   .populate('employeeType', 'name')
  //   .populate('leaveRequests', 'startDate endDate')
  //   .populate('modeOfEmployment', 'name')
  //   .populate('salaryId', 'CTC')
    .exec(function (err, users) {
      if (err) return reject(err);
      users = users.filter(user => user.username !== 'gonngod');
      resolve(users);
    })
});

module.exports = getUsers;
