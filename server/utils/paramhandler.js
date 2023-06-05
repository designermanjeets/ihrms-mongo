const mongoose = require('mongoose'); // ES5 or below
const ObjectId = require('mongoose').Types.ObjectId;

const paramHandler= (qry)  => {
  let param = {};
  if(qry.argument && qry.query) {
    param = {
      [qry.argument]: {
          '$regex':qry.query
        }
    }
  }
  if(qry.dates) {
    if(qry.dates.gte) {
      let gte = new Date(qry.dates.gte);
      param = {
        ...param, 
        'startDate': { $gte: gte }, // For Leave Requets
        'date': { $gte: gte.setDate(gte.getDate() - 1 ) } // For Attendance etc
      }
    }
    if(qry.dates.lt) {
      let lt = new Date(qry.dates.lt);
      param = {
        ...param, 
        'endDate': { $lt: lt }, // For Leave Requets
        'date': { $lt: lt.setDate(lt.getDate() - 1 ) } // For Attendance etc
      }
    }
  }
  if(qry.id) {
    param = {
      ...param,
      _id: mongoose.Types.ObjectId(qry.id),
    }
  }
  if(qry.departmentId) { 
    param = {
      ...param,
      department: mongoose.Types.ObjectId(qry.departmentId),
      departmentId: mongoose.Types.ObjectId(qry.departmentId),
      status: true
    }
  }
  if(qry.unitDepartmentId) { 
    param = {
      ...param,
      unitDepartmentId: mongoose.Types.ObjectId(qry.unitDepartmentId),
      unitDepartment: mongoose.Types.ObjectId(qry.unitDepartmentId)
    }
  }
  if(qry.tenantid) {
    param = {
      ...param,
      tenantid: mongoose.Types.ObjectId(qry.tenantid),
    }
  }
  if(qry.userID) {
    param = {
      ...param,
      userId: mongoose.Types.ObjectId(qry.userID),
      userID: mongoose.Types.ObjectId(qry.userID),
    }
  }
  if(qry.eCode) {
    param = {
      ...param, 
      eCode : qry.eCode
    }
  }
  if(qry.month) { 
    param = {
      ...param, 
      month : qry.month
    }
  }
  if(qry.approvers) { 
    param = {
      ...param, 
      'approvers' : { $elemMatch : { 'approverID' : ObjectId(qry.approvers[0].approverID) } }
    }
  }
  return param
};

module.exports = { paramHandler };
