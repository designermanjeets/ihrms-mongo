import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { CONSTANTS } from '@ihrms/shared';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { AdminSettingsService } from '../../admin-settings/_services/admin-settings.service';
import { IhrmsAdminDashboardService } from '../../_services/ihrms-admin-dashboard.service';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { GQL_DESIGNATIONS, GQL_JOB_TITLES, GQL_JOB_TITLES_CREATE, GQL_JOB_TITLES_UPDATE } from '../_services/other-masters.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ihrms-job-title',
  templateUrl: './job-title.component.html',
  styleUrls: ['./job-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobTitleComponent implements OnInit, OnDestroy {

  formJobTitle!: FormGroup;
  jobTitleControls$!: Observable<ControlBase<any>[]>;
  jobTitleControlsObj!: ControlBase<any>[];
  formJobTitleSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  jobTitlesData: any | undefined;
  jobTitleBtnText = CONSTANTS.ADD;
  jobTitlesGridApi!: GridApi;
  jobTitlesGridColumnApi!: ColumnApi;
  jobTitleRowCurrentSelected!: number;
  jobTitleRowIndexOrID: Subject<any> = new Subject();

  sub!: Subscription;

  constructor(
    private _adss: AdminSettingsService,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private cdRef: ChangeDetectorRef,
    private apollo: Apollo,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {

    this.jobTitleControls$ = this._adss.getJobTitleControls();
    this.sub = this.jobTitleControls$.subscribe((cntrls: ControlBase<any>[]) => this.jobTitleControlsObj = cntrls);

    this.jobTitlesData = {
      title: '',
      pagination: true,
      columnFit: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'name' },
          { field: 'comments' },
          { field: 'status', cellRenderer: 'GridStatusComponent' },
          { field: 'designation.name', headerName: 'Designation' },
          { field: 'CustomPolicy' },
          {
            field: 'Action', cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputJobTitlesActions.bind(this),
              value: { actionBtn: ['edit'] }
            }
          }
        ],
        rowData: [],
        updateGridFromOutside: this.jobTitleRowIndexOrID,
      },
      flex: 100
    };

    this.getJobTitles();
    this.getDesignations();

  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  getJobTitles() {
    this.apollo.watchQuery<any, any>({ query: GQL_JOB_TITLES, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getJobTitles))
      .subscribe(val => this.jobTitleRowIndexOrID.next({ rowData: val, action: CONSTANTS.UPDATE}));
  }

  getDesignations() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_DESIGNATIONS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getDesignations))
      .subscribe(val => this._ihrmsadss.getSelectOptions(this.jobTitleControlsObj, val, 'designationId', '_id'));
  }

  // Employee Type form
  jobTitleFormSubmitEvent(event: any) {
    if(this.jobTitleBtnText === CONSTANTS.EDIT) {
      const paylaod = { ...event, id: event._id }
      this.apollo.mutate({ mutation: GQL_JOB_TITLES_UPDATE, variables: paylaod })
        .pipe(map((data: any) => data?.data?.editJobTitle))
        .subscribe(val => {
          if(val) {
            this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
            this.jobTitleRowIndexOrID.next({rowIndex: this.jobTitleRowCurrentSelected, data: val, action: CONSTANTS.EDIT});
          }
        });
    }
    if(this.jobTitleBtnText === CONSTANTS.ADD) {
      delete event.id;
      this.apollo.mutate({ mutation: GQL_JOB_TITLES_CREATE, variables: event })
        .pipe(map((data: any) => data?.data?.createJobTitle))
        .subscribe(val => {
          if(val) {
            this.toastrService.success( `Success`, `Data Created Successfully!`, { } );
            this.jobTitleRowIndexOrID.next({ data: val, action: CONSTANTS.ADD});
          }
        });
    }
    //
    this.jobTitleBtnText = CONSTANTS.ADD;
    this.formJobTitle.reset();

  }

  jobTitleFormObjectEvent(form: FormGroup) {
    this.formJobTitle = form;
  }

  onJobTitleSaveEvent(event: any) {
    this.formJobTitleSubmit$.next(true);
  }

  onJobTitlesGridReady(event: any) {
    this.jobTitlesGridApi = event.gridApi;
    this.jobTitlesGridColumnApi = event.gridColumnApi;
  }

  outputJobTitlesActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formJobTitle.patchValue(fData);
      this.jobTitleBtnText = CONSTANTS.EDIT;
      this.jobTitleRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      this._ihrmsadss.deleteEntity(CONSTANTS.TITLES.JobTitle, event.params.data.id)
        .pipe(map((data: any) => data))
        .subscribe((val: any) => {
          if(val?.success) {
            // this.jobTitleRowIndexOrID.next({rowIndex: this.jobTitleRowCurrentSelected, data: val, action: CONSTANTS.CANCEL});
            this.jobTitlesGridApi.applyTransaction({ remove: [event.params.data] });
            this._ihrmsadss.updateGridData(this.jobTitlesGridApi, this.jobTitlesData, this.cdRef);
          }
        });
    }
  }

}
