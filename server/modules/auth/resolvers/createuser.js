const User = require('../../../models/user');
const Role = require('../../../models/role');
const JobTitle = require('../../../models/job-titles');
const Department = require('../../../models/departments');
const Designation = require('../../../models/designations');
const Shift = require('../../../models/shifts');
const LeaveType = require('../../../models/leave-types');
const EmployeeType = require('../../../models/employee-types');
const ModeOfEmployment = require('../../../models/mode-of-employment');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;

const createUser = (_, args ,{ me, secret, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const usr = await User.findOne({ 
      $and: [
        { tenantid: mongoose.Types.ObjectId(tenantid) },
        {
          $or: [ { username: args.username }, { eCode: args.eCode }]
        }
      ]
      
    });
    if (usr) {
      throw(new Error('User already exist!'));
    } else {

      if(!ObjectId.isValid(args.jobTitleId)) { delete args.jobTitleId };
      if(!ObjectId.isValid(args.unitDepartmentId)) { delete args.unitDepartmentId };
      if(!ObjectId.isValid(args.designationId)) { delete args.designationId };
      if(!ObjectId.isValid(args.roleId)) { delete args.roleId };
      if(!ObjectId.isValid(args.reportingManagerId)) { delete args.reportingManagerId };
      if(!ObjectId.isValid(args.employeeTypeId)) { delete args.employeeTypeId };
      if(!ObjectId.isValid(args.modeOfEmploymentId)) { delete args.modeOfEmploymentId };

      args.employeeShiftIds?.length && args.employeeShiftIds.forEach((item, idx) => !ObjectId.isValid(item) && delete args.employeeShiftIds[idx]);

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
      if(employeeShiftIds && employeeShiftIds.length && (args.employeeShiftIds.length !== employeeShiftIds.length)) throw(new Error('1 or More Shift(s) Does Not Exist!'));
      if(args.roleId && !roleId) throw(new Error('Selected Role Does Not Exist!'));
      if(args.employeeTypeId && !employeeTypeId) throw(new Error('Selected Employee Type Does Not Exist!'));
      if(args.modeOfEmploymentId && !modeOfEmploymentId) throw(new Error('Selected Mode Of Employment Does Not Exist!'));

      const getLeaveTypes = await LeaveType.find({ '_id': { $in: unitDepartmentId?.leaveTypesIDs } })

      const newEntity = await new User({
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
        leaveTypesNBalance: getLeaveTypes,
        password: await bcrypt.hash(args.password, 10),
        audit: {
          created_at: new Date(),
          created_by: me?.user?.username
        }
      });
      await createToken({ id: newEntity._id, email: newEntity.email, username: newEntity.username }, secret, '1h');
      if(!newEntity) {
        reject(new Error('Unable to create User!'));
      }
      await newEntity.save();
      User.findById(newEntity._id)
        .populate('jobTitle', 'name')
        .populate('unitDepartment', 'name')
        .populate('designation', 'name')
        .populate('reportingManager', 'username email role')
        .populate('employeeShifts', 'name')
        .populate('role', 'role_name')
        .populate('employeeType', 'name')
        .populate('modeOfEmployment', 'name')
        .exec(async function (err, newEntity) {
          if (err) throw new Error('Unable to create User!');
          resolve(newEntity);
        });
    }
  } catch (e) {
    reject(e);
  }
});

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user;
  return await jsonwebtoken.sign({ id, email, username }, secret, {
    expiresIn
  });
};

module.exports = createUser;
