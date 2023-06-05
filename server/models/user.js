const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const auditSchema = mongoose.Schema({
  created_at: Date,
  created_by: String,
  modified_at: Date,
  modified_by: String,
});

const userSchema = new Schema({

  // Official Details
  eCode: { type: String, immutable: true },
  username: { type: String, required: true, immutable: true },
  password: { type: String }, // select: false
  title: { type: String },
  name: { type: String },
  surname: { type: String },
  gender: { type: String },
  dob: { type: Date }, // Date of Birth
  maritalStatus: { type: String },
  bloodGroup: { type: String },
  nationality: { type: String },
  ethnicity: { type: String },
  cast: { type: String },
  religion: { type: String },
  jobTitleId: { type: mongoose.Schema.Types.ObjectId },
  jobTitle: { type: mongoose.Schema.Types.ObjectId, ref: 'JobTitles' },
  unitDepartmentId: { type: mongoose.Schema.Types.ObjectId },
  unitDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Departments' },
  designationId: { type: mongoose.Schema.Types.ObjectId },
  designation: { type: mongoose.Schema.Types.ObjectId, ref: 'Designations' },
  reportingManagerId: { type: mongoose.Schema.Types.ObjectId },
  reportingManager: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  employeeShiftIds: [{ type: mongoose.Schema.Types.ObjectId }],
  employeeShifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shifts' }],
  timeOfficePolicy: [{ type: String }],
  punchInADay: [{ type: String }],
  leaveTypesId: [{ type: mongoose.Schema.Types.ObjectId }],
  leaveTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LeaveTypes' }],
  leaveTypesNBalance: [{ 
    name: { type: String, required: true, immutable: true },
    days: { type: Number, default: 0 },
    remaining_days: { type: Number, default: null },
    carryForward: { type: Boolean, default: false },
    carryForwardDays: { type: Number, default: 0 },
    countWeekends: { type: Boolean, default: 0 },
    comments: String,
    status: { type: Boolean, default: true },
    tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
    audit: auditSchema,
   }],
  leaveRequestsId: [{ type: mongoose.Schema.Types.ObjectId }],
  leaveRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LeaveRequests' }],
  roleId: { type: mongoose.Schema.Types.ObjectId },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  employeeTypeId: { type: mongoose.Schema.Types.ObjectId },
  employeeType: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeTypes' },
  modeOfEmploymentId: { type: mongoose.Schema.Types.ObjectId },
  modeOfEmployment: { type: mongoose.Schema.Types.ObjectId, ref: 'ModeOfEmployments' },
  doj: { type: Date }, // Date of Joining || Joining Date
  doc: { type: Date }, // Date of Confirmation
  dor: { type: Date }, // Date of Relieving
  status: { type: Boolean, default: true },
  overtime: { type: Boolean, default: false },
  salary: { type: mongoose.Schema.Types.ObjectId, ref: 'Salary' },
  salaryId: { type: mongoose.Schema.Types.ObjectId },

  // Personal Details
  guardianName: { type: String },
  relation: { type: String },
  panId: { type: String }, // PAN No
  aadharId: { type: String },
  email: { type: String },
  homePhone: { type: String },
  personalPhone: { type: String },
  emergencyContact: { type: String },
  pinCode: { type: String },
  currentAddress: { type: String },
  permanentAddress: { type: String },

  // Bank Details
  bankName: { type: String },
  accountNo: { type: String },
  IFSCCode: { type: String },
  branch: { type: String },
  location: { type: String },
  ESINo: { type: String },
  PFNo: { type: String },
  UANNo: { type: String },
  PensionNo: { type: String },

  // Qualification Details
  qualification: [
    {
      educationName: { type: String },
      boardUniversity: { type: String },
      fromMonthYear: { type: Date },
      toMonthYear: { type: Date },
      percentage: { type: String },
      schoolCollege: { type: String },
      educationType: { type: String },
      educationGap: { type: Boolean },
      educationGapComments: { type: String },
    }
  ],

  // Experience Details
  experience: [
    {
      companyName: { type: String },
      fromMonthYear: { type: Date },
      toMonthYear: { type: Date },
      reasonForLeaving: { type: String },
      isCurrentCompany: { type: Boolean },
      experienceComments: { type: String },
    }
  ],

  //
  tenantAccess: [{ tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants' } }],
  tenantid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true },
  audit: auditSchema,
}, { collection: 'Users' });


module.exports = mongoose.model('Users', userSchema);
