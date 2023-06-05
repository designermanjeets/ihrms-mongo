const Timesheet = require('../../../models/timesheets');
const mongoose = require('mongoose');
const generateAuditTrail = require('../../../utils/audit-trails');

const createTimesheet = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Timesheet.findOne({ $or: [{ _id: args._id, $and: [{ tenantid }] }] });
    if (entity) {

      generateAuditTrail(null, null, me, tenantid, 'Timesheet', 'Find Timesheet', 'Create','Failed',args, 'Timesheet already exist!');


      reject(new Error('Timesheet already exist!'));
    } else {
      const newEntity = await new Timesheet({
        ...{
          ...args,
          tenantid,
          assignedTo: args.assignedToID,
          createdBy: args.createdByID,
          audit: {
            created_at: new Date(),
            created_by: me?.user?.username
          }
        }
      });
      if(!newEntity) {
        generateAuditTrail(null, null, me, tenantid, 'Timesheet', 'Create Timesheet', 'Create', 'Failed', args, 'Unable to create Timesheet!');
        // Audit Stuff Ends
        reject(new Error('Unable to create Timesheet!'));
      }
      await newEntity.save();
        
      Timesheet.findById(newEntity._id)
        .populate('assignedTo', 'username email role eCode unitDepartmentId')
        .populate('createdBy', 'username email role eCode unitDepartmentId')
        .exec( async function (err, timesheet) {


          if (!timesheet) {
            generateAuditTrail(null, null, me, tenantid, 'Timesheet', 'Create Timesheet', 'Create', 'Failed', args, 'Unable to create Timesheet!');
          return reject(new Error('Unable to create Timesheet!'));
          }else{
            generateAuditTrail(null, newEntity.doc, me, tenantid, 'Timesheet', 'Create Timesheet', 'Create', 'Success', args,'Timesheet created!');
          timesheet.departmentID = timesheet.assignedTo.unitDepartmentId;
          timesheet.department = timesheet.assignedTo.unitDepartmentId;
          await timesheet.populate('department', 'name')
          await timesheet.save();
          resolve(timesheet);
    }});
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createTimesheet;
