import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { CONSTANTS } from '@ihrms/shared';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { AdminSettingsService } from '../../admin-settings/_services/admin-settings.service';
import { IhrmsAdminDashboardService } from '../../_services/ihrms-admin-dashboard.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ihrms-blood-group',
  templateUrl: './blood-group.component.html',
  styleUrls: ['./blood-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BloodGroupComponent implements OnInit {

  formBloodGroup!: FormGroup;
  bloodGroupControls$!: Observable<ControlBase<any>[]>;
  formBloodGroupSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  bloodGroupsData: any | undefined;
  bloodGroupBtnText = CONSTANTS.ADD;
  bloodGroupsGridApi!: GridApi;
  bloodGroupsGridColumnApi!: ColumnApi;
  bloodGroupRowCurrentSelected!: number;
  bloodGroupRowIndexOrID: Subject<any> = new Subject();

  constructor(
    private _adss: AdminSettingsService,
    private _ihrmsadss: IhrmsAdminDashboardService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.bloodGroupControls$ = this._adss.getBloodGroupControls();

    this.bloodGroupsData = {
      title: '',
      pagination: true,
      columnFit: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'id' },
          { field: 'name' },
          { field: 'comments' },
          { field: 'CustomPolicy' },
          {
            field: 'Action', cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputBloodGroupsActions.bind(this),
              value: { actionBtn: ['edit', 'cancel'] }
            }
          }
        ],
        rowData: [],
        updateGridFromOutside: this.bloodGroupRowIndexOrID,
      },
      flex: 100
    };

    this.getBloodGroups();

  }

  getBloodGroups() {
    this._ihrmsadss.getEntityAll(CONSTANTS.TITLES.BloodGroup)
      .pipe(map((data: any) => data?.result?.items))
      .subscribe(val => this.bloodGroupsData.gridData.rowData = val);
  }

  // Employee Type form
  bloodGroupFormSubmitEvent(event: any) {
    if(this.bloodGroupBtnText === CONSTANTS.EDIT) {
      this._ihrmsadss.updateEntity(CONSTANTS.TITLES.BloodGroup, event)
        .pipe(map((data: any) => data?.result))
        .subscribe(val => {
          if(val) {
            this.bloodGroupRowIndexOrID.next({rowIndex: this.bloodGroupRowCurrentSelected, data: val, action: CONSTANTS.EDIT});
          }
        });
    }
    if(this.bloodGroupBtnText === CONSTANTS.ADD) {
      delete event.id;
      this._ihrmsadss.createEntity(CONSTANTS.TITLES.BloodGroup ,event)
        .pipe(map((data: any) => data?.result))
        .subscribe(val => {
          if(val) {
            this.bloodGroupRowIndexOrID.next({rowIndex: this.bloodGroupRowCurrentSelected, data: val, action: CONSTANTS.ADD});
          }
        });
    }
    //
    this.bloodGroupBtnText = CONSTANTS.ADD;
    this.formBloodGroup.reset();
  }

  bloodGroupFormObjectEvent(form: FormGroup) {
    this.formBloodGroup = form;
  }

  onBloodGroupSaveEvent(event: any) {
    this.formBloodGroupSubmit$.next(true);
  }

  onBloodGroupsGridReady(event: any) {
    this.bloodGroupsGridApi = event.gridApi;
    this.bloodGroupsGridColumnApi = event.gridColumnApi;
  }

  outputBloodGroupsActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formBloodGroup.patchValue({
        id: fData.id,
        name: fData.name || '',
        comments: fData.comments || '',
        CustomPolicy: null,
      });
      this.bloodGroupBtnText = CONSTANTS.EDIT;
      this.bloodGroupRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      const dialogRef = this._ihrmsadss.openAddEntityDialog(
        CONSTANTS.TITLES.BloodGroup,
        CONSTANTS.CANCEL,
        event?.params?.rowIndex,
        event?.params?.data,
        true,
        this._adss,
        this._ihrmsadss,
        this.bloodGroupRowIndexOrID,
        CONSTANTS.TITLES.BloodGroup,
        this.dialog,
        'getBloodGroupControls'
      );
    }
  }

}
