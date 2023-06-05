const Timesheet = require('../../../models/timesheets');
const generateAuditTrail = require('../../../utils/audit-trails');

const editTimesheet = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Timesheet.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }, { _id: args._id, $and: [{ tenantid }] }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'Timesheet', 'Find Timesheet', 'Edit', 'Failed', args, 'Timesheet Does Not Exist!');
      
      reject(new Error('Timesheet Does Not Exist!'));
    } else {
      Timesheet.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          assignedTo: args.assignedToID,
          createdBy: args.createdByID,
          tenantid,
          audit: {
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
          Timesheet.findById(newEntity._id)
            .populate('assignedTo', 'username email role eCode unitDepartmentId')
            .populate('createdBy', 'username email role eCode unitDepartmentId')
            .exec( async function (err, timesheet) {

              if (!timesheet) {
                generateAuditTrail(null, null, me, tenantid, 'Timesheet', 'Find User', 'Edit', 'Failed', args, 'Unable to update Timesheet!');
                return reject(new Error('Unable to update Timesheet!'));
              }
             else{  
              generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'Timesheet', 'Find User', 'Edit', 'Success', args, 'update Timesheet success!');

              timesheet.departmentID = timesheet.assignedTo?.unitDepartmentId;
              timesheet.department = timesheet.assignedTo?.unitDepartmentId;
              await timesheet.populate('department', 'name')
              await timesheet.save();
              resolve(timesheet);
         } });
        } else {
          generateAuditTrail(null, null, me, tenantid, 'Timesheet', 'Edit Timesheet', 'Edit', 'Failed', args, 'Unable to update Timesheet!');
          reject(new Error('Unable to update Timesheet!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editTimesheet;
