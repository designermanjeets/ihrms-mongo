const JobTitle = require('../../../models/job-titles');
const generateAuditTrail = require('../../../utils/audit-trails');
const editJobTitle = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await JobTitle.findOne({ $or: [{ name: args.name, $and: [{ tenantid }] }, { _id: args._id, $and: [{ tenantid }]  }] });
    if (!entity) {
      generateAuditTrail(null, null, me, tenantid, 'JobTitle', 'Find JobTitle', 'Edit','Failed',args, 'Job Title  Does Not exist');
      reject(new Error('Job Title Does Not Exist!'));
    } else {
      JobTitle.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          tenantid,
          designation: args.designationId,
          audit: {
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
          generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'JobTitle', 'Find JobTitle', 'Edit','Success',args, ' Job Title updated');
          JobTitle.findById(newEntity._id)
            .populate('designation', 'name')
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update Job Title!'));
              resolve(newEntity);
            });
        } else {
          generateAuditTrail(null, null, me, tenantid, 'JobTitle', 'Find JobTitle', 'Edit','Failed',args, 'Unable to update Job Title');
          reject(new Error('Unable to update Job Title!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editJobTitle;
