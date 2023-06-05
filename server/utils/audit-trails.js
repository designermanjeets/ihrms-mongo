const mongoose = require('mongoose'); // ES5 or below
const ActivityLogs = require('../models/activity-logs');

// generateAuditTrail(entity._doc, newEntity._doc, me, tenantid, 'Tenant', 'Edit', 'Edit Tenant', 'Success', args, 'Tenant Does Not Exist!') // Sample
const generateAuditTrail = async (entity_doc, newEntity_doc, me, tenantid, table_name, change_type, operation_name, op_status, request_parameters, success_or_error_msg) => {
    var changedFields = [];

    if(operation_name === 'Edit') {
        if(entity_doc && newEntity_doc) {

            for( var p in entity_doc ){
                if ( !deepCompare(entity_doc[p], newEntity_doc[p]) ){
                    if(p !== '_id' && p !== 'audit') {
                        changedFields.push({
                            object_id: entity_doc._id,
                            property: p,
                            old_value: entity_doc[p],
                            new_value: newEntity_doc[p]
                        })
                    }
                }
            }
        
            await ActivityLogs.create({
                change_history: {
                    change_table: table_name,
                    change_type: change_type,
                    changedFields: changedFields,
                    new_object: null, // newEntity_doc,
                    old_object: null, // entity_doc
                },
                event_summary: {
                    timestamp: new Date(Date.now()),
                    event_initiated_by_user: me.user.username,
                    operation_name: operation_name,
                    status: op_status,
                    tenant_id: tenantid,
                    success_or_error_msg: success_or_error_msg
                }
            });
        } else {
            await ActivityLogs.create({
                change_history: {
                    change_table: table_name,
                    change_type: change_type,
                    changedFields: null,
                    new_object: null,
                    old_object: null,
                    request_parameters: request_parameters
                },
                event_summary: {
                    timestamp: new Date(Date.now()),
                    event_initiated_by_user: me.user.username,
                    operation_name: operation_name,
                    status: op_status,
                    tenant_id: tenantid,
                    success_or_error_msg: success_or_error_msg
                }
            });
        }
    }
    if(operation_name === 'Create') {
        await ActivityLogs.create({
            change_history: {
                change_table: table_name,
                change_type: change_type,
                changedFields: null,
                new_object: newEntity_doc,
                old_object: null,
                request_parameters: request_parameters
            },
            event_summary: {
                timestamp: new Date(Date.now()),
                event_initiated_by_user: me?.user?.username,
                operation_name: operation_name,
                status: op_status,
                tenant_id: tenantid,
                success_or_error_msg: success_or_error_msg
            }
        });
    }
};


const deepCompare = (val1, val2) => {
    var isSame = true;
    if (val1 !== val2 && typeof val1 == "boolean" && typeof val2 == "boolean") {
        isSame = false;
    } else {
        for (var p in val1) {
            if (typeof (val1[p]) === "object") {
                var objectValue1 = val1[p],
                    objectValue2 = val2[p];
                for (var value in objectValue1) {
                    isSame = deepCompare(objectValue1[value], objectValue2[value]);
                    if (isSame === false) {
                        return false;
                    }
                }
            } else {
                if (val1 !== val2) {
                    isSame = false;
                }
            }
        }
    }
    return isSame;
};

module.exports = generateAuditTrail;
