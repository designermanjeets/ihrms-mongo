import { Injectable } from '@angular/core';
import { CONSTANTS, SharedService } from '@ihrms/shared';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { IhrmsDialogComponent } from '@ihrms/ihrms-components';
import * as moment from 'moment';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class IhrmsEmpDashboardService {

  environment: any;

  constructor(
    private sharedService: SharedService,
    private http: HttpClient,
    private toastrService: ToastrService,
    private apollo: Apollo
  ) {
    this.environment = this.sharedService.environment;
  }

  getEntityByID(Entity: string, ID: number) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/Get?Id=${ID}`);
  }

  getEntityAllByUserID(Entity: string, UserId: number) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/GetAllByUserId?UserId=${UserId}`);
  }

  getEntityAllWithParams(Entity: string, Action: string | undefined, Params: string) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/${Action}?${Params}`);
  }

  getEntityByAction(Entity: string, Action: string) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/${Action}`);
  }

  getEntityAll(Entity: string) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/GetAll`);
  }

  createEntity(Entity: string, data: any) {
    return this.http.post(`${this.environment.apiURL}/services/app/${Entity}/Create`, data);
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

  dynamicCompClickHandler(event: any, compService: any, dashService: any, rowIndexOrID: any, entityAction: string, entity: string, dialog: any, GQL?: any, methodName?: string) {
    if(event.action === CONSTANTS.REQUEST_CORRECTION) {
      const newEvent = Object.assign({}, event);
      return this.openAddEntityDialog(
        newEvent?.text,
        CONSTANTS.ADD_ANY,
        newEvent.data.rowIndex,
        newEvent?.data?.data,
        undefined,
        compService,
        dashService,
        null, // rowIndexOrID
        GQL,
        dialog,
        undefined,
        undefined,
        methodName
      );
    }
    if(event.component && event.comp_name === CONSTANTS.IHRMS_FILTERS_COMPONENT) {
      if(event.action === CONSTANTS.ADD_ANY && event.text === entityAction) {
        return this.openAddEntityDialog(
          event.text,
          CONSTANTS.ADD_ANY,
          undefined,
          null,
          undefined,
          compService,
          dashService,
          rowIndexOrID,
          entity,
          dialog,
          undefined,
          undefined,
          methodName
        );
      }
    }
  }

  outputActions(event: any, entity: string, compService: any, dashService: any, dialog: any, rowIndexOrID: any, GQL?: any, methodName?: string) {
    const obj = 'Edit'+entity;
    if(event.action === CONSTANTS.EDIT ) {
      const OBJ = ('Edit'+entity as any).replaceAll(/\s/g,'');
      dashService.openAddEntityDialog(
        CONSTANTS.TITLES[OBJ],
        CONSTANTS.EDIT,
        event.params.node.id,
        event.params.data,
        undefined,
        compService,
        dashService,
        rowIndexOrID,
        entity,
        dialog,
        undefined,
        undefined,
        methodName
      );
    }
    if(event.action === CONSTANTS.VISIBILITY ) {
      dashService.openAddEntityDialog(
        CONSTANTS.TITLES[entity],
        CONSTANTS.VISIBILITY,
        event.params.node.id,
        event.params.data,
        true,
        compService,
        dashService,
        rowIndexOrID,
        entity,
        dialog,
        undefined,
        undefined,
        methodName
      );
    }
    if(event.action === CONSTANTS.CANCEL ) {
      const OBJ = ('Delete'+entity as any).replaceAll(/\s/g,'');
      dashService.openAddEntityDialog(
        CONSTANTS.TITLES[OBJ],
        CONSTANTS.CANCEL,
        event.params.node.id,
        event.params.data,
        true,
        compService,
        dashService,
        rowIndexOrID,
        entity,
        dialog,
        undefined,
        undefined,
        methodName
      );
    }
  }

  openAddEntityDialog(
    title: string,
    action: string,
    rowIndex?: number,
    patchValue?: any,
    readOnly?: boolean,
    compService?: any,
    dashService?: any,
    rowIndexOrID?: any,
    entity?: any,
    dialog?: any,
    getDynamicControlMethod?: string,
    formFlex?: number,
    methodName?: string
  ) {

    const fetchControls = getDynamicControlMethod ? compService[getDynamicControlMethod]() : compService.getDynamicControls();

    const dialogRef = dialog.open(IhrmsDialogComponent, {
      data: {
        title: title,
        controls: fetchControls,
        formConfig: {
          okButtonText: 'Save Changes',
          patchValue: patchValue,
          readOnly: readOnly,
          action: action,
          flex: formFlex || 32,
          closeFromOutside: true
        }
      },
      panelClass: 'ihrms-dialog-overlay-panel',
    });

    dialogRef.componentInstance.dialogEventEmitter.subscribe((result: any) => {
      if(result) {
        dashService.gridUpdateAfterDialogRes(
          result, action, dialogRef, rowIndex, rowIndexOrID, dashService, entity, methodName
        );
      }
    });

    return dialogRef;
  }

  gridUpdateAfterDialogRes(result: any, action: string, dialogRef: any, rowIndex: any, rowIndexOrID: any, dashService: any, entity: any, methodName: string) {
    if(result.action === CONSTANTS.FORM_SUBMIT_EVENT && action === CONSTANTS.EDIT) {
      !result.value.id && (result.value.id = result.value._id); // Mongo has _id
      this.apollo.mutate({ mutation: entity, variables: result.value, })
        .pipe(map((res: any) => res?.data[methodName]))
        .subscribe((val: any) => {
          if(val) {
            rowIndexOrID.next({rowIndex, data: val, action: CONSTANTS.EDIT});
            this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
            dialogRef.close();
          }
        }, (error: any) => {
          if(error) {
            const err = error?.error?.error?.validationErrors;
            dialogRef.componentInstance.dialogEventInput$.next({ action: CONSTANTS.FORM_SUBMIT_EVENT, type: CONSTANTS.VALIDATION_ERROR, value: err});
          }
        });
    }
    if(result.action === CONSTANTS.FORM_SUBMIT_EVENT && action === CONSTANTS.ADD_ANY) {
      delete result.value.id;
      delete result.value._id;

      if(methodName === 'createAttendanceCorrection') {
        result.value.inTime = (moment(result.value.punchIn, 'HH:mm a')).date(moment(result.value.date).date());
        result.value.outTime = (moment(result.value.punchOut, 'HH:mm a')).date(moment(result.value.date).date());
      }

      this.apollo.mutate({ mutation: entity, variables: result.value, })
        .pipe(map((res: any) => res?.data[methodName]))
        .subscribe((val: any) => {
          if(val) {
            rowIndexOrID && rowIndexOrID.next({rowIndex, data: val, action: CONSTANTS.ADD});
            this.toastrService.success( `Success`, `Data Added Successfully!`, { } );
            dialogRef.close();
          }
        }, (error: any) => {
          if(error) {
            const err = error?.error?.error?.validationErrors;
            dialogRef.componentInstance.dialogEventInput$.next({ action: CONSTANTS.FORM_SUBMIT_EVENT, type: CONSTANTS.VALIDATION_ERROR, value: err});
          }
        });
    }
    if(result.action === CONSTANTS.FORM_SUBMIT_EVENT && action === CONSTANTS.CANCEL) { // Action Not Required
      dashService.deleteEntity(entity, result.value.id)
        .pipe(map((data: any) => data))
        .subscribe((val: any) => {
          if(val?.success) {
            rowIndexOrID.next({rowIndex, data: val, action: CONSTANTS.CANCEL});
            this.toastrService.warning( `Success`, `Data Deleted Successfully!`, { } );
            dialogRef.close();
            // this.xxGridApi.applyTransaction({ remove: [result] }); // Since we don't have this "this.xxGridApi" directly
          }
        });
    }
  }

  getSelectOptions(controlsObj: any, items: any, formObj: string, optionKey?: string, optionValue?: string) {
    const control = controlsObj.filter((c: any) => c.key === formObj)[0];
    control && (control.options = []);
    control && items?.forEach((vl: any, i: number) => {
      const optKey = optionKey ? items[i][optionKey] : (items[i].id || items[i].statusId);
      const optValue = optionValue ? items[i][optionValue] : (items[i].name || items[i].role_name || items[i].eCode);
      control.options?.push({key: optKey, value: optValue})
      
    });
  }

  getUserManager() {
    const userID = JSON.parse(sessionStorage.getItem('auth-user') || '').userID;
    return this.apollo.watchQuery<any, any>({ query: GQL_USER_BY_ID, variables: { query: { 
      limit: 100,
       id: userID,
      //  approvers:  [{
      //   approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      // }],
    }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getUsers[0]))
  }

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

export const GQL_LEAVE_TYPES = gql`
  query result(
      $query: Pagination!				
  ) {
    getLeaveTypes(
        query: $query
    ) {
      _id
      name
      days
      carryForward
      carryForwardDays
      countWeekends
      status
      comments
      audit {
        created_at
      }
    }
  }
