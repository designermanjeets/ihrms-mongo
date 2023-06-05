import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map, Observable, Subject, Subscription } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { GQL_PAYSCHEDULES, GQL_PAYSCHEDULES_CREATE, GQL_PAYSCHEDULES_UPDATE, SalarySettingsService } from '../_services/salary-settings.service';
import { IhrmsAdminDashboardService } from '../../../_services/ihrms-admin-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { Apollo } from 'apollo-angular';
import { CONSTANTS } from '@ihrms/shared';

@Component({
  selector: 'ihrms-pay-schedule',
  templateUrl: './pay-schedule.component.html',
  styleUrls: ['./pay-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayScheduleComponent implements OnInit {

  form!: FormGroup;
  controls$!: Observable<ControlBase<any>[]>;
  controlsObj!: ControlBase<any>[];
  formSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  sub!: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _sls: SalarySettingsService,
    private _ihrmsads: IhrmsAdminDashboardService,
    private toastrService: ToastrService,
    private apollo: Apollo,
  ) { }

  ngOnInit(): void {
    this.controls$ = this._sls.getPayScheduleControls();
    this.controls$.subscribe(val => this.controlsObj = val);
    this.getPaySchedule();
  }

  getPaySchedule() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_PAYSCHEDULES, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getPaySchedules[0]))
      .subscribe(val => this.form.patchValue(val));
  }

  formSubmitEvent(event: any) {
    if(event.calculateMonthlySalaryBasedUpon === 'organisationDays' && !event.organisationWorkingDays) {
      this.toastrService.error(`Select Organisation Working Days!`, `Error`, {});
      return
    }
    if(event.employeePayDay === 'other' && !event.employeePayDayOther) {
      this.toastrService.error(`Select Other Pay Day!`, `Error`, {});
      return
    }
    
    if(this.form.valid) {
      if(this.form.value._id) {
        event.id = event._id;
        this.sub = this.apollo.mutate({ mutation: GQL_PAYSCHEDULES_UPDATE, variables: event })
          .pipe(map((data: any) => data?.data?.editPaySchedule))
          .subscribe(val => {
            if(val) {
              this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
              this.form.patchValue(val[0]);
            }
          });
      }
      if(!this.form.value._id) {
        this.sub = this.apollo.mutate({ mutation: GQL_PAYSCHEDULES_CREATE, variables: event })
          .pipe(map((data: any) => data?.data?.createPaySchedule))
          .subscribe(val => {
            if(val) {
              this.toastrService.success( `Success`, `Data Created Successfully!`, { } );
              this.form.patchValue(val[0]);
            }
          });
      }
    }

  }

  formObjectEvent(form: FormGroup) {
    this.form = form;
    this.form.valueChanges.subscribe(value => {
      if(value) {
        if(value.calculateMonthlySalaryBasedUpon === 'organisationDays') {
          this._ihrmsads.updateSelectedControl(this.controlsObj, 'organisationWorkingDays', 'controlType',  'dropdown');
        } else {
          this._ihrmsads.updateSelectedControl(this.controlsObj, 'organisationWorkingDays', 'controlType',  'hidden');
        }
        if(value.employeePayDay === 'other') {
          this._ihrmsads.updateSelectedControl(this.controlsObj, 'employeePayDayOther', 'controlType',  'dropdown');
        } else {
          this._ihrmsads.updateSelectedControl(this.controlsObj, 'employeePayDayOther', 'controlType',  'hidden');
        }
      }
    })
  }

  formClickEvent(event: any) {
    console.log(event);
  }

  onSave(event: any) {
    this.formSubmit$.next(true);
  }

}
