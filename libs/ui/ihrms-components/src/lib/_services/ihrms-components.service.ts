import { Injectable } from '@angular/core';
import { SharedService } from '@ihrms/shared';
import { HttpClient } from '@angular/common/http';
import { gql } from 'apollo-angular';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class IhrmsComponentsService {

  environment: any;

  constructor(
    private sharedService: SharedService,
    private http: HttpClient
  ) {
    this.environment = this.sharedService.environment;
  }

  getEntityByID(Entity: string, ID: number) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/Get?Id=${ID}`);
  }

  getEntityByAction(Entity: string, Action: string) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/${Action}`);
  }

  getEntityAllWithParams(Entity: string, Action: string | undefined, Params: string) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/${Action}?${Params}`);
  }

  getAttachedEntitiesByEntityID(Entity: string, AttachedEntity: string, Query: string, ID: number) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/${AttachedEntity}?${Query}=${ID}`);
  }

  getEntityAll(Entity: string) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/GetAll`);
  }

  createEntity(Entity: string, data: any) {
    return this.http.post(`${this.environment.apiURL}/services/app/${Entity}/Create`, data);
  }

  createEntityByAction(Entity: string, data: any, Action: string) {
    return this.http.post(`${this.environment.apiURL}/services/app/${Entity}/${Action}`, data);
  }

  updateEntity(Entity: string, data: any) {
    return this.http.put(`${this.environment.apiURL}/services/app/${Entity}/Update`, data);
  }

  deleteEntity(Entity: string, ID: number) {
    return this.http.delete(`${this.environment.apiURL}/services/app/${Entity}/Delete?Id=${ID}`);
  }

  getLocalTimeZone(date: any, time: any) {
    const local = new Date(date); //  + 'Z'
    const new_local = moment(local).add(time, 'hours');
    return new_local.format('hh:mm a');
  }
  
  getCurrentZoneTime(d: any) {
    return moment(d).format('MM/DD/YYYY');
  }

}

// We use the gql tag to parse our query string into a query document
export const GQL_MODE_OF_EMPLOYMENT = gql`
  query result(
    $query: Pagination!
  ) {
    getModeOfEmployments(
      query: $query
    ) {
      _id
      name
      comments
    }
  }
`;

export const GQL_ROLE = gql`
  query result(
    $query: Pagination!
  ) {
    getRoles(
      query: $query
    ) {
      _id
      role_name
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
    }
  }
`;

export const GQL_DEPARTMENTS = gql`
  query result(
    $query: Pagination!
  ) {
    getDepartments(
      query: $query
    ) {
      _id
      name
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
      code
    }
  }
`;

export const GQL_EMPLOYEE_TYPES = gql`
  query result(
    $query: Pagination!
  ) {
    getEmployeeTypes(
      query: $query
    ) {
      _id
      name
    }
  }
`;


export const GQL_ALL_EMPLOYEES = gql`
  query result(
    $query: Pagination!
  ) {
    getAllUsers(
      query: $query
    ) {
      _id
      name
      username
      eCode
      email
      status
      accountNo
      bankName
      designation {
        name
      }
      unitDepartment {
        name
      }
      role {
        role_name
      }
      reportingManager {
        username
      }
      employeeShifts {
        name
        _id
      }
      employeeType {
        name
      }
      leaveRequests {
        startDate
        endDate
      }
      salaryId
      salary {
        CTC
      }
      doj
      bloodGroup
    }
  }
`;

export const GQL_EMPLOYEES = gql`
  query result(
    $query: Pagination!
  ) {
    getUsers(
      query: $query
    ) {
      _id
      name
      username
      eCode
      email
      status
      accountNo
      bankName
      designation {
        name
      }
      unitDepartment {
        name
      }
      role {
        role_name
      }
      reportingManager {
        username
      }
      employeeShifts {
        name
        _id
      }
      employeeType {
        name
      }
      leaveRequests {
        startDate
        endDate
      }
      salaryId
      salary {
        CTC
      }
      doj
      bloodGroup
    }
  }
`;

export const GQL_EMPLOYEE_BY_ID = gql`
  query result(
    $query: Pagination!
  ) {
    getUsers(
      query: $query
    ) {
      _id
      eCode
      username
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
        _id
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
        fromMonthYear
        toMonthYear
        percentage
        schoolCollege
        educationType
        educationGap
        educationGapComments
      }
      experience {
        companyName
        fromMonthYear
        toMonthYear
        reasonForLeaving
        isCurrentCompany
        experienceComments
      }
    }
  }
`;

export const GQL_WEB_CLOCK_IN_OUT = gql`
  mutation CreateAttendance(
    $userId: ID!
    $inTime: ISODate
    $outTime: ISODate
    $eCode: String
    ) {
    createAttendance(
      userId: $userId
      inTime: $inTime
      outTime: $outTime
      eCode: $eCode
      ) {
      date
      inTime
      outTime
      user {
        username
        eCode
        employeeShifts {
          name
          _id
        }
      }
    }
  }
`;

export const GQL_GET_CLOCK_DATA = gql`
  query GetAttendances($query: Pagination!) {
    getAttendances(query: $query) {
      date
      inTime
      outTime
      userId
      user {
        username
      }
    }
  }
`;

export const GQL_GET_ATTENDANCE_BY_DATE_WISE = gql`
  query Query($query: Pagination!) {
    getAttendancesByDayWise(query: $query)
  }
`;
