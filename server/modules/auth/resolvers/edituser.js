const User = require('../../../models/user');
const Role = require('../../../models/role');
const mongoose = require('mongoose');
const JobTitle = require('../../../models/job-titles');
const Department = require('../../../models/departments');
const LeaveType = require('../../../models/leave-types');
const Designation = require('../../../models/designations');
const Shift = require('../../../models/shifts');
const EmployeeType = require('../../../models/employee-types');
const ModeOfEmployment = require('../../../models/mode-of-employment');

const updateUser = (_, args ,{ me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const usr = await User.findOne({ $or: [{ username: args.username },{ _id: args._id, $and: [{ tenantid }] }] });
    if (!usr) {
      reject(new Error('User Does Not exist!'));
    } else {
      const jobTitleId = args.jobTitleId && await JobTitle.findById(mongoose.Types.ObjectId(args.jobTitleId));
      const unitDepartmentId = args.unitDepartmentId && await Department.findById(mongoose.Types.ObjectId(args.unitDepartmentId));
      const designationId = args.designationId && await Designation.findById(mongoose.Types.ObjectId(args.designationId));
      const reportingManagerId = args.reportingManagerId && await User.findById(mongoose.Types.ObjectId(args.reportingManagerId));
      const employeeShiftIds = args.employeeShiftIds && args.employeeShiftIds.length && await Shift.find({ _id: { $in: args.employeeShiftIds }});
      const roleId = args.roleId && await Role.findById(mongoose.Types.ObjectId(args.roleId));
      const employeeTypeId = args.employeeTypeId && await EmployeeType.findById(mongoose.Types.ObjectId(args.employeeTypeId));
      const modeOfEmploymentId = args.modeOfEmploymentId && await ModeOfEmployment.findById(mongoose.Types.ObjectId(args.modeOfEmploymentId));
      if(args.jobTitleId && !jobTitleId) throw(new Error('Selected Job Title Does Not Exist!'));
      if(args.unitDepartmentId && !unitDepartmentId) throw(new Error('Selected Department Does Not Exist!'));
      if(args.designationId && !designationId) throw(new Error('Selected Designation Does Not Exist!'));
      if(args.reportingManagerId && !reportingManagerId) throw(new Error('Selected Reporting Manager Does Not Exist!'));
      if(args.employeeShiftIds && args.employeeShiftIds.length !== employeeShiftIds.length) throw(new Error('1 or More Shift(s) Does Not Exist!'));
      if(args.roleId && !roleId) throw(new Error('Selected Role Does Not Exist!'));
      if(args.employeeTypeId && !employeeTypeId) throw(new Error('Selected Employee Type Does Not Exist!'));
      if(args.modeOfEmploymentId && !modeOfEmploymentId) throw(new Error('Selected Mode Of Employment Does Not Exist!'));

      const getLeaveTypes = await LeaveType.find({ '_id': { $in: unitDepartmentId?.leaveTypesIDs } })

      const updatedUser = await User.findOneAndUpdate({ $or: [{ username: args.username },{ _id: args._id }] }, {
          $set: {
            ...args,
            tenantid,
            jobTitle: args.jobTitleId,
            unitDepartment: args.unitDepartmentId,
            designation: args.designationId,
            reportingManager: args.reportingManagerId,
            employeeShifts: args.employeeShiftIds,
            role: args.roleId,
            employeeType: args.employeeTypeId,
            modeOfEmployment: args.modeOfEmploymentId,
            leaveTypesId: unitDepartmentId?.leaveTypesIDs,
            leaveTypes: unitDepartmentId?.leaveTypesIDs,
            leaveTypesNBalance: getLeaveTypes,
            audit: {
              modified_at: new Date(),
              modified_by: me?.user?.username
            }
          }
        }, { new: true, useFindAndModify: false }
      );
      if(!updatedUser) {
        reject(new Error('Unable to update User Data!'));
      }
      User.findById(updatedUser._id)
        .populate('jobTitle', 'name')
        .populate('unitDepartment', 'name')
        .populate('designation', 'name')
        .populate('leaveTypes', 'name')
        .populate('reportingManager', 'username email role')
        .populate('employeeShifts', 'name')
        .populate('role', 'role_name')
        .populate('employeeType', 'name')
        .populate('modeOfEmployment', 'name')
        .exec(function (err, newUser) {
          if (err) throw new Error('Unable to Update User Data!');
          resolve(newUser);
        });
    }
  } catch (e) {
    reject(e);
  }
});

module.exports = updateUser;
