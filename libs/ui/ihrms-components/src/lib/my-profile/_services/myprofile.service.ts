import { Injectable } from '@angular/core';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { gql } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MyprofileService {

  get getUserProfileData() {
    return this.userProfileData as Observable<any>;
  }

  set setUserProfileData(val: any) {
    if (val) { this.userProfileData.next(val) }
  }

  userProfileData: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  getOfficialControls() {

    const controls: ControlBase<string>[] = [
      {
        key: 'eCode',
        label: 'Employee Code',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'username',
        label: 'Username',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'password',
        label: 'Password',
        protected: true,
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'title',
        label: 'Title',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Mr.', value: 'Mr.' },
          { key: 'Miss.', value: 'Miss.' },
          { key: 'Mrs.', value: 'Mrs.' },
        ]
      },
      {
        key: 'name',
        label: 'Name',
        validators: {
          required: true,
          pattern:"[a-zA-Z][a-zA-Z]+"
         
        },
        
        order: 1,
        controlType: 'textbox',
      
      },
      {
        key: 'surname',
        label: 'Surname',
        validators: {
          pattern:"[a-zA-Z][a-zA-Z]+"
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'gender',
        label: 'Gender',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Male', value: 'Male' },
          { key: 'Female', value: 'Female' },
          { key: 'Other', value: 'Other' },
        ]
      },
      {
        key: 'dob',
        label: 'Date Of Birth',
        validators: {
          required: true,
          maxDate: 18,
        },
        order: 1,
        controlType: 'datepicker',
        placeholder: 'MM/DD/YYYY'
      },
      {
        key: 'maritalStatus',
        label: 'Marital Status',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Single', value: 'Single' },
          { key: 'Married', value: 'Married' },
        ]
      },
      {
        key: 'bloodGroup',
        label: 'Blood Group',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'O+', value: 'O+' },
          { key:'O-',value:'O-'},
          { key:'AB-',value:'AB-'},
          { key:'AB+',value:'AB+'},
          { key:'B-',value:'B-'},{ key:'B+',value:'B+'},
          { key:'A+',value:'A+'},{ key:'A-',value:'A-'},
        ]
      },
      {
        key: 'nationality',
        label: 'Nationality',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Indian', value: 'Indian' },
        ]
      },
      {
        key: 'ethnicity',
        label: 'Ethnicity',
        validators: {
          required: false,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'asian', value: 'Asian' },
          { key: 'White', value: 'White' },
          { key: 'Black or African American', value: 'Black or African American' },
          { key: 'American Indian or Alaska Native', value: 'American Indian or Alaska Native' },
          { key: 'other', value: 'Other' },
        ]
      },
      {
        key: 'religion',
        label: 'Religion',
        validators: {
          required: false,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Sikh', value: 'Sikh' },
          { key: 'Hindu', value: 'Hindu' },
          { key: 'Muslim', value: 'Muslim' },
          { key:'Christian',value:'Christian'},
          { key:'Islam',value:'Islam'},
          { key:'Buddhism',value:'Buddhism'},
          { key:'Jainism',value:'Jainism'},    
          { key: 'Other', value: 'Other' }
        ]
      },
      {
        key: 'jobTitleId',
        label: 'Job Title',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: []
      },
      {
        key: 'unitDepartmentId',
        label: 'Unit/Department',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: []
      },
      {
        key: 'designationId',
        label: 'Designation',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: []
      },
      {
        key: 'reportingManagerId',
        label: 'Reporting Manager',
        validators: {
        },
        order: 1,
        controlType: 'dropdown',
        options: []
      },
      {
        key: 'employeeShiftIds',
        label: 'Employee Shift',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        type: 'multiple',
        options: []
      },
      {
        key: 'overtime',
        label: 'overtime',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: true, value: 'Yes'},
          { key: false, value: 'No'},
        ]
      },
      {
        key: 'timeOfficePolicy',
        label: 'Time Office Policy',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        type: 'multiple',
        options: [
          { key: 'PERMISSIBLE LATE ARRIVAL' ,value: 'PERMISSIBLE LATE ARRIVAL' },
          { key: 'PERMISSIBLE EARLY DEPARTURE' ,value: 'PERMISSIBLE EARLY DEPARTURE' },
          { key: 'MAX WORKING HRS IN A DAY' ,value: 'MAX WORKING HRS IN A DAY' },
          { key: 'OUT PASS DURATION' ,value: 'OUT PASS DURATION' },
          { key: 'OUT PASS FREQUENCY' ,value: 'OUT PASS FREQUENCY' },
          { key: 'SHIFT ROTATIONAL OR GENERAL' ,value: 'SHIFT ROTATIONAL OR GENERAL' },
          { key: 'HALF DAY ALLOW' ,value: 'HALF DAY ALLOW' },
          { key: 'SHORT LEAVE ALLOW AND HOW MANY IN A MONTH' ,value: 'SHORT LEAVE ALLOW AND HOW MANY IN A MONTH' },
          { key: 'OVER TIME ALLOW' ,value: 'OVER TIME ALLOW' },
        ]
      },
      {
        key: 'punchInADay',
        label: 'punch In A Day',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        type: 'multiple',
        options: [
          { key: 'SINGLE', value: 'SINGLE' },
          { key: '2 TIME', value: '2 TIME' },
          { key: 'MULTIPLE', value: 'MULTIPLE' },
          { key: '4 TIME', value: '4 TIME' },
        ]
      },
      {
        key: 'roleId',
        label: 'Role',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        // type: 'multiple',
        options: []
      },
      {
        key: 'employeeTypeId',
        label: 'Employee Type',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: []
      },
      {
        key: 'modeOfEmploymentId',
        label: 'Mode Of Employment',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: []
      },
      {
        key: 'doj',
        label: 'Joining Date',
        validators: {
          required: true,
          minDate: new Date(Date.now())
        },
        order: 1,
        controlType: 'datepicker'
      },
      {
        key: 'doc',
        label: 'Date Of Confirmation',
        validators: {
          minDate: new Date(Date.now())
        },
        order: 1,
        controlType: 'datepicker'
      },
      {
        key: 'dor',
        label: 'Date Of Relieving',
        validators: {
          minDate: new Date(Date.now())
        },
        order: 1,
        controlType: 'datepicker'
      },
      {
        key: 'status',
        label: 'Status',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: true, value: 'Active'},
          { key: false, value: 'Inactive'},
        ]
      },
      {
        label: '',
        order: 1,
        controlType: 'heading',
      },
      {
        label: '',
        order: 1,
        controlType: 'heading',
        fxFlex: 100
      },
      {
        key: 'picUpload',
        label: 'Profile Pic',
        order: 1,
        controlType: 'fileUpload',
        type: 'image'
      },
      {
        label: '',
        order: 1,
        controlType: 'divider',
        fxFlex: 100
      }
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getPersonalControls$() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Personal Details',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        key: 'guardianName',
        label: 'Guardian Name',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'relationId',
        label: 'Relation',
        order: 1,
        controlType: 'dropdown',
        options:[
          {key:'spouse',value:'Spouse'},
          {key:'sibling',value:'Sibling'},
          { key: 'uncle', value: 'Uncle' },
          {key:'aunt',value:'Aunt'},  
          {key:'cousin',value:'Cousin'},
          {key:'friend',value:'Friend'}
     ] },
      {
        key: 'pan',
        label: 'PAN No.',
        validators: {
          required: true,
          minLength: 10,
          pattern: "^.{1,10}$",
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'aadhar',
        label: 'Aadhar ID',
        validators: {
          required: true,
          minLength:12,
          pattern: "^.{1,12}$",
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        validators: {
          required: true,
          minLength: 2,
          pattern: "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'homePhone',
        label: 'Home Phone',
        validators: {
          minLength: 10,
          pattern: "^[0-9]*$"
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'personalPhone',
        label: 'Personal Phone',
        validators: {
          required: true,
          minLength: 10,
          pattern: "^[0-9]*$"
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'emergencyContact',
        label: 'Emergency Contact',
        validators: {
          required: true,
          minLength: 10,
          pattern: "^[0-9]*$"
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'pinCode',
        label: 'Pin Code',
        validators: {
          required: true,
          minLength: 6,
          pattern: "^[0-9]*$"
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        key: 'currentAddress',
        label: 'Current Address',
        fxFlex: 49,
        order: 1,
        controlType: 'textarea'
      },
      {
        key: 'permanentAddress',
        label: 'Permanent Address',
        fxFlex: 49,
        order: 1,
        controlType: 'textarea'
      },
      {
        label: 'Bank Details',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        key: 'bankName',
        label: 'Bank Name',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'accountNo',
        label: 'Account No',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'ifscCode',
        label: 'IFSC Code',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'branch',
        label: 'Branch',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'location',
        label: 'Location',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'ESINo',
        label: 'ESI No',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'PFNo',
        label: 'PF No',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'UANNo',
        label: 'UAN No',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'PensionNo',
        label: 'Pension No',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: '',
        label: '',
        order: 1,
        controlType: '',
      },
      {
        label: '',
        order: 1,
        controlType: 'divider',
        fxFlex: 100
      }
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getQualificationsControls$() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Education',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        key: 'educationName',
        label: 'Education',
        validators: {
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'boardUniversity',
        label: 'Board/University',
        validators: {
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'fromMonthYear',
        label: 'From Month-Year',
        validators: {
          maxDate: new Date(),
        },
        order: 1,
        controlType: 'datepicker'
      },
      {
        key: 'toMonthYear',
        label: 'To Month-Year',
        validators: {
        },
        order: 1,
        controlType: 'datepicker'
      },
      {
        key: 'percentage',
        label: 'Percentage',
        validators: {
          required:true,
         minLength:1,
         maxDate:3,
         pattern: "^[0-99.9]*$"
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'schoolCollege',
        label: 'School/College',
        validators: {
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'educationType',
        label: 'Education Type',
        validators: {
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Part Time', value: 'Part Time' },
          { key: 'Full Time', value: 'Full Time' },
        ]
      },
      {
        key: '',
        label: 'Add',
        order: 1,
        controlType: 'addEditButton',
        marginTop: 20,
        textAlign: 'left'
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
      },
      {
        label: '',
        order: 1,
        controlType: 'divider',
        fxFlex: 100
      }
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getExperienceControls$() {

    const controls: ControlBase<string>[] | any = [ // Type Any for Array of Controls
      {
        dynamicArr : [
          {
            label: 'Experience',
            order: 1,
            controlType: 'controlHeading',
            fxFlex: 100
          },
          {
            key: 'companyName',
            label: 'Company',
            validators: {
              required: true
            },
            order: 1,
            controlType: 'textbox'
          },
          {
            key: 'fromMonthYear',
            label: 'From Month-Year',
            validators: {
              maxDate: new Date(),
            },
            order: 1,
            controlType: 'datepicker'
          },
          {
            key: 'toMonthYear',
            label: 'To Month-Year',
            validators: {
            },
            order: 1,
            controlType: 'datepicker'
          },
          {
            key: 'reasonForLeaving',
            label: 'Reason For Leaving',
            order: 1,
            validators: {
              minLength: 6,
            },
            controlType: 'textarea'
          },
        //  {
          //  key: 'isCurrentCompany',
            //label: 'Current Company',
            //order: 1,
            //controlType: 'checkbox',
            //marginTop: 35
          //},
          {
            key: '',
            label: 'Add',
            order: 1,
            controlType: 'addEditButton',
            marginTop: 20,
            textAlign: 'left',
            type: 'add'
          },
          {
            label: '',
            order: 1,
            controlType: 'controlHeading',
          },
          {
            label: '',
            order: 1,
            controlType: 'divider',
            fxFlex: 100
          }
        ]
      }
    ];

    return of(controls);
  }

}
  
export const GQL_CREATE_USER = gql`
  mutation userMutation(
    $eCode: String!
    $username: String!
    $password: String!
    $title:String
    $name:String
    $surname: String
    $gender: String
    $dob: ISODate
    $maritalStatus: String
    $bloodGroup: String
    $nationality: String
    $ethnicity: String
    $cast: String
    $religion: String
    $jobTitleId: ID
    $jobTitle: JobTitleInputs
    $unitDepartmentId: ID
    $unitDepartment: DepartmentInputs
    $designationId: ID
    $designation: DesignationInputs
    $reportingManagerId: ID
    $reportingManager: UserInputs
    $employeeShiftIds: [ID]
    $overtime: Boolean
    $employeeShifts: [ShiftInputs]
    $timeOfficePolicy: [String]
    $punchInADay: [String]
    $leaveTypesId: [ID]
    $leaveTypes: [LeaveTypeInputs]
    $leaveRequestsId: [ID]
    $leaveRequests: [LeaveRequestInputs]
    $roleId: ID
    $role: RoleInputs,
    $employeeTypeId: ID
    $employeeType: EmployeeTypeInputs
    $modeOfEmploymentId: ID
    $modeOfEmployment: ModeOfEmploymentInputs
    $doj: ISODate
    $doc: ISODate
    $dor: ISODate
    $status: Boolean
    $guardianName: String
    $relation: String
    $panId: String
    $aadharId: String
    $email: String
    $homePhone: String
    $personalPhone: String
    $emergencyContact: String
    $pinCode: String
    $currentAddress: String
    $permanentAddress: String
    $bankName: String
    $accountNo: String
    $IFSCCode: String
    $branch: String
    $location: String
    $ESINo: String
    $PFNo: String
    $UANNo: String
    $PensionNo: String
    $qualification: [qualificationInputs]
    $experience: [experienceInputs]
  ) {
    createUser(
      eCode: $eCode
      username: $username
      password: $password
      title: $title
      name: $name
      surname: $surname
      gender: $gender
      dob: $dob
      maritalStatus: $maritalStatus
      bloodGroup: $bloodGroup
      nationality: $nationality
      ethnicity: $ethnicity
      cast: $cast
      religion: $religion
      jobTitleId: $jobTitleId
      jobTitle: $jobTitle
      unitDepartmentId: $unitDepartmentId
      unitDepartment: $unitDepartment
      designationId: $designationId
      designation: $designation
      reportingManagerId: $reportingManagerId
      reportingManager: $reportingManager
      employeeShiftIds: $employeeShiftIds
      employeeShifts: $employeeShifts
      timeOfficePolicy: $timeOfficePolicy
      punchInADay: $punchInADay
      leaveTypesId: $leaveTypesId
      leaveTypes: $leaveTypes
      leaveRequestsId: $leaveRequestsId
      leaveRequests: $leaveRequests
      roleId: $roleId
      role: $role
      employeeTypeId: $employeeTypeId
      employeeType: $employeeType
      modeOfEmploymentId: $modeOfEmploymentId
      modeOfEmployment: $modeOfEmployment
      doj: $doj
      doc: $doc
      dor: $dor
      status: $status
      overtime: $overtime
      guardianName: $guardianName
      relation: $relation
      panId: $panId
      aadharId: $aadharId
      email: $email
      homePhone: $homePhone
      personalPhone: $personalPhone
      emergencyContact: $emergencyContact
      pinCode: $pinCode
      currentAddress: $currentAddress
      permanentAddress: $permanentAddress
      bankName: $bankName
      accountNo: $accountNo
      IFSCCode: $IFSCCode
      branch: $branch
      location: $location
      ESINo: $ESINo
      PFNo: $PFNo
      UANNo: $UANNo
      PensionNo: $PensionNo
      qualification: $qualification
      experience: $experience
    ) {
      _id
      eCode
      username
      password
      title
      name
      surname
      gender
      dob
      maritalStatus
      bloodGroup
      nationality
      ethnicity
      cast
      religion
      jobTitleId
      jobTitle {
        name
      }
      unitDepartmentId
      unitDepartment {
        name
      }
      designationId
      designation {
        name
      }
      reportingManagerId
      reportingManager {
        username
      }
      employeeShiftIds
      employeeShifts {
        name
      }
      timeOfficePolicy
      punchInADay
      leaveTypesId
      leaveTypes {
        name
      }
      leaveRequestsId
      leaveRequests {
        leaveType {
          name
        }
        startDate
        endDate
      }
      roleId
      role {
        role_name
      }
      employeeTypeId
      employeeType {
        name
      }
      modeOfEmploymentId
      modeOfEmployment {
        name
      }
      doj
      doc
      dor
      status
      overtime
      guardianName
      relation
      panId
      aadharId
      email
      homePhone
      personalPhone
      emergencyContact
      pinCode
      currentAddress
      permanentAddress
      bankName
      accountNo
      IFSCCode
      branch
      location
      ESINo
      PFNo
      UANNo
      PensionNo
      qualification {
        educationName
        boardUniversity
      }
      experience {
        companyName
      }
    }
  }
`;


export const GQL_UPDATE_USER = gql`
  mutation userMutation(
    $eCode: String!
    $username: String!
    $password: String
    $title:String
    $name:String
    $surname: String
    $gender: String
    $dob: ISODate
    $maritalStatus: String
    $bloodGroup: String
    $nationality: String
    $ethnicity: String
    $cast: String
    $religion: String
    $jobTitleId: ID
    $jobTitle: JobTitleInputs
    $unitDepartmentId: ID
    $unitDepartment: DepartmentInputs
    $designationId: ID
    $designation: DesignationInputs
    $reportingManagerId: ID
    $reportingManager: UserInputs
    $employeeShiftIds: [ID]
    $employeeShifts: [ShiftInputs]
    $timeOfficePolicy: [String]
    $punchInADay: [String]
    $leaveTypesId: [ID]
    $leaveTypes: [LeaveTypeInputs]
    $leaveRequestsId: [ID]
    $leaveRequests: [LeaveRequestInputs]
    $roleId: ID
    $role: RoleInputs,
    $employeeTypeId: ID
    $employeeType: EmployeeTypeInputs
    $modeOfEmploymentId: ID
    $modeOfEmployment: ModeOfEmploymentInputs
    $doj: ISODate
    $doc: ISODate
    $dor: ISODate
    $status: Boolean
    $overtime: Boolean
    $guardianName: String
    $relation: String
    $panId: String
    $aadharId: String
    $email: String
    $homePhone: String
    $personalPhone: String
    $emergencyContact: String
    $pinCode: String
    $currentAddress: String
    $permanentAddress: String
    $bankName: String
    $accountNo: String
    $IFSCCode: String
    $branch: String
    $location: String
    $ESINo: String
    $PFNo: String
    $UANNo: String
    $PensionNo: String
    $qualification: [qualificationInputs]
    $experience: [experienceInputs]
  ) {
    updateUser(
      eCode: $eCode
      username: $username
      password: $password
      title: $title
      name: $name
      surname: $surname
      gender: $gender
      dob: $dob
      maritalStatus: $maritalStatus
      bloodGroup: $bloodGroup
      nationality: $nationality
      ethnicity: $ethnicity
      cast: $cast
      religion: $religion
      jobTitleId: $jobTitleId
      jobTitle: $jobTitle
      unitDepartmentId: $unitDepartmentId
      unitDepartment: $unitDepartment
      designationId: $designationId
      designation: $designation
      reportingManagerId: $reportingManagerId
      reportingManager: $reportingManager
      employeeShiftIds: $employeeShiftIds
      employeeShifts: $employeeShifts
      timeOfficePolicy: $timeOfficePolicy
      punchInADay: $punchInADay
      leaveTypesId: $leaveTypesId
      leaveTypes: $leaveTypes
      leaveRequestsId: $leaveRequestsId
      leaveRequests: $leaveRequests
      roleId: $roleId
      role: $role
      employeeTypeId: $employeeTypeId
      employeeType: $employeeType
      modeOfEmploymentId: $modeOfEmploymentId
      modeOfEmployment: $modeOfEmployment
      doj: $doj
      doc: $doc
      dor: $dor
      status: $status
      overtime: $overtime
      guardianName: $guardianName
      relation: $relation
      panId: $panId
      aadharId: $aadharId
      email: $email
      homePhone: $homePhone
      personalPhone: $personalPhone
      emergencyContact: $emergencyContact
      pinCode: $pinCode
      currentAddress: $currentAddress
      permanentAddress: $permanentAddress
      bankName: $bankName
      accountNo: $accountNo
      IFSCCode: $IFSCCode
      branch: $branch
      location: $location
      ESINo: $ESINo
      PFNo: $PFNo
      UANNo: $UANNo
      PensionNo: $PensionNo
      qualification: $qualification
      experience: $experience
    ) {
      _id
      eCode
      username
      password
      title
      name
      surname
      gender
      dob
      maritalStatus
      bloodGroup
      nationality
      ethnicity
      cast
      religion
      jobTitleId
      jobTitle {
        name
      }
      unitDepartmentId
      unitDepartment {
        name
      }
      designationId
      designation {
        name
      }
      reportingManagerId
      reportingManager {
        username
      }
      employeeShiftIds
      employeeShifts {
        name
      }
      timeOfficePolicy
      punchInADay
      leaveTypesId
      leaveTypes {
        name
      }
      leaveRequestsId
      leaveRequests {
        leaveType {
          name
        }
        startDate
        endDate
      }
      roleId
      role {
        role_name
      }
      employeeTypeId
      employeeType {
        name
      }
      modeOfEmploymentId
      modeOfEmployment {
        name
      }
      doj
      doc
      dor
      status
      overtime
      guardianName
      relation
      panId
      aadharId
      email
      homePhone
      personalPhone
      emergencyContact
      pinCode
      currentAddress
      permanentAddress
      bankName
      accountNo
      IFSCCode
      branch
      location
      ESINo
      PFNo
      UANNo
      PensionNo
      qualification {
        educationName
        boardUniversity
      }
      experience {
        companyName
      }
    }
  }
`;
