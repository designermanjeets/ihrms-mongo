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
  selector: 'ihrms-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent implements OnInit {

  formTitle!: FormGroup;
  titleControls$!: Observable<ControlBase<any>[]>;
  formTitleSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  titlesData: any | undefined;
  titleBtnText = CONSTANTS.ADD;
  titlesGridApi!: GridApi;
  titlesGridColumnApi!: ColumnApi;
  titleRowCurrentSelected!: number;
  titleRowIndexOrID: Subject<any> = new Subject();

  constructor(
    private _adss: AdminSettingsService,
    private _ihrmsadss: IhrmsAdminDashboardService
  ) { }

  ngOnInit(): void {

    this.titleControls$ = this._adss.getTitleControls();

    this.titlesData = {
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
              action: this.outputTitlesActions.bind(this),
              value: { actionBtn: ['edit', 'cancel'] }
            }
          }
        ],
        rowData: [],
        updateGridFromOutside: this.titleRowIndexOrID,
      },
      flex: 100
    };

    this.getTitles();

  }

  getTitles() {
    this._ihrmsadss.getEntityAll(CONSTANTS.TITLES.Title)
      .pipe(map((data: any) => data?.result?.items))
      .subscribe(val => this.titlesData.gridData.rowData = val);
  }

  // Employee Type form
  titleFormSubmitEvent(event: any) {
    if(this.titleBtnText === CONSTANTS.EDIT) {
      this._ihrmsadss.updateEntity(CONSTANTS.TITLES.Title, event)
        .pipe(map((data: any) => data?.result))
        .subscribe(val => {
          if(val) {
            this.titleRowIndexOrID.next({rowIndex: this.titleRowCurrentSelected, data: val, action: CONSTANTS.EDIT});
          }
        });
    }
    if(this.titleBtnText === CONSTANTS.ADD) {
      delete event.id;
      this._ihrmsadss.createEntity(CONSTANTS.TITLES.Title ,event)
        .pipe(map((data: any) => data?.result))
        .subscribe(val => {
          if(val) {
            this.titleRowIndexOrID.next({rowIndex: this.titleRowCurrentSelected, data: val, action: CONSTANTS.ADD});
          }
        });
    }
    //
    this.titleBtnText = CONSTANTS.ADD;
    this.formTitle.reset();
  }

  titleFormObjectEvent(form: FormGroup) {
    this.formTitle = form;
  }

  onTitleSaveEvent(event: any) {
    this.formTitleSubmit$.next(true);
  }

  onTitlesGridReady(event: any) {
    this.titlesGridApi = event.gridApi;
    this.titlesGridColumnApi = event.gridColumnApi;
  }

  outputTitlesActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formTitle.patchValue({
        id: fData.id,
        name: fData.name || '',
        comments: fData.comments || '',
        CustomPolicy: null,
      });
      this.titleBtnText = CONSTANTS.EDIT;
      this.titleRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      this._ihrmsadss.deleteEntity(CONSTANTS.TITLES.Title, event.params.data.id)
        .pipe(map((data: any) => data))
        .subscribe((val: any) => {
          if(val?.success) {
            // this.titleRowIndexOrID.next({rowIndex: this.titleRowCurrentSelected, data: val, action: CONSTANTS.CANCEL});
            this.titlesGridApi.applyTransaction({ remove: [event.params.data] });
          }
        });
    }
  }

}
