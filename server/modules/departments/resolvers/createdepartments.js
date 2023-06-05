const Department = require('../../../models/departments');
const mongoose = require('mongoose');
const User = require('../../../models/user');
const Leavetype = require('../../../models/leave-types');
const ObjectId = require('mongoose').Types.ObjectId;
const generateAuditTrail = require('../../../utils/audit-trails');

const createDepartment = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const department = await Department.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }] });
    if (department) {
      generateAuditTrail(null, null, me, tenantid, 'Department', 'Find Department', 'Create','Failed',args, 'Department already exist!');
      throw(new Error('Department already exist!'));
    } else {

      if(!ObjectId.isValid(args.parentDepartmentId)) { delete args.parentDepartmentId };
      if(!ObjectId.isValid(args.departmentLeadId)) { delete args.departmentLeadId };
      args.leaveTypesIDs.length && args.leaveTypesIDs.forEach((item, idx) => !ObjectId.isValid(item) && delete args.leaveTypesIDs[idx]);

      if(!await User.findById(mongoose.Types.ObjectId(args.departmentLeadId)) && ObjectId.isValid(args.departmentLeadId) && args.departmentLeadId) {
        generateAuditTrail(null, null, me, tenantid, 'Department', 'Find Department', 'Create','Warning',args, 'Invalid DepartmentLead ID!');
        throw(new Error('Invalid DepartmentLead ID!'));
      }

      if(ObjectId.isValid(args.parentDepartmentId) && args.parentDepartmentId) {
        if(!await Department.findById(mongoose.Types.ObjectId(args.parentDepartmentId))) {
          generateAuditTrail(null, null, me, tenantid, 'Department', 'Find Department', 'Create','Warning',args, 'Invalid Parent Department!');
          throw(new Error('Invalid Parent Department!'));
        }
      }

      if(args.leaveTypesIDs?.length) {
        if(!await Leavetype.find({ _id: { $in: args.leaveTypesIDs }})) {
          generateAuditTrail(null, null, me, tenantid, 'Department', 'Find Assigned Leave Types', 'Create', 'Warning', args, 'Invalid Leave Type Assigned!');
          throw(new Error('Invalid Leave Type Assigned!'));
        }
      }

      const newDepartment= await new Department({
        ...{
          ...args,
          tenantid,
          departmentLead: args.departmentLeadId,
          leaveTypes: args.leaveTypesIDs,
          parentDepartment: args.parentDepartmentId || null,
          audit: {
            created_at: new Date(),
            created_by: me?.user?.username
          }
        }
      });
      if(!newDepartment) {
        generateAuditTrail(null, null, me, tenantid, 'Department', 'Find Department', 'Create','Failed',args, 'Unable to create Department!');
        throw(new Error('Unable to create Department!'));
      } else {
        generateAuditTrail(null, newDepartment._doc, me, tenantid, 'Department', 'Find Department', 'Create','Success', args, '  Department Created !');
        await newDepartment.save();
        Department.findById(newDepartment._id)
          .populate('departmentLead', 'username email role')
          .populate('parentDepartment', 'name')
          .populate('leaveTypes','id name')
          .exec( async function (err, newDepartment) {
            if (err) return reject(new Error('Unable to create Department!'));
            resolve(newDepartment);
          });
      }
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createDepartment;