`;

export const GQL_LEAVE_REQUEST = gql`
  query leaveRequestQuery(
    $query: Pagination!				
  ) {
  getLeaveRequests(
      query: $query
  ) {
      days
      userID
      leaveTypeID
      startDate
      endDate
      status
      leaveType {
        name
      }
    }
  }
`;

export const GQL_LEAVE_BALANCE = gql`
  query LeaveBalanceQuery($query: Pagination!) {
    getLeaveBalance(query: $query)
  }
`;

export const GQL_LEAVE_CREATE = gql`
  mutation leaveRequestMutation(
    $userID: ID!
    $startDate: ISODate!
    $endDate: ISODate!
    $days: Int!
    $leaveTypeID: ID
    $toManagerID: ID
    $comments: String
  ) {
    createLeaveRequest(
      userID: $userID
      startDate: $startDate
      endDate: $endDate
      days: $days
      leaveTypeID: $leaveTypeID
      toManagerID: $toManagerID
      comments: $comments
    ) {
      _id
      startDate
      endDate
      days
      leaveTypeID
      toManagerID
      comments

      audit {
        created_at
      }
      status
    }
  }
`;

export const GQL_USER_BY_ID = gql`
  query result(
      $query: Pagination!				
  ) {
    getUsers(
        query: $query
    ) {
      _id
      reportingManagerId
      reportingManager {
        _id
        username
      }
    }
  }
