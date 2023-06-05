import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { CONSTANTS } from '@ihrms/shared';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { AdminSettingsService } from '../../admin-settings/_services/admin-settings.service';
import { IhrmsAdminDashboardService } from '../../_services/ihrms-admin-dashboard.service';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { GQL_MODE_OF_EMPLOYMENTS, GQL_MODE_OF_EMPLOYMENTS_CREATE, GQL_MODE_OF_EMPLOYMENTS_UPDATE } from '../_services/other-masters.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ihrms-mode-of-employment',
  templateUrl: './mode-of-employment.component.html',
  styleUrls: ['./mode-of-employment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModeOfEmploymentComponent implements OnInit {

  formModeOfEmployment!: FormGroup;
  modeOfEmploymentControls$!: Observable<ControlBase<any>[]>;
  formModeOfEmploymentSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  modeOfEmploymentsData: any | undefined;
  modeOfEmploymentBtnText = CONSTANTS.ADD;
  modeOfEmploymentsGridApi!: GridApi;
  modeOfEmploymentsGridColumnApi!: ColumnApi;
  modeOfEmploymentRowCurrentSelected!: number;
  modeOfEmploymentRowIndexOrID: Subject<any> = new Subject();

  sub!: Subscription;

  constructor(
    private _adss: AdminSettingsService,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private apollo: Apollo,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {

    this.modeOfEmploymentControls$ = this._adss.getModeOfEmploymentControls();

    this.modeOfEmploymentsData = {
      title: '',
      pagination: true,
      columnFit: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'name' },
          { field: 'status', cellRenderer: 'GridStatusComponent' },
          { field: 'comments' },
          { field: 'CustomPolicy' },
          {
            field: 'Action', cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputModeOfEmploymentsActions.bind(this),
              value: { actionBtn: ['edit'] }
            }
          }
        ],
        rowData: [],
        updateGridFromOutside: this.modeOfEmploymentRowIndexOrID,
      },
      flex: 100
    };

    this.getModeOfEmployments();

  }

  getModeOfEmployments() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_MODE_OF_EMPLOYMENTS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getModeOfEmployments))
      .subscribe(val => this.modeOfEmploymentRowIndexOrID.next({ rowData: val, action: CONSTANTS.UPDATE}));
  }

  // Employee Type form
  modeOfEmploymentFormSubmitEvent(event: any) {
    if(this.modeOfEmploymentBtnText === CONSTANTS.EDIT) {
      const paylaod = { ...event, id: event._id }
      this.apollo.mutate({ mutation: GQL_MODE_OF_EMPLOYMENTS_UPDATE, variables: paylaod })
        .pipe(map((data: any) => data?.data?.editModeOfEmployment))
        .subscribe(val => {
          if(val) {
            this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
            this.modeOfEmploymentRowIndexOrID.next({rowIndex: this.modeOfEmploymentRowCurrentSelected, data: val, action: CONSTANTS.EDIT});
          }
        });
    }
    if(this.modeOfEmploymentBtnText === CONSTANTS.ADD) {
      delete event.id;
      this.apollo.mutate({ mutation: GQL_MODE_OF_EMPLOYMENTS_CREATE, variables: event })
        .pipe(map((data: any) => data?.data?.createModeOfEmployment))
        .subscribe(val => {
          if(val) {
            this.toastrService.success( `Success`, `Data Created Successfully!`, { } );
            this.modeOfEmploymentRowIndexOrID.next({ data: val, action: CONSTANTS.ADD});
          }
        });
    }
    //
    this.modeOfEmploymentBtnText = CONSTANTS.ADD;
    this.formModeOfEmployment.reset();
  }

  modeOfEmploymentFormObjectEvent(form: FormGroup) {
    this.formModeOfEmployment = form;
  }

  onModeOfEmploymentSaveEvent(event: any) {
    this.formModeOfEmploymentSubmit$.next(true);
  }

  onModeOfEmploymentsGridReady(event: any) {
    this.modeOfEmploymentsGridApi = event.gridApi;
    this.modeOfEmploymentsGridColumnApi = event.gridColumnApi;
  }

  outputModeOfEmploymentsActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formModeOfEmployment.patchValue(fData);
      this.modeOfEmploymentBtnText = CONSTANTS.EDIT;
      this.modeOfEmploymentRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      this._ihrmsadss.deleteEntity(CONSTANTS.TITLES.ModeOfEmployement, event.params.data.id)
        .pipe(map((data: any) => data))
        .subscribe((val: any) => {
          if(val?.success) {
            // this.modeOfEmploymentRowIndexOrID.next({rowIndex: this.modeOfEmploymentRowCurrentSelected, data: val, action: CONSTANTS.CANCEL});
            this.modeOfEmploymentsGridApi.applyTransaction({ remove: [event.params.data] });
          }
        });
    }
  }

}
