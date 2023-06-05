const Designation = require('../../../models/designations');
const Department = require('../../../models/departments');
const mongoose = require('mongoose');
const generateAuditTrail = require('../../../utils/audit-trails');
const ObjectId = require('mongoose').Types.ObjectId;
const createDesignations = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    console.log(args)
    const entity = await Designation.findOne({ 
     // $or: [{ name: args.name, $and: [{ tenantid }] }]
        $and: [
          { name: args.name },
          { departmentId: ObjectId(args.departmentId) },
          { tenantid: ObjectId(tenantid) }
        ]
    });
    if (entity) {
      generateAuditTrail(null, null, me, tenantid, 'Designation ', 'Create Designation ', 'Create', 'Failed', args, 'Designation already exist');
      throw(new Error('Designation already exist!'));
    } else {
     // generateAuditTrail(null, null, me, tenantid, 'Designation ', 'Create Designation ', 'Create', 'Failed', args, 'Invalid Department ID');
      if(!await Department.findById(mongoose.Types.ObjectId(args.departmentId)) && args.departmentId)
       {  
        generateAuditTrail(null, null, me, tenantid, 'Designation ', 'Create Designation ', 'Create', 'Warning', args, 'Invalid Department ID');
        throw(new Error('Invalid Department ID!'));
      }
      if(!await Designation.findById(mongoose.Types.ObjectId(args.parentDesignationId)) && args.parentDesignationId) 
      {   
        generateAuditTrail(null, null, me, tenantid, 'Designation ', 'Create Designation ', 'Create', 'Warning', args, 'Invalid Parent Designation');
        throw(new Error('Invalid Parent Designation!'));
      }
      const newEntity = await new Designation({
        ...{
          ...args,
          tenantid,
          department: args.departmentId,
          parentDesignation: args.parentDesignationId,
          audit: {
            created_at: new Date(),
            created_by: me?.user?.username
          }
        }
      });
      if(!newEntity) {
        generateAuditTrail(null, null, me, tenantid, 'Designation ', 'Create Designation ', 'Create', 'Failed', args, 'Unable to create Designation');
        reject(new Error('Unable to create Designation!'));
      }
      generateAuditTrail(null, newEntity._doc, me, tenantid, 'Designation', 'Create Designation ', 'Create', 'Success', args, 'Designation Created');
      await newEntity.save();
      Designation.findById(newEntity._id)
        .populate('department', 'name')
        .populate('parentDesignation', 'name')
        
        .exec( async function (err, newEntity) {
          if (err) return reject(new Error('Unable to create Designation!'));
          resolve(newEntity);
        });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createDesignations;
