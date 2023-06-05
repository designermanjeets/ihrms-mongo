const Task = require('../../../models/tasks');
const generateAuditTrail = require('../../../utils/audit-trails');
const editTask = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Task.findOne(
      {
        $and: [
          { userID: args.userID },
          { tenantid },
          {
            $or: [
              { startDate: { $lte: new Date(args.startDate) }, endDate: { $gte: new Date(args.endDate) } },
              { startDate: { $gt: new Date(args.startDate) }, endDate: { $lt: new Date(args.endDate) } }
            ]
          }
        ]
      }
    );
    if (!entity || !entity?.length) {
      generateAuditTrail(null, null, me, tenantid, 'Task', 'Find Task', 'Edit', 'Failed', args, 'Task Does Not Exist!');
      
      reject(new Error('Task Does Not Exist!'));
    } else {
      await Task.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          tenantid,
          user: args.userID,
          createdBy: args.createdByID,
          audit: {
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
          generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'Task', 'Find Task', 'Edit', 'Success', args, 'Task updated!');
      
          Task.findById(newEntity._id)
            .populate('user', ['eCode', 'username', 'title'])
            .populate('createdBy', ['eCode', 'username', 'title'])
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update Task!'));
              resolve(newEntity);
            });
        } else {
          generateAuditTrail(null, null, me, tenantid, 'Task', 'Find Task', 'Edit', 'Failed', args, 'Unable to update Task!');
          reject(new Error('Unable to update Task!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = editTask;
