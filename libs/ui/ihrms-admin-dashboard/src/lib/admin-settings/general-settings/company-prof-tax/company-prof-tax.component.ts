import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map, Observable, Subject, Subscription } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { GeneralSettingsService, GQL_TENANTS_BY_ID, GQL_UPDATE_TENANT } from '../_services/general-settings.service';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { CONSTANTS } from '@ihrms/shared';
import { IhrmsAdminDashboardService } from '../../../_services/ihrms-admin-dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ihrms-company-prof-tax',
  templateUrl: './company-prof-tax.component.html',
  styleUrls: ['./company-prof-tax.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyProfTaxComponent implements OnInit, AfterViewInit {

  form!: FormGroup;
  controls$!: Observable<ControlBase<any>[]>;
  formSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  gridData: any | undefined;
  gridApi!: GridApi;
  columnApi!: ColumnApi;
  rowCurrentSelected: number | undefined | null;
  rowIndexOrID: Subject<any> = new Subject();

  sub!: Subscription;

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _gss: GeneralSettingsService,
    private _ads: IhrmsAdminDashboardService,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private apollo: Apollo,
  ) { }

  ngOnInit(): void {
    this.controls$ = this._gss.getProfTaxControls();

    this.gridData = {
      title: 'Tax Slabs based on Yearly Gross Salary',
      columnFit: true,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'START RANGE (₹)', editable: true },
          { field: 'END RANGE (₹)', editable: true },
          { field: 'MONTHLY TAX AMOUNT (₹)', editable: true },
        ],
        rowData: [
          {
            'START RANGE (₹)': '1',
            'END RANGE (₹)': '250000',
            'MONTHLY TAX AMOUNT (₹)': '0'
          },
          {
            'START RANGE (₹)': '250001',
            'END RANGE (₹)': '999999999',
            'MONTHLY TAX AMOUNT (₹)': '200'
          },
        ],
        updateGridFromOutside: this.rowIndexOrID,
      },
      flex: 100
    };

  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  getCompanyByID() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_TENANTS_BY_ID, variables: { query: { limit: 100, id: sessionStorage.getItem('tenantId') }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getTenants[0]))
      .subscribe(val => {
        this.form.get('_id')?.patchValue(val._id);
        this.form.get('companyName')?.patchValue(val.name);
        this.form.patchValue(val.professionalTax);
      });
  }

  formSubmitEvent(event: any) {
    const payload = {
      id: event._id,
      name: event.companyName,
      professionalTax: {
        workLocation: event.workLocation,
        PTNumber: event.PTNumber,
        deductionCycle: event.deductionCycle,
      },
    }
    this.sub = this.apollo.mutate({ mutation: GQL_UPDATE_TENANT, variables: payload, })
    .pipe(map((data: any) => data?.data.editTenant))
    .subscribe(val => {
      if(val) {
        this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
        this.form.get('_id')?.patchValue(val._id);
        this.form.get('companyName')?.patchValue(val.name);
        this.form.patchValue(val.professionalTax);
      }
    });
  }

  formObjectEvent(form: FormGroup) {
    this.form = form;
    this.getCompanyByID();
  }

  onAddEvent(event: any) {
    this.formSubmit$.next(true);
  }

  onGridReady(event: any) {
    this.gridApi = event.gridApi;
    this.columnApi = event.gridColumnApi;
  }

  onClickHandler(event: any) {
    if(event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if(event.action === CONSTANTS.GRID_ADD_ROW) {
        this.rowIndexOrID.next({rowIndex: this.gridApi.getDisplayedRowCount() + 1, data: [], action: CONSTANTS.ADD});
        this._ads.updateGridData(this.gridApi, this.gridData, this.cdRef); // Force Update
        this.gridApi.setFocusedCell(this.gridApi.getDisplayedRowCount() - 1, 'START RANGE (₹)');
        this.gridApi.startEditingCell({ rowIndex: this.gridApi.getDisplayedRowCount() - 1, colKey: 'START RANGE (₹)' });
      }
      if(event.action === CONSTANTS.GRID_REMOVE_ROW) {
        if(this.rowCurrentSelected !== null && this.rowCurrentSelected !== undefined) {
          const dialogRef = this.openDialog();
          dialogRef.afterClosed().subscribe((val: boolean) => {
            if(val) {
              this.rowIndexOrID.next({rowIndex: this.rowCurrentSelected, data: [], action: CONSTANTS.CANCEL});
              this._ads.updateGridData(this.gridApi, this.gridData, this.cdRef); // Force Update
              this.rowCurrentSelected = null;
            }
          });
        } else {
          this.toastrService.error(`Select as least one row to delete!`, `No Selection`, {});
        }
      }
      if(event.action === CONSTANTS.ON_ROW_SELECTED) {
        this.rowCurrentSelected = event.event?.rowIndex;
      }
    }
  }

  openDialog(): any {
    return this.dialog.open(this.confirmDialog, {
      panelClass: ['ihrms-dialog-overlay-panel', 'confirm-dialog-panel'],
    });
  }

}
