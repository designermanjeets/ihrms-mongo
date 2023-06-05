const Department = require('../../../models/departments');
const mongoose = require('mongoose');
const Designation = require('../../../models/designations');
const generateAuditTrail = require('../../../utils/audit-trails');
const editDesignations = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Designation.findOne({ $or: [{ name: args.name }, { _id: args._id }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'Designation ', 'edit Designation ', 'Edit', 'Failed', args, 'Designation Does Not Exist!');
      throw(new Error('Designation Does Not Exist!'));
    } else {
      if(!await Department.findById(mongoose.Types.ObjectId(args.departmentId)) && args.departmentId) 
      {
        generateAuditTrail(null, null, me, tenantid, 'Designation ', 'edit Designation ', 'Edit', 'Warning', args, 'Invalid Department ID!');
        throw(new Error('Invalid Department ID!'));
      }
      if(!await Designation.findById(mongoose.Types.ObjectId(args.parentDesignationId)) && args.parentDesignationId) 
      {
        generateAuditTrail(null, null, me, tenantid, 'Designation ', 'edit Designation ', 'Edit', 'Warning', args, 'Invalid Parent Designation!');
        throw(new Error('Invalid Parent Designation!'));
      }
       Designation.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          tenantid,
          department: args.departmentId,
          parentDesignation: args.parentDesignationId,
          audit: {
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
          generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'Designation ', 'edit Designation ', 'Edit', 'Success', args, 'Designation updated!');
          Designation.findById(newEntity._id)
            .populate('department', 'name')
            .populate('parentDesignation', 'name')
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update Designation!'));
              resolve(newEntity);
            });
        } else {       
        generateAuditTrail(null, null, me, tenantid, 'Designation ', 'edit Designation ', 'Edit', 'Failed', args, 'Unable to update Designation!');
          reject(new Error('Unable to update Designation!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editDesignations;
