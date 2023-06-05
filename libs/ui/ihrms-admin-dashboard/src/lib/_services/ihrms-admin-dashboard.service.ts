import { ChangeDetectorRef, Injectable } from '@angular/core';
import { CONSTANTS, SharedService } from '@ihrms/shared';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { IhrmsDialogComponent } from '@ihrms/ihrms-components';
import { Apollo, gql } from 'apollo-angular';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class IhrmsAdminDashboardService {

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

  getEntityAll(Entity: string) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/GetAll`);
  }

  getEntityAllByUserID(Entity: string, UserId: number) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/GetAllByUserId?UserId=${UserId}`);
  }

  getEntityByAction(Entity: string, Action: string) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/${Action}`);
  }

  getEntityAllWithParams(Entity: string, Action: string | undefined, Params: string) {
    return this.http.get(`${this.environment.apiURL}/services/app/${Entity}/${Action}?${Params}`);
  }

  createEntity(Entity: string, Data: any) {
    return this.http.post(`${this.environment.apiURL}/services/app/${Entity}/Create`, Data);
  }

  createEntityWithAction(Entity: string, Action: string | undefined, Data: any) {
    return this.http.post(`${this.environment.apiURL}/services/app/${Entity}/${Action}`, Data);
  }

  updateEntity(Entity: string, data: any) {
    return this.http.put(`${this.environment.apiURL}/services/app/${Entity}/Update`, data);
  }

  deleteEntity(Entity: string, ID: number) {
    return this.http.delete(`${this.environment.apiURL}/services/app/${Entity}/Delete?Id=${ID}`);
  }

  autoSizeAll(gridColumnApi: any, skipHeader: any) {
    const allColumnIds: any[] = [];
    gridColumnApi.getAllColumns().forEach(function (column: any) {
      allColumnIds.push(column.colId);
    });
    gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  dynamicCompClickHandler(event: any, compService: any, dashService: any, rowIndexOrID: any, entityAction: string, entity: any, dialog: any, GQL?: any, methodName?: string) {
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
        rowIndexOrID,
        GQL,
        dialog,
        'getAttendanceTimeCorrectionsControls',
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
      return dashService.openAddEntityDialog(
        CONSTANTS.TITLES[OBJ],
        CONSTANTS.EDIT,
        event.params.node.id,
        event.params.data,
        undefined,
        compService,
        dashService,
        rowIndexOrID,
        GQL,
        dialog,
        undefined,
        undefined,
        methodName
      );
    }
    if(event.action === CONSTANTS.VISIBILITY ) {
      return dashService.openAddEntityDialog(
        CONSTANTS.TITLES[entity],
        CONSTANTS.VISIBILITY,
        event.params.node.id,
        event.params.data,
        true,
        compService,
        dashService,
        rowIndexOrID,
        GQL,
        dialog,
        undefined,
        undefined,
        methodName
      );
    }
    if(event.action === CONSTANTS.CANCEL ) {
      const OBJ = ('Delete'+entity as any).replaceAll(/\s/g,'');
      return dashService.openAddEntityDialog(
        CONSTANTS.TITLES[OBJ],
        CONSTANTS.CANCEL,
        event.params.node.id,
        event.params.data,
        true,
        compService,
        dashService,
        rowIndexOrID,
        GQL,
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
    if(methodName === 'createAttendanceCorrection') {
      result.value?.inTime && (result.value.inTime = (moment(result.value.inTime, 'HH:mm a')).date(moment(result.value.date).date()));
      result.value?.outTime && (result.value.outTime = (moment(result.value.outTime, 'HH:mm a')).date(moment(result.value.date).date()));
    }
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
      this.apollo.mutate({ mutation: entity, variables: result.value, })
        .pipe(map((res: any) => res?.data[methodName]))
        .subscribe((val: any) => {
          if(val) {
            rowIndexOrID.next({rowIndex, data: val, action: CONSTANTS.ADD});
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

  updateSelectedControl(controlsObj: any, formObj: string, currAttr: string, updatedAttr: string | boolean) {
    const control = controlsObj.filter((c: any) => c.key === formObj)[0];
    control && (control[currAttr] = updatedAttr);
  }

  updateGridData(gridApi: GridApi, grid: any, cdRef?: ChangeDetectorRef) {
    const items: Array<any> = [];
    gridApi.forEachNode( (node: any) => items.push(node.data));
    grid.gridData.rowData = items;
    cdRef && cdRef.detectChanges();
  }

  getLocalTimeZone(date: any, time: any) {
    const local = new Date(date); //  + 'Z'
    const new_local = moment(local).add(time, 'hours');
    return new_local.format('hh:mm A');
  }
  
  getCurrentZoneTime(d: any) {
    return moment(d).format('MM/DD/YYYY');
  }
  
  convertLocalTime(time: any) {
    if(time) {
       const testDateUtc = moment(time);
       const localDate = moment(testDateUtc).local();
       return localDate.format('MM/DD/YYYY hh:mm A');
    }
    return '';
  }

  getUserManager() {
    const userID = JSON.parse(sessionStorage.getItem('auth-user') || '').userID;
    return this.apollo.watchQuery<any, any>({ query: GQL_USER_BY_ID, variables: { query: { 
      limit: 100, 
      id: userID,
      // approvers:  [{
      //   approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      // }],
    }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getUsers[0]))
  }

}

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
