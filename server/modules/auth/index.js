const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
// @isAuthenticated directive to Authenticate
const typeDefs = gql`
  extend type Query {
    me: User @isAuthenticated
    user(email: String!): User
    getUsers(query: Pagination!): [User]
    getAllUsers(query: Pagination!): [User]
  }

  extend type Mutation {
    login(
      username: String
      email: String!
      password: String!
    ): AuthData

    createUser(
      eCode: String!
      username: String!
      password: String!
      title: String
      name: String
      surname: String
      gender: String
      dob: ISODate
      maritalStatus: String
      bloodGroup: String
      nationality: String
      ethnicity: String
      cast: String
      religion: String
      jobTitleId: ID
      jobTitle: JobTitleInputs,
      unitDepartmentId: ID
      unitDepartment: DepartmentInputs,
      designationId: ID
      designation: DesignationInputs,
      reportingManagerId: ID
      reportingManager: UserInputs,
      employeeShiftIds: [ID]
      employeeShifts: [ShiftInputs],
      timeOfficePolicy: [String]
      punchInADay: [String]
      leaveTypesId: [ID]
      leaveTypes: [LeaveTypeInputs]
      leaveTypesNBalance: [LeaveTypeInputs]
      leaveRequestsId: [ID]
      leaveRequests: [LeaveRequestInputs]
      roleId: ID
      role: RoleInputs,
      employeeTypeId: ID
      employeeType: EmployeeTypeInputs,
      modeOfEmploymentId: ID
      modeOfEmployment: ModeOfEmploymentInputs,
      doj: ISODate
      doc: ISODate
      dor: ISODate
      status: Boolean
      overtime: Boolean
      salary: SalaryInputs
      salaryId: ID
      guardianName: String
      relation: String
      panId: String
      aadharId: String
      email: String
      homePhone: String
      personalPhone: String
      emergencyContact: String
      pinCode: String
      currentAddress: String
      permanentAddress: String
      bankName: String
      accountNo: String
      IFSCCode: String
      branch: String
      location: String
      ESINo: String
      PFNo: String
      UANNo: String
      PensionNo:String
      qualification: [qualificationInputs]
      experience: [experienceInputs]
      audit: auditInputs
      tenantAccess: [TenantsInputs]
      tenantid: ID
    ): User

    uploadFile(file: Upload!): [Void]

    insertManyUsers(input: Void!): [Void]

    updateUser(
      id:ID
      eCode: String!
      username: String!
      password: String
      title: String
      name: String
      surname: String
      gender: String
      dob: ISODate
      maritalStatus: String
      bloodGroup: String
      nationality: String
      ethnicity: String
      cast: String
      religion: String
      jobTitleId: ID
      jobTitle: JobTitleInputs,
      unitDepartmentId: ID
      unitDepartment: DepartmentInputs,
      designationId: ID
      designation: DesignationInputs,
      reportingManagerId: ID
      reportingManager: UserInputs,
      employeeShiftIds: [ID]
      employeeShifts: [ShiftInputs],
      timeOfficePolicy: [String]
      punchInADay: [String]
      leaveTypesId: [ID]
      leaveTypes: [LeaveTypeInputs]
      leaveTypesNBalance: [LeaveTypeInputs]
      leaveRequestsId: [ID]
      leaveRequests: [LeaveRequestInputs]
      roleId: ID
      role: RoleInputs,
      employeeTypeId: ID
      employeeType: EmployeeTypeInputs,
      modeOfEmploymentId: ID
      modeOfEmployment: ModeOfEmploymentInputs,
      doj: ISODate
      doc: ISODate
      dor: ISODate
      status: Boolean
      overtime: Boolean
      salary: SalaryInputs
      salaryId: ID
      guardianName: String
      relation: String
      panId: String
      aadharId: String
      email: String
      homePhone: String
      personalPhone: String
      emergencyContact: String
      pinCode: String
      currentAddress: String
      permanentAddress: String
      bankName: String
      accountNo: String
      IFSCCode: String
      branch: String
      location: String
      ESINo: String
      PFNo: String
      UANNo: String
      PensionNo: String
      qualification: [qualificationInputs]
      experience: [experienceInputs]
      audit: auditInputs
      tenantAccess: [TenantsInputs]
      tenantid: ID
    ): User

    changePassword (
      eCode: String!
      oldPassword: String!
      newPassword: String!
    ): ChangePasswordUser

  }

  type CreateUsersPayload {
    users: [User]
  }

  type AuthData {
    user: User
    role: RoleTypes
    tenants: [TenantsTypes]
    designation: DesignationTypes
    token: String!
    refresh_token: String!
    tokenExpiration: String!
  }

  type User {
    _id: ID
    eCode: String!
    username: String!
    password: String
    title: String
    name: String
    surname: String
    gender: String
    dob: ISODate
    maritalStatus: String
    bloodGroup: String
    nationality: String
    ethnicity: String
    cast: String
    religion: String
    jobTitleId: ID
    jobTitle: JobTitleTypes,
    unitDepartmentId: ID
    unitDepartment: DepartmentTypes,
    designationId: ID
    designation: DesignationTypes,
    reportingManagerId: ID
    reportingManager: UserTypes,
    employeeShiftIds: [ID]
    employeeShifts: [ShiftTypes],
    timeOfficePolicy: [String]
    punchInADay: [String]
    leaveTypesId: [ID]
    leaveTypes: [LeaveTypeTypes]
    leaveTypesNBalance: [LeaveTypeTypes]
    leaveRequestsId: [ID]
    leaveRequests: [LeaveRequestTypes]
    roleId: ID
    role: RoleTypes,
    employeeTypeId: ID
    employeeType: EmployeeTypeTypes,
    modeOfEmploymentId: ID
    modeOfEmployment: ModeOfEmploymentTypes,
    doj: ISODate
    doc: ISODate
    dor: ISODate
    status: Boolean
    overtime: Boolean
    salary: SalaryTypes
    salaryId: ID
    guardianName: String
    relation: String
    panId: String
    aadharId: String
    email: String
    homePhone: String
    personalPhone: String
    emergencyContact: String
    pinCode: String
    currentAddress: String
    permanentAddress: String
    bankName: String
    accountNo: String
    IFSCCode: String
    branch: String
    location: String
    ESINo: String
    PFNo: String
    UANNo: String
    PensionNo: String
    qualification: [qualificationTypes]
    experience: [experienceTypes]
    audit: auditTypes
    tenantAccess: [TenantsTypes]
    tenantid: ID
  }

  type ChangePasswordUser{
    _id: ID!
    oldPassword:String
    newPassword:String
    user:UserTypes
  }

  type File {
    id: ID!
    path: String
    filename: String
    mimetype: String
  }

  type UserTypes {
    _id: ID
    eCode: String!
    username: String
    password: String
    title: String
    name: String
    surname: String
    gender: String
    dob: ISODate
    maritalStatus: String
    bloodGroup: String
    nationality: String
    ethnicity: String
    cast: String
    religion: String
    jobTitleId: ID
    jobTitle: JobTitleTypes,
    unitDepartmentId: ID
    unitDepartment: DepartmentTypes,
    designationId: ID
    designation: DesignationTypes,
    reportingManagerId: ID
    reportingManager: UserTypes,
    employeeShiftIds: [ID]
    employeeShifts: [ShiftTypes],
    timeOfficePolicy: [String]
    punchInADay: [String]
    leaveTypesId: [ID]
    leaveTypes: [LeaveTypeTypes]
    leaveTypesNBalance: [LeaveTypeTypes]
    leaveRequestsId: [ID]
    leaveRequests: [LeaveRequestTypes]
    roleId: ID
    role: RoleTypes,
    employeeTypeId: ID
    employeeType: EmployeeTypeTypes,
    modeOfEmploymentId: ID
    modeOfEmployment: ModeOfEmploymentTypes,
    doj: ISODate
    doc: ISODate
    dor: ISODate
    status: Boolean
    overtime: Boolean
    salary: SalaryTypes
    salaryId: ID
    guardianName: String
    relation: String
    panId: String
    aadharId: String
    email: String
    homePhone: String
    personalPhone: String
    emergencyContact: String
    pinCode: String
    currentAddress: String
    permanentAddress: String
    bankName: String
    accountNo: String
    IFSCCode: String
    branch: String
    location: String
    ESINo: String
    PFNo: String
    UANNo: String
    PensionNo: String
    qualification: [qualificationTypes]
    experience: [experienceTypes]
    audit: auditTypes
    tenantAccess: [TenantsTypes]
    tenantid: ID
  }

  input UserInputs {
    _id: ID
    eCode: String!
    username: String
    password: String
    title: String
    name: String
    surname: String
    gender: String
    dob: ISODate
    maritalStatus: String
    bloodGroup: String
    nationality: String
    ethnicity: String
    cast: String
    religion: String
    jobTitleId: ID
    jobTitle: JobTitleInputs,
    unitDepartmentId: ID
    unitDepartment: DepartmentInputs,
    designationId: ID
    designation: DesignationInputs,
    reportingManagerId: ID
    reportingManager: UserInputs,
    employeeShiftIds: [ID]
    employeeShifts: [ShiftInputs],
    timeOfficePolicy: [String]
    punchInADay: [String]
    leaveTypesId: [ID]
    leaveTypes: [LeaveTypeInputs]
    leaveTypesNBalance: [LeaveTypeInputs]
    leaveRequestsId: [ID]
    leaveRequests: [LeaveRequestInputs]
    roleId: ID
    role: RoleInputs,
    employeeTypeId: ID
    employeeType: EmployeeTypeInputs,
    modeOfEmploymentId: ID
    modeOfEmployment: ModeOfEmploymentInputs,
    doj: ISODate
    doc: ISODate
    dor: ISODate
    status: Boolean
    overtime: Boolean
    salary: SalaryInputs
    salaryId: ID
    guardianName: String
    relation: String
    panId: String
    aadharId: String
    email: String
    homePhone: String
    personalPhone: String
    emergencyContact: String
    pinCode: String
    currentAddress: String
    permanentAddress: String
    bankName: String
    accountNo: String
    IFSCCode: String
    branch: String
    location: String
    ESINo: String
    PFNo: String
    UANNo: String
    PensionNo: String
    qualification: [qualificationInputs]
    experience: [experienceInputs]
    audit: auditInputs
    tenantAccess: [TenantsInputs]
    tenantid: ID
  }

  type qualificationTypes {
    educationName: String
    boardUniversity: String
    fromMonthYear: ISODate
    toMonthYear: ISODate
    percentage: String
    schoolCollege: String
    educationType: String
    educationGap: Boolean
    educationGapComments: String
  }

  input qualificationInputs {
    educationName: String
    boardUniversity: String
    fromMonthYear: ISODate
    toMonthYear: ISODate
    percentage: String
    schoolCollege: String
    educationType: String
    educationGap: Boolean
    educationGapComments: String
  }

  type experienceTypes {
    companyName: String
    fromMonthYear: ISODate
    toMonthYear: ISODate
    reasonForLeaving: String
    isCurrentCompany: Boolean
    experienceComments: String
  }

  input experienceInputs {
    companyName: String
    fromMonthYear: ISODate
    toMonthYear: ISODate
    reasonForLeaving: String
    isCurrentCompany: Boolean
    experienceComments: String
  }

  input Pagination {
    id: ID
    query:String
    argument:String
    offset: Int
    limit: Int
    sortBy:String
    descending:Int
    search:String
    dates:Dates
    departmentId: ID
    departmentName: String
    designationId: ID
    designationName: String
    userID: ID
    eCode: String
    month: ISODate
    approvers: [ApproverInputs]
  }

  input Dates {
    gte:String
    lt:String
    lte:String
    bool:Boolean
  }

  scalar ISODate
`

const resolvers = require('./resolvers')

module.exports = {
  // typeDefs is an array, because it should be possible to split your schema if the schema grows to big, you can just export multiple here
  typeDefs: [
    typeDefs
  ],
  resolvers
}
