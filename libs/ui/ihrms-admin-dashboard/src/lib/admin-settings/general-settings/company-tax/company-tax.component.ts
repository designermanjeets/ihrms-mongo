import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { GeneralSettingsService, GQL_TENANTS_BY_ID, GQL_UPDATE_TENANT } from '../_services/general-settings.service';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ihrms-company-tax',
  templateUrl: './company-tax.component.html',
  styleUrls: ['./company-tax.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyTaxComponent implements OnInit, AfterViewInit {

  form!: FormGroup;
  controls$!: Observable<ControlBase<any>[]>;
  formSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  sub!: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _gss: GeneralSettingsService,
    private apollo: Apollo,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.controls$ = this._gss.getCompanyTaxControls();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  getCompanyByID() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_TENANTS_BY_ID, variables: { query: { limit: 100, id: sessionStorage.getItem('tenantId') }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getTenants[0]))
      .subscribe(val => {
        this.form.get('_id')?.patchValue(val._id);
        this.form.get('companyName')?.patchValue(val.name);
        this.form.patchValue(val.tax);
      });
  }

  formSubmitEvent(event: any) {
    const payload = {
      id: event._id,
      name: event.companyName,
      tax: {
        PAN: event.PAN,
        taxPayFrequency: event.taxPayFrequency,
        TAN: event.TAN,
        TDSCircleAOSCode: event.TDSCircleAOSCode,
      },
    }
    this.sub = this.apollo.mutate({ mutation: GQL_UPDATE_TENANT, variables: payload, })
    .pipe(map((data: any) => data?.data.editTenant))
    .subscribe(val => {
      if(val) {
        this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
        this.form.get('_id')?.patchValue(val._id);
        this.form.get('companyName')?.patchValue(val.name);
        this.form.patchValue(val.tax);
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
