const Department = require('../../../models/departments');
const mongoose = require('mongoose');
const User = require('../../../models/user');
const Leavetype = require('../../../models/leave-types');
const generateAuditTrail = require('../../../utils/audit-trails');
const ObjectId = require('mongoose').Types.ObjectId;

const editDepartment = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const department = await Department.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }, { _id: args._id, $and: [{ tenantid }]}] });
    if (!department) {
      generateAuditTrail(null, null, me, tenantid, 'Department', 'Find Department', 'Edit','Failed',args, 'Department Does Not exist!');
      throw(new Error('Department Does Not Exist!'));
    } else {
      
      if(!ObjectId.isValid(args.parentDepartmentId)) { delete args.parentDepartmentId };
      if(!ObjectId.isValid(args.departmentLeadId)) { delete args.departmentLeadId };
      args.leaveTypesIDs.length && args.leaveTypesIDs.forEach((item, idx) => !ObjectId.isValid(item) && delete args.leaveTypesIDs[idx]);

      if(!await User.findById(mongoose.Types.ObjectId(args.departmentLeadId)) && args.departmentLeadId) {
        generateAuditTrail(null, null, me, tenantid, 'Department', 'Find Department', 'Edit','Warning',args, 'Invalid DepartmentLead ID!');
        throw(new Error('Invalid DepartmentLead ID!'));
      }

      if(!await Department.findById(mongoose.Types.ObjectId(args.parentDepartmentId)) && args.parentDepartmentId) {
        generateAuditTrail(null, null, me, tenantid, 'Department', 'Find Department', 'Edit','Warning',args, 'Invalid Parent Department');
        throw(new Error('Invalid Parent Department!'));
      }

      if(args.leaveTypesIDs?.length) {
        if(!await Leavetype.find({ _id: { $in: args.leaveTypesIDs }})) {
          generateAuditTrail(null, null, me, tenantid, 'Department', 'Find Assigned Leave Types', 'Create', 'Warning', args, 'Invalid Leave Type Assigned!');
          throw(new Error('Invalid Leave Type Assigned!'));
        }
      }

      Department.findByIdAndUpdate(department._id, {
        $set: {
          ...args,
          tenantid,
          departmentLead: args.departmentLeadId,
          leaveTypes: args.leaveTypesIDs,
          parentDepartment: args.parentDepartmentId,
          audit: {
            ...department.audit,
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newDepartment) => {
        if(newDepartment) {
          generateAuditTrail(department._doc, newDepartment._doc, me, tenantid, 'Department', 'Find Department', 'Edit','Success',args, 'Department Updated');
          Department.findById(department._id)
            .populate('departmentLead', 'username email role')
            .populate('parentDepartment', 'name')
            .populate('leaveTypes','id name')
            .exec(async function (err, newDepartment) {
              if (err) return reject(new Error('Unable to update Department!'));
              resolve(newDepartment);
            });

        } else {
          generateAuditTrail(null, null, me, tenantid, 'Department', 'Find Department', 'Edit','Failed',args, 'Unable to update Department');
          reject(new Error('Unable to update Department!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editDepartment;
