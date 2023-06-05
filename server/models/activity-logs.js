const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activityLogsSchema = new Schema({
    event_summary: {
        operation_name: { type: String },
        timestamp: { type: Date, default: Date.now() },
        event_initiated_by_user: { type: String },
        status: { type: String },
        tenant_id: { type: String },
        success_or_error_msg: { type: String }
    },
    change_history: {
        change_type: { type: String },
        change_table: { type: String },
        changedFields: [{ type: Object }],
        old_object: { type: Object },
        new_object: { type: Object },
        request_parameters: { type: Object },
    },
}, { collection: 'ActivityLogs' }, { timestamps: true } );


module.exports = mongoose.model('ActivityLogs', activityLogsSchema);
