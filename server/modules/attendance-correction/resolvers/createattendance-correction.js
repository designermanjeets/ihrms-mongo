const AttendanceCorrection = require('../../../models/attendance-corrections');
const User = require('../../../models/user');

const createAttendanceCorrection = (_, args, { me, tenantid }) => new Promise(async (resolve, reject) => {
  try {

    let approvers = [];
    const user = await User.findById(args.userId);
    if(user) {
      if(user.reportingManagerId) {
        approvers = await populateManager(user.reportingManagerId);
        managers = []; // Empty Managers after storing to another object
      }
    }

    const newEntity = await new AttendanceCorrection({
      ...{
        ...args,
        user: args.userId,
        toManager: args.toManagerID,
        approvers: approvers,
        tenantid,
        audit: {
          created_at: new Date(),
          created_by: me?.user?.username
        }
      }
    });
    if(!newEntity) {
      reject(new Error('Unable to create Attendance Correction!'));
    }
    
    await newEntity.save();
    AttendanceCorrection.findById(newEntity._id)
      .populate(
        { 
          path: 'user', 
          select: ['email', 'username', 'eCode', 'role'], 
          populate: { path: 'role', select: 'role_name' }, 
          populate: { path: 'employeeShifts', select: 'name' }
        }
      )
      .populate('toManager', ['eCode', 'username', 'title'])
      .exec( async function (err, newEntity) {
        if (err) return reject(new Error('Unable to create Attendance Correction!'));
        resolve(newEntity);
    });
    
  }
  catch (e) {
    reject(e);
  }
});

module.exports = createAttendanceCorrection;

const populateManager = async (node, isLastManager = false) => {

  if (node === null || isLastManager) {
    return false;
  }

  const reportingManager = await User.findById(node);

  if(reportingManager) {
    if (!reportingManager.reportingManagerId) { 
      isLastManager = true;
      node = reportingManager;
    } else {
      node = reportingManager.reportingManagerId;
    }

    await populateManager(node, isLastManager);

    node !== null && managers.push({
      approver: reportingManager._id,
      approverName: reportingManager.username,
      approverECode: reportingManager.eCode,
      approverID: reportingManager._id,
      approverLevel: managers.length + 1,
      approverStatus: 'Pending',
      approverComment: ''
    });
  }

  return managers;
};