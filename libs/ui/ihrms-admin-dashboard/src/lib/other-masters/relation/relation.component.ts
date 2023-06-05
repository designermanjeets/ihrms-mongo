import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { CONSTANTS } from '@ihrms/shared';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { AdminSettingsService } from '../../admin-settings/_services/admin-settings.service';
import { IhrmsAdminDashboardService } from '../../_services/ihrms-admin-dashboard.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ihrms-relation',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelationComponent implements OnInit {

  formRelation!: FormGroup;
  relationControls$!: Observable<ControlBase<any>[]>;
  formRelationSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  relationsData: any | undefined;
  relationBtnText = CONSTANTS.ADD;
  relationsGridApi!: GridApi;
  relationsGridColumnApi!: ColumnApi;
  relationRowCurrentSelected!: number;
  relationRowIndexOrID: Subject<any> = new Subject();

  constructor(
    private _adss: AdminSettingsService,
    private _ihrmsadss: IhrmsAdminDashboardService
  ) { }

  ngOnInit(): void {

    this.relationControls$ = this._adss.getRelationControls();

    this.relationsData = {
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
              action: this.outputRelationsActions.bind(this),
              value: { actionBtn: ['edit', 'cancel'] }
            }
          }
        ],
        rowData: [],
        updateGridFromOutside: this.relationRowIndexOrID,
      },
      flex: 100
    };

    this.getRelations();

  }

  getRelations() {
    this._ihrmsadss.getEntityAll(CONSTANTS.TITLES.Relation)
      .pipe(map((data: any) => data?.result?.items))
      .subscribe(val => this.relationsData.gridData.rowData = val);
  }

  // Employee Type form
  relationFormSubmitEvent(event: any) {
    if(this.relationBtnText === CONSTANTS.EDIT) {
      this._ihrmsadss.updateEntity(CONSTANTS.TITLES.Relation, event)
        .pipe(map((data: any) => data?.result))
        .subscribe(val => {
          if(val) {
            this.relationRowIndexOrID.next({rowIndex: this.relationRowCurrentSelected, data: val, action: CONSTANTS.EDIT});
          }
        });
    }
    if(this.relationBtnText === CONSTANTS.ADD) {
      delete event.id;
      this._ihrmsadss.createEntity(CONSTANTS.TITLES.Relation ,event)
        .pipe(map((data: any) => data?.result))
        .subscribe(val => {
          if(val) {
            this.relationRowIndexOrID.next({rowIndex: this.relationRowCurrentSelected, data: val, action: CONSTANTS.ADD});
          }
        });
    }
    //
    this.relationBtnText = CONSTANTS.ADD;
    this.formRelation.reset();
  }

  relationFormObjectEvent(form: FormGroup) {
    this.formRelation = form;
  }

  onRelationSaveEvent(event: any) {
    this.formRelationSubmit$.next(true);
  }

  onRelationsGridReady(event: any) {
    this.relationsGridApi = event.gridApi;
    this.relationsGridColumnApi = event.gridColumnApi;
  }

  outputRelationsActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formRelation.patchValue({
        id: fData.id,
        name: fData.name || '',
        comments: fData.comments || '',
        CustomPolicy: null,
      });
      this.relationBtnText = CONSTANTS.EDIT;
      this.relationRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      this._ihrmsadss.deleteEntity(CONSTANTS.TITLES.Relation, event.params.data.id)
        .pipe(map((data: any) => data))
        .subscribe((val: any) => {
          if(val?.success) {
            // this.relationRowIndexOrID.next({rowIndex: this.relationRowCurrentSelected, data: val, action: CONSTANTS.CANCEL});
            this.relationsGridApi.applyTransaction({ remove: [event.params.data] });
          }
        });
    }
  }

}

