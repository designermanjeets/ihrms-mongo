const Task = require('../../../models/tasks');
const User = require('../../../models/user');
const mongoose = require('mongoose');
const generateAuditTrail = require('../../../utils/audit-trails');
const createTask = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
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
    generateAuditTrail(null, null, me, tenantid, 'Task', 'Find Task', 'Create','Failed',args, 'Task already exist!');
    if (entity || entity?.length) {
      reject(new Error('Task already exist!'));
    } else {
      const newEntity = await new Task({
        ...{
          ...args,
          tenantid,
          user: args.userID,
          createdBy: args.createdByID,
          audit: {
            created_at: new Date(),
            created_by: me?.user?.username
          }
        }
      });
      if(!newEntity) {
        generateAuditTrail(null, null, me, tenantid, 'Task', 'Create Task', 'Create','Failed',args, 'Unable to create Task!');
        reject(new Error('Unable to create Task!'));
      }
      else{
        generateAuditTrail(null, newEntity.doc, me, tenantid, 'Task', 'Create Task', 'Create', 'Success', args,'Task created!');

      await newEntity.save();
      Task.findById(newEntity._id)
        .populate('user', 'username email role eCode')
        .populate('createdBy', 'username email role eCode')
        .exec( async function (err, newEntity) {
          if (err) return reject(new Error('Unable to create Task!'));
          resolve(newEntity);
      })};
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createTask;
