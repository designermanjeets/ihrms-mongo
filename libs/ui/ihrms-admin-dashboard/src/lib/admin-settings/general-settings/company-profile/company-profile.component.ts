import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { GeneralSettingsService, GQL_TENANTS_BY_ID, GQL_UPDATE_TENANT } from '../_services/general-settings.service';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ihrms-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyProfileComponent implements OnInit, AfterViewInit, OnDestroy {

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
    this.controls$ = this._gss.getGeneralControls();
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
        if(val) {
          this.form.patchValue(val.profile);
          this.form.get('_id')?.patchValue(val._id);
          this.form.get('companyName')?.patchValue(val.name);
          this.form.get('companyEmail')?.patchValue(val.email);
        }
      });
  }

  formSubmitEvent(event: any) {
    const payload = {
      id: event._id,
      name: event.companyName,
      profile: {
        companyName: event.companyName,
        companyLegalName: event.companyLegalName,
        companyContactPerson: event.companyContactPerson,
        companyAddress: event.companyAddress,
        companyPostalOrZipCode: event.companyPostalOrZipCode,
        companyCity: event.companyCity,
        companyStateProvince: event.companyStateProvince,
        companyCountry: event.companyCountry,
        companyEmail: event.companyEmail,
        companyPhone: event.companyPhone,
        companyPhone2: event.companyPhone2,
        companyMobilePhone: event.companyMobilePhone,
        companyFax: event.companyFax,
        companyWebsite: event.companyWebsite,
        companyRegistration: event.companyRegistration,
        companyVAT: event.companyVAT,
      },
    }
    this.apollo.mutate({ mutation: GQL_UPDATE_TENANT, variables: payload, })
    .pipe(map((data: any) => data?.data.editTenant))
    .subscribe(val => {
      if(val) {
        this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
        this.form.get('_id')?.patchValue(val._id);
        this.form.get('companyName')?.patchValue(val.name);
        this.form.patchValue(val.profile);
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
