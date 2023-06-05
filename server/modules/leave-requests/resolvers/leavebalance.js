const { paramHandler } = require('../../../utils/paramhandler');
const Users = require('../../../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

const getLeaveBalance = async (_, args, { me, tenantid })  => new Promise(async (resolve, reject) => {
  const param = me?.user?.username === 'gonngod' ? paramHandler({...args.query}): paramHandler({...args.query, tenantid})
  try {
    let aggregation = [];
    
    if (args.query.approvers && args.query.approvers.length && args.query.approvers[0].approverID) {
        aggregation.push({
            $match: {
                $and: [
                  { tenantid: { $eq: ObjectId(tenantid) } },
                  { reportingManagerId : { $eq: ObjectId(args.query.approvers[0].approverID) } }
                ]
              }
        })
    };

    if (args.query.userID) {
        aggregation.push({
            $match: {
                $and: [
                  { tenantid: { $eq: ObjectId(tenantid) } },
                  { _id: { $eq: ObjectId(args.query.userID) } },
                ]
              }
        })
    }

    await Users.aggregate(
        aggregation.concat([
            {
              $graphLookup: {
                  from: "Users",
                  startWith: "$reportingManagerId",
                  connectFromField: "_id",
                  connectToField: "reportingManagerId",
                  as: "reportees",
                  maxDepth: 9,
                  depthField: "level"
              }
          },
          { $limit:40 }, // Server Low Memory Please Upgrade
          {
              $project: {
                  "reportees._id":1,
                  "reportees.eCode":1,
                  "reportees.username":1,
                  "reportees.leaveTypesNBalance":1,
                  "reportees.reportingManagerId":1,
                  "reportees.level":1
              }
          },
          {
              $unwind: "$reportees"
          },
          {
              $sort: { "reportees.level": -1 }
          },
          {
              $group: {
                  _id: "$_id",
                  reportees: { $push: "$reportees" }
              }
          },
          {
              $addFields: {
                  reportees: {
                      $reduce: {
                          input: "$reportees",
                          initialValue: {
                              currentLevel: -1,
                              currentLevelEmployees: [],
                              previousLevelEmployees: []
                          },
                          in: {
                              $let: {
                                  vars: {
                                      prev: { 
                                          $cond: [ 
                                              { $eq: [ "$$value.currentLevel", "$$this.level" ] }, 
                                              "$$value.previousLevelEmployees", 
                                              "$$value.currentLevelEmployees" 
                                          ] 
                                      },
                                      current: { 
                                          $cond: [ 
                                              { $eq: [ "$$value.currentLevel", "$$this.level" ] }, 
                                              "$$value.currentLevelEmployees", 
                                              [] 
                                          ] 
                                      }
                                  },
                                  in: {
                                      currentLevel: "$$this.level",
                                      previousLevelEmployees: "$$prev",
                                      currentLevelEmployees: {
                                          $concatArrays: [
                                              "$$current", 
                                              [
                                                  { $mergeObjects: [ 
                                                      "$$this", 
                                                      { reportees: { $filter: { input: "$$prev", as: "e", cond: { $eq: [ "$$e.reportingManagerId", "$$this._id"  ] } } } } 
                                                  ] }
                                              ]
                                          ]
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
          },
          {
              $addFields: { reportees: "$reportees.currentLevelEmployees" }
          }
          ])
      ).allowDiskUse(true).option({ allowDiskUse: true }).exec(async function (e, d) {
        if (e) return reject(new Error(e));
        if(me?.user?.username !== 'gonngod') {
          d = d.filter(res => res.username !== 'gonngod');
        }
         resolve(d.length ? d[0].reportees: d); // Remove Self Level
      });
  }
  catch (e) {
    reject(e);
  }
});

module.exports = getLeaveBalance;
