import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { GeneralSettingsService, GQL_TENANTS_BY_ID, GQL_UPDATE_TENANT } from '../_services/general-settings.service';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ihrms-company-epf',
  templateUrl: './company-epf.component.html',
  styleUrls: ['./company-epf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyEpfComponent implements OnInit, AfterViewInit {

  form!: FormGroup;
  controls$!: Observable<ControlBase<any>[]>;
  formSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  gridData: any | undefined;

  sub!: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _gss: GeneralSettingsService,
    private apollo: Apollo,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.controls$ = this._gss.getEPFControls();

    this.gridData = {
      title: 'Contribution Details',
      columnFit: true,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'SUB COMPONENTS' },
          { field: 'EMPLOYEES\' CONTRIBUTION' },
          { field: 'EMPLOYER\'S CONTRIBUTION' },
        ],
        rowData: [
          {
            'SUB COMPONENTS': 'Employees\' Provident Fund (EPF)',
            'EMPLOYEES\' CONTRIBUTION': '12.00% of PF Wage',
            'EMPLOYER\'S CONTRIBUTION': '3.67% of PF Wage'
          },
          {
            'SUB COMPONENTS': 'Employees\' Pension Scheme',
            'EMPLOYEES\' CONTRIBUTION': 'NA',
            'EMPLOYER\'S CONTRIBUTION': '8.33% of PF Wage'
          },
          {
            'SUB COMPONENTS': 'EPF Admin Charges',
            'EMPLOYEES\' CONTRIBUTION': 'NA',
            'EMPLOYER\'S CONTRIBUTION': '0.50% of PF Wage'
          },
        ],
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
        this.form.patchValue(val.epf);
      });
  }

  formSubmitEvent(event: any) {
    const payload = {
      id: event._id,
      name: event.companyName,
      epf: {
        EPFNumber: event.EPFNumber,
        deductionCycle: event.deductionCycle,
        employerContributionRate: event.employerContributionRate,
        employeeContributionRate: event.employeeContributionRate,
        includeEmployerContributionInCTC: event.includeEmployerContributionInCTC,
        overridePFContriAtEmployeeLevel: event.overridePFContriAtEmployeeLevel,
        proRateRestrictedPFWage: event.proRateRestrictedPFWage,
        considerAllIfWageLessThanAmount: event.considerAllIfWageLessThanAmount,
      },
    }
    this.sub = this.apollo.mutate({ mutation: GQL_UPDATE_TENANT, variables: payload, })
    .pipe(map((data: any) => data?.data.editTenant))
    .subscribe(val => {
      if(val) {
        this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
        this.form.get('_id')?.patchValue(val._id);
        this.form.get('companyName')?.patchValue(val.name);
        this.form.patchValue(val.epf);
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

}
