const Task = require('../../../models/tasks');

const approveRejectTask = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const entity = await Task.findOne(
      {
        $and: [
          { userID: args.userID },
          { _id: args._id },
          { tenantid }
          // {
          //   $or: [
          //     { startDate: { $lte: new Date(args.startDate) }, endDate: { $gte: new Date(args.endDate) } },
          //     { startDate: { $gt: new Date(args.startDate) }, endDate: { $lt: new Date(args.endDate) } }
          //   ]
          // }
        ]
      }
    );
    if (!entity) {
      reject(new Error('Task Does Not Exist!'));
    } else {
      await Task.findByIdAndUpdate(entity._id, {
        $set: {
          ...args,
          tenantid,
          audit: {
            ...entity.audit,
            modified_at: new Date(),
            modified_by: me?.user?.username
          }
        }
      }, { new: true, useFindAndModify: false }, (err, newEntity) => {
        if(newEntity) {
          Task.findById(newEntity._id)
            .populate('user', ['eCode', 'username', 'title'])
            .populate('createdBy', ['eCode', 'username', 'title'])
            .exec(async function (err, newEntity) {
              if (err) return reject(new Error('Unable to update Task!'));
              resolve(newEntity);
            });
        } else {
          reject(new Error('Unable to update Task!'));
        }
      });
    }
  }
  catch (e) {
    reject(e);
  }
});

module.exports = approveRejectTask;
