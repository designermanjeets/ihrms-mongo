import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map, Observable, Subject, Subscription } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { GQL_ADD_PAYHEAD, GQL_EDIT_PAYHEAD, GQL_PAYFORMULAS, GQL_PAYHEADS, SalarySettingsService } from '../_services/salary-settings.service';
import { CONSTANTS } from '@ihrms/shared';
import { MatDialog } from '@angular/material/dialog';
import { PayFormulaComponent } from '../pay-formula/pay-formula.component';
import { IhrmsAdminDashboardService } from '../../../_services/ihrms-admin-dashboard.service';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ihrms-pay-head',
  templateUrl: './pay-head.component.html',
  styleUrls: ['./pay-head.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayHeadComponent implements OnInit {

  payHeadChartData: any | undefined;
  payHeadBtnText = 'Add Pay Head';
  payHeadGridApi!: GridApi;
  payHeadGridColumnApi!: ColumnApi;
  formPayHead!: FormGroup;
  payHeadRowCurrentSelected!: number;
  payHeadRowIndexOrID: Subject<any> = new Subject();

  payHeadControls$!: Observable<ControlBase<any>[]>;
  payHeadControlsObj!: ControlBase<any>[];
  formPayHeadSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  sub!: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _sls: SalarySettingsService,
    public dialog: MatDialog,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private apollo: Apollo,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {

    this.payHeadControls$ = this._sls.getPayHeadControls();
    this.payHeadControls$.subscribe(val => this.payHeadControlsObj = val);

    this.payHeadChartData = {
      title: '',
      pagination: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          {
            field: 'Action', cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputPayHeadActions.bind(this),
              value: { actionBtn: ['edit'] }
            }
            , autoHeight: true
          },
          { field: 'name' },
          { field: 'namePayslip' },
          { field: 'payhead_type', headerName: 'PayHeadType' },
          { field: 'stattutoryPaytype', headerName: 'StatutoryPayType' },
          { field: 'underAccountGroup' },
          { field: 'affectNetSalary', cellRenderer: 'GridCheckBoxComponent', autoHeight: true },
          { field: 'currencyOfLedger' },
          { field: 'calculationType' },
          { field: 'calculationPeroid' },
          { field: 'computedFormula.name' },
          { field: 'effectiveFrom' },
          { field: 'amountGreaterThan' },
          { field: 'amountUpto' },
          { field: 'slabType' },
          { field: 'slabValue' },
          { field: 'roundOff' },
          { field: 'limit' },
        ],
        rowData: [],
        updateGridFromOutside: this.payHeadRowIndexOrID,
      },
      flex: 100
    };

    this.getPayHeads();
    this.getPayFormulas();

  }

  getPayHeads() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_PAYHEADS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getPayHeads))
      .subscribe(val => this.payHeadRowIndexOrID.next({rowData: val, action: CONSTANTS.UPDATE}));
  }

  getPayFormulas() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_PAYFORMULAS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getPayFormulas))
      .subscribe(val => this._ihrmsadss.getSelectOptions(this.payHeadControlsObj, val, 'computedFormulaID', '_id'));
  }

  formPayHeadSubmitEvent(event: any) {
    if(this.formPayHead.valid) {
      if(this.payHeadBtnText === 'Edit Pay Head') {
        event.id = event._id;
        this.sub = this.apollo.mutate({ mutation: GQL_EDIT_PAYHEAD, variables: event })
          .pipe(map((data: any) => data?.data?.editPayHead))
          .subscribe(val => {
            if(val) {
              this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
              this.getPayHeads();
              // this.payHeadRowIndexOrID.next({rowIndex: this.payHeadRowCurrentSelected, data: event, action: CONSTANTS.EDIT});
              this.payHeadBtnText = 'Add Salary Head';
              this.formPayHead.reset();
            }
          });
      }
      if(this.payHeadBtnText === 'Add Pay Head') {
        this.sub = this.apollo.mutate({ mutation: GQL_ADD_PAYHEAD, variables: event })
          .pipe(map((data: any) => data?.data?.createPayHead))
          .subscribe(val => {
            if(val) {
              this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
              this.getPayHeads();
              // this.payHeadRowIndexOrID.next({ data: event, action: CONSTANTS.ADD});
              this.payHeadBtnText = 'Add Salary Head';
              this.formPayHead.reset();
            }
          });
      }
    }
  }

  formPayHeadObjectEvent(form: FormGroup) {
    this.formPayHead = form;

    this.formPayHead.get('calculationType')?.valueChanges.subscribe(val => {
      if(val === 'UserDefinedValue') {
        this._ihrmsadss.updateSelectedControl(this.payHeadControlsObj, 'computedFormulaID', 'controlType', 'hidden');
      } else {
        this._ihrmsadss.updateSelectedControl(this.payHeadControlsObj, 'computedFormulaID', 'controlType', 'dropdown');
      }
    })
  }

  formPayHeadClickEvent(event: any) {
    const dialogRef = this.dialog.open(PayFormulaComponent, {
      data: { dialog: true, okButtonText: 'Save Changes', action: 'Add' },
      // panelClass: 'ihrms-dialog-overlay-panel',
      width: '95vw',
      height: '96vh'
    });

    dialogRef.componentInstance.dialogEventEmitter.subscribe((result: any) => {
      if (result) {
        if (result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
          console.log(result);
        }
      }
    });
  }

  onPayHeadAddEvent(event: any) {
    this.formPayHeadSubmit$.next(true);
  }

  onPayHeadGridReady(event: any) {
    this.payHeadGridApi = event.gridApi;
    this.payHeadGridColumnApi = event.gridColumnApi;
  }

  outputPayHeadActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      this.formPayHead.reset();
      this.formPayHead.patchValue(event.params.data);
      this.formPayHead.get('computedFormulaID')?.patchValue(event.params.data?.computedFormula?._id);
      this.payHeadBtnText = 'Edit Pay Head';
      this.payHeadRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      this._ihrmsadss.openAddEntityDialog(
        CONSTANTS.TITLES.PayHead,
        CONSTANTS.CANCEL,
        event?.params?.rowIndex,
        event?.params?.data,
        true,
        this._sls,
        this._ihrmsadss,
        this.payHeadRowIndexOrID,
        CONSTANTS.TITLES.PayHead,
        this.dialog,
        'getPayHeadControls',
        23
      );
    }
  }

}