`;

export const GQL_ATTENDANCE_CORRECTION_CREATE = gql`
  mutation CreateAttendanceCorrection(
    $userId: ID!, 
    $toManagerID: ID, 
    $eCode: String, 
    $date: ISODate, 
    $inTime: ISODate, 
    $outTime: ISODate,
    $shiftName: String
    $overTime: Int,
    $totalDayWorkingHours: String,
    $status: String,
    $comments: String
  ) {
    createAttendanceCorrection(
      userId: $userId, 
      toManagerID: $toManagerID, 
      eCode: $eCode, 
      date: $date, 
      inTime: $inTime, 
      outTime: $outTime, 
      shiftName: $shiftName, 
      overTime: $overTime, 
      totalDayWorkingHours: $totalDayWorkingHours, 
      status: $status,
      comments: $comments
    ) {
      _id
      inTime
      outTime
      eCode
      date
      overTime
      shiftName
      toManager {
        username
        _id
      }
      toManagerID
      totalDayWorkingHours
      user {
        username
        _id
      }
      userId
      comments
    }
  }
`;

export const GQL_GET_PAYROLL = gql`
  query Query($query: Pagination!) {
    getPayroll(query: $query) {
      month
      payrollInputs {
        empViewRelease
        payInputs
        payrollProcess
        statementView
      }
      payrolls {
        month
        status
        salaryId
        day_diff
        eCode
        totalDaysAbsent
        totalDaysPresent
        total_overtime_done_by_user
        user_overtime
        user_range_salary
        user_salary
        username
      }
      _id
      audit {
        created_at
        modified_at
      }
    }
  }
`;

export const GQL_SALARY = gql`
  query result(
    $query: Pagination!
  ) {
    getSalary(
      query: $query
    ) {
      _id
      eCode
      month
      username
      effectiveDate
      salaryStructure
      salaryStructureId
      departmentId
      department {
       name
      }
      payHeads {
        _id
        name
        value
        payhead_type
        calculationType
       }
      CTC
      audit {
        created_at
      }
    }
  }
`;