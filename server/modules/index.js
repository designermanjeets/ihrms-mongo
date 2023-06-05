const { makeExecutableSchemaFromModules } = require('../utils/modules')

const auth = require('./auth')
const roles = require('./roles')
const departments = require('./departments')
const designations = require('./designations')
const employee_types = require('./employee-type')
const job_titles = require('./job-title')
const settings_approvals = require('./settings-approval')
const mode_of_employment = require('./mode-of-employment')
const tenants = require('./tenants')
const shifts = require('./shifts')
const shift_rosters = require('./shift-roster')
const attendances = require('./attendances')
const leave_types = require('./leave-types')
const leave_requests = require('./leave-requests')
const holidays = require('./holidays')
const timesheets = require('./timesheets')
const payheads = require('./pay-heads')
const attendance_requests = require('./attendance-request')
const tasks = require('./tasks')
const pay_formulas = require('./pay-formula')
const pay_structures = require('./pay-structure')
const pay_schedules = require('./pay-schedule')
const attendance_corrections = require('./attendance-correction')
const activity_logs = require('./activity-logs')
const expense_claims = require('./expense-claims')
const loan_advances = require('./loan-advances')
const salary = require('./salary')
const salary_revisions = require('./salary-revisions')
const payroll = require('./payroll')
const attendance_sql = require('./attendance-sql')
const notification = require('./notification')

module.exports = makeExecutableSchemaFromModules({
  modules: [
    auth,
    roles,
    departments,
    designations,
    employee_types,
    job_titles,
    settings_approvals,
    mode_of_employment,
    tenants,
    shifts,
    shift_rosters,
    attendances,
    leave_types,
    leave_requests,
    holidays,
    timesheets,
    payheads,
    attendance_requests,
    tasks,
    pay_formulas,
    pay_structures,
    pay_schedules,
    attendance_corrections,
    activity_logs,
    expense_claims,
    loan_advances,
    salary,
    salary_revisions,
    payroll,
    attendance_sql,
    notification
  ]
})
