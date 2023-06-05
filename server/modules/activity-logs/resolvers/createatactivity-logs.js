const ActivityLogs = require('../../../models/activity-logs');

const createActivityLogs = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {
    const newEntity = await new ActivityLogs({
      ...{
        ...args,
      }
    });
    if(!newEntity) {
      reject(new Error('Unable to create Activity Logs!'));
    }
    
    await newEntity.save();
    ActivityLogs.findById(newEntity._id)
      .exec( async function (err, newEntity) {
        if (err) return reject(new Error('Unable to create Activity Logs!'));
        resolve(newEntity);
    });
    
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createActivityLogs;
