const JobTitle = require('../../../models/job-titles');
const mongoose = require('mongoose');
const Designation = require('../../../models/designations');
const generateAuditTrail = require('../../../utils/audit-trails');
const createJobTitle = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await JobTitle.findOne({ $or: [{ name: args.name, $and: [{ tenantid }]  }] });
    if (entity) {
      generateAuditTrail(null, null, me, tenantid, 'JobTitle', 'Find JobTitle', 'Create','Failed',args, 'Job Title already exist');
      reject(new Error('Job Title already exist!'));
    } else {
      if(!await Designation.findById(mongoose.Types.ObjectId(args.designationId)) && args.designationId) {
        generateAuditTrail(null, null, me, tenantid, 'JobTitle', 'Find JobTitle', 'Create','Warning',args, 'Invalid Designation!');
        reject(new Error('Invalid Designation!'));
      }
      const newEntity = await new JobTitle({
        ...{
          ...args,
          tenantid,
          designation: args.designationId,
          audit: {
            created_at: new Date(),
            created_by: me?.user?.username
          }
        }
      });
      if(!newEntity) {
        generateAuditTrail(null, null, me, tenantid, 'JobTitle', 'Find JobTitle', 'Create','Failed',args, 'Unable to create Job Title!');
        reject(new Error('Unable to create Job Title!'));
      }generateAuditTrail(null, newEntity._doc, me, tenantid, 'JobTitle', 'Find JobTitle', 'Create','Success',args, 'Job Title created!');
      await newEntity.save();
      JobTitle.findById(newEntity._id)
        .populate('designation', 'name')
        .exec( async function (err, newEntity) {
          if (err) return reject(new Error('Unable to create Job Title!'));
          resolve(newEntity);
        });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createJobTitle;
