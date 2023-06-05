import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class OtherMastersService {

  constructor() { }
}

export const GQL_EMPLOYEE_TYPES = gql`
  query result(
    $query: Pagination!
  ) {
    getEmployeeTypes(
      query: $query
    ) {
      _id
      name
      status
      comments
    }
  }
`;

export const GQL_MODE_OF_EMPLOYMENTS = gql`
  query result(
    $query: Pagination!
  ) {
    getModeOfEmployments(
      query: $query
    ) {
      _id
      name
      status
      comments
    }
  }
`;

export const GQL_JOB_TITLES = gql`
  query result(
    $query: Pagination!
  ) {
    getJobTitles(
      query: $query
    ) {
      _id
      name
      designationId
      designation {
        name
      }
      status
      comments
    }
  }
`;

export const GQL_DESIGNATIONS = gql`
  query result(
    $query: Pagination!
  ) {
    getDesignations(
      query: $query
    ) {
      _id
      name
      departmentId
      department {
        name
      }
      parentDesignationId
      parentDesignation {
        name
      }
      status
      comments
      audit {
        created_at
      }
    }
  }
`;

export const GQL_SHIFTS = gql`
  query result(
    $query: Pagination!
  ) {
    getShifts(
      query: $query
    ) {
      _id
      name
      status
      code
      comments
      general {
        effectiveFrom
        defaultTimeFrom
        defaultTimeTo
      }
      workingHours {
        minimumHoursRequired
        totalHoursCalculations
        graceTimeRequired
        graceNumberTimeRequired
      }
      shiftRotation {
        scheduleName
        scheduleFrequency
        frequencyStartsOn
        timeOfSchedule
        frequencyDays
        applicableFor
        selectApplicableFor
        shiftRotateFrom
        shiftRotateTo
      }
      payDays {
        includeWeekend
        includeHolidays
        includeLeave
        carryOverBalanceHoursInOvertimeReport
      }
      permissions {
        webCheckInCheckout
        mobileCheckInCheckout
        managerCanEdit
        notifyAdminOnEdit
      }
      regularization {
        regularForFutureEnable
        requestCanBeRaisedForChangeDays
      }
    }
  }
`;

export const GQL_SHIFT_CREATE = gql`
  mutation ShiftMutation(
    $name: String!
    $code: String!
    $comments: String
    $general: generalInputs
    $workingHours: workingHoursInputs
    $shiftRotation: shiftRotationInputs
    $payDays: payDaysInputs
    $permissions: permissionsInputs
    $regularization: regularizationInputs
  ) {
    createShift(
      name: $name
      code: $code
      comments: $comments
      general: $general
      workingHours: $workingHours
      shiftRotation: $shiftRotation
      payDays: $payDays
      permissions: $permissions
      regularization: $regularization
    ) {
      name
      code
      status
      comments
      general {
        effectiveFrom
        defaultTimeFrom
        defaultTimeTo
      }
      workingHours {
        minimumHoursRequired
        totalHoursCalculations
        graceTimeRequired
        graceNumberTimeRequired
      }
      shiftRotation {
        scheduleName
        scheduleFrequency
        frequencyStartsOn
        timeOfSchedule
        frequencyDays
        applicableFor
        selectApplicableFor
        shiftRotateFrom
        shiftRotateTo
      }
      payDays {
        includeWeekend
        includeHolidays
        includeLeave
        carryOverBalanceHoursInOvertimeReport
      }
      permissions {
        webCheckInCheckout
        mobileCheckInCheckout
        managerCanEdit
        notifyAdminOnEdit
      }
      regularization {
        regularForFutureEnable
        requestCanBeRaisedForChangeDays
      }
    }
  }
`;


export const GQL_SHIFT_EDIT = gql`
  mutation ShiftMutation(
    $id: ID!
    $name: String!
    $code: String!
    $comments: String
    $general: generalInputs
    $workingHours: workingHoursInputs
    $shiftRotation: shiftRotationInputs
    $payDays: payDaysInputs
    $permissions: permissionsInputs
    $regularization: regularizationInputs
  ) {
    editShift(
      _id: $id
      name: $name
      code: $code
      comments: $comments
      general: $general
      workingHours: $workingHours
      shiftRotation: $shiftRotation
      payDays: $payDays
      permissions: $permissions
      regularization: $regularization
    ) {
      _id
      name
      code
      status
      comments
      general {
        effectiveFrom
        defaultTimeFrom
        defaultTimeTo
      }
      workingHours {
        minimumHoursRequired
        minimumHoursRequiredHalfDay
        totalHoursCalculations
        graceTimeRequired
        graceNumberTimeRequired
      }
      shiftRotation {
        scheduleName
        scheduleFrequency
        frequencyStartsOn
        timeOfSchedule
        frequencyDays
        applicableFor
        selectApplicableFor
        shiftRotateFrom
        shiftRotateTo
      }
      payDays {
        includeWeekend
        includeHolidays
        includeLeave
        carryOverBalanceHoursInOvertimeReport
        overtimeReportCalculationBy
      }
      permissions {
        webCheckInCheckout
        mobileCheckInCheckout
        managerCanEdit
        notifyAdminOnEdit
      }
      regularization {
        regularForFutureEnable
        requestCanBeRaisedForChangeDays
      }
    }
  }
`;

export const GQL_EMPLOYEE_TYPES_CREATE = gql`
  mutation CreateEmployeeType($name: String!, $status: Boolean, $comments: String) {
    createEmployeeType(name: $name, status: $status, comments: $comments) {
      _id
      comments
      name
      status
    }
  }
`;

export const GQL_EMPLOYEE_TYPES_UPDATE = gql`
  mutation editEmployeeType( $id: ID, $name: String!, $status: Boolean, $comments: String) {
    editEmployeeType(_id: $id, name: $name, status: $status, comments: $comments) {
      _id
      comments
      name
      status
    }
  }
`;

export const GQL_MODE_OF_EMPLOYMENTS_CREATE = gql`
  mutation CreateModeOfEmployment($name: String!, $status: Boolean, $comments: String) {
    createModeOfEmployment(name: $name, status: $status, comments: $comments) {
      _id
      name
      status
      comments
    }
  }
`;

export const GQL_MODE_OF_EMPLOYMENTS_UPDATE = gql`
  mutation EditModeOfEmployment($id: ID, $name: String!, $status: Boolean, $comments: String) {
    editModeOfEmployment(_id: $id, name: $name, status: $status, comments: $comments) {
      _id
      comments
      name
      status
    }
  }
`;

export const GQL_JOB_TITLES_CREATE = gql`
  mutation CreateJobTitle($name: String!, $status: Boolean, $designationId: ID, $comments: String) {
    createJobTitle(name: $name, status: $status, designationId: $designationId, comments: $comments) {
      _id
      name
      status
      comments
      designation {
        name
      }
    }
  }
`;

export const GQL_JOB_TITLES_UPDATE = gql`
  mutation EditJobTitle($name: String!, $id: ID, $status: Boolean, $designationId: ID, $comments: String) {
    editJobTitle(name: $name, _id: $id, status: $status, designationId: $designationId, comments: $comments) {
      _id
      comments
      designation {
        name
      }
      name
      status
    }
  }
`;