import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, map, Observable, pairwise, Subscription } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GQL_SHIFTS_BY_ID, ShiftScheduleService } from './_services/shift-schedule.service';
import { IhrmsAdminDashboardService } from '../../_services/ihrms-admin-dashboard.service';
import { Apollo } from 'apollo-angular';
import { GQL_SHIFTS, GQL_SHIFT_EDIT } from '../../other-masters/_services/other-masters.service';
import { ToastrService } from 'ngx-toastr';
import { validate } from 'graphql';

@Component({
  selector: 'ihrms-shift-schedule',
  templateUrl: './shift-schedule.component.html',
  styleUrls: ['./shift-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShiftScheduleComponent implements OnInit, AfterViewInit {

  selectedIndex = 0;

  formShiftSchedule!: FormGroup;
  shiftScheduleControls$!: Observable<ControlBase<any>[]>;
  shiftScheduleControlsObj!: ControlBase<any>[];
  formShiftScheduleSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  sub!: Subscription;

  shiftOptions = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private _sss: ShiftScheduleService,
    private _adss: AdminSettingsService,
    private _ihrmsads: IhrmsAdminDashboardService,
    private apollo: Apollo,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.shiftScheduleControls$ = this._sss.getShiftScheduleControls();
    this.shiftScheduleControls$.subscribe(val => this.shiftScheduleControlsObj = val);

    this.getShifts();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  getShifts() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_SHIFTS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getShifts))
      .subscribe(val => this.shiftOptions = val);
  }

  formShiftScheduleSubmitEvent(event: any) {
    const payload = {
      _id: event._id,
      id: event._id,
      code: event.code,
      name: event.name,
      status: event.status,
      general: {
        defaultTimeFrom: event.defaultTimeFrom,
        defaultTimeTo: event.defaultTimeTo,
        effectiveFrom: event.effectiveFrom
      },
      payDays: {
        carryOverBalanceHoursInOvertimeReport: event.carryOverBalanceHoursInOvertimeReport,
        overtimeReportCalculationBy: event.overtimeReportCalculationBy,
        includeHolidays: event.includeHolidays,
        includeLeave: event.includeLeave,
        includeWeekend: event.includeWeekend
      },
      permissions: {
        managerCanEdit: event.managerCanEdit,
        mobileCheckInCheckout: event.mobileCheckInCheckout,
        notifyAdminOnEdit: event.notifyAdminOnEdit,
        webCheckInCheckout: event.webCheckInCheckout
      },
      regularization: {
        regularForFutureEnable: event.regularForFutureEnable,
        requestCanBeRaisedForChangeDays: event.requestCanBeRaisedForChangeDays
      },
      shiftRotation: {
        applicableFor: event.applicableFor,
        frequencyDays: event.frequencyDays,
        frequencyStartsOn: event.frequencyStartsOn,
        scheduleFrequency: event.scheduleFrequency,
        scheduleName: event.scheduleName,
        selectApplicableFor: event.selectApplicableFor,
        shiftRotateFrom: event.shiftRotateFrom,
        shiftRotateTo: event.shiftRotateTo,
        timeOfSchedule: event.timeOfSchedule,
      },
      workingHours: {
        minimumHoursRequired: Number(event.minimumHoursRequired),
        minimumHoursRequiredHalfDay: Number(event.minimumHoursRequiredHalfDay),
        totalHoursCalculations: event.totalHoursCalculations,
        graceTimeRequired: Number(event.graceTimeRequired),
        graceNumberTimeRequired: Number(event.graceNumberTimeRequired)
      }
    }
    this.apollo.mutate({ mutation: GQL_SHIFT_EDIT, variables: payload, })
      .pipe(map((data: any) => data?.data.editShift))
      .subscribe(val => {
        if(val) {
          this.patchFormValue(val)
          this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
        }
      });
  }

  formShiftScheduleObjectEvent(form: FormGroup) {
    this.formShiftSchedule = form;

    this._ihrmsads.getSelectOptions(this.shiftScheduleControlsObj, this.shiftOptions, 'shiftId', '_id')

    this.formShiftSchedule.get('shiftId')?.valueChanges
    .subscribe(value => {
      if(value) {
        this.sub = this.apollo.watchQuery<any, any>({ query: GQL_SHIFTS_BY_ID, variables: { query: { limit: 100, id: value }}}).valueChanges
        .pipe(map((data: any) => data?.data?.getShifts[0]))
        .subscribe(val => this.patchFormValue(val));
      }

      this.formShiftSchedule.valueChanges.subscribe(value => {
        if(value.ScheduleFrequency) {
          if(value.ScheduleFrequency === 'Daily') {
            this._ihrmsads.updateSelectedControl(this.shiftScheduleControlsObj, 'FrequencyStartOn', 'controlType',  'hidden');
          } else {
            this._ihrmsads.updateSelectedControl(this.shiftScheduleControlsObj, 'FrequencyStartOn', 'controlType',  'dropdown');
          }
          if(value.ScheduleFrequency === 'Weekly') {
            const newOptions = [ { key: 'Sunday', name: 'Sunday' }, { key: 'Monday', name: 'Monday' }, { key: 'Tuesday', name: 'Tuesday' }]
            this._ihrmsads.getSelectOptions(this.shiftScheduleControlsObj, newOptions,  'FrequencyStartOn', 'key');
          }
          if(value.ScheduleFrequency === 'Monthly') {
            const newOptions = [ { key: '1', name: '1' }, { key: '2', name: '2' }, { key: '3', name: '3' }, { key: '4', name: '4' } ]
            this._ihrmsads.getSelectOptions(this.shiftScheduleControlsObj, newOptions,  'FrequencyStartOn', 'key');
          }
        }
        if(value.ApplicableFor) {
          this._ihrmsads.updateSelectedControl(this.shiftScheduleControlsObj, 'SelectApplicableFor', 'controlType',  'dropdown');
          if(value.ApplicableFor === 'Department') {
            const newOptions = [ { key: 'HR', name: 'HR' }, { key: 'Admin', name: 'Admin' } ]
            this._ihrmsads.getSelectOptions(this.shiftScheduleControlsObj, newOptions,  'SelectApplicableFor', 'key');
          }
          if(value.ApplicableFor === 'Employee') {
            const newOptions = [ { key: 'Manjeet', name: 'Manjeet' }, { key: 'Raj', name: 'Raj' } ]
            this._ihrmsads.getSelectOptions(this.shiftScheduleControlsObj, newOptions,  'SelectApplicableFor', 'key');
          }
          if(value.ApplicableFor === 'Role') {
            const newOptions = [ { key: 'Employee', name: 'Employee' }, { key: 'Manager', name: 'Manager' } ]
            this._ihrmsads.getSelectOptions(this.shiftScheduleControlsObj, newOptions,  'SelectApplicableFor', 'key');
          }
        }
      })

    })

  }

  patchFormValue(val: any) {
    this.formShiftSchedule.setValue({
      _id: val._id,
      name: val.name,
      code: val.code,
      shiftId: val._id,
      effectiveFrom: val.general.effectiveFrom,
      defaultTimeFrom: val.general.defaultTimeFrom,
      defaultTimeTo: val.general.defaultTimeTo,
      minimumHoursRequired: val.workingHours.minimumHoursRequired,
      minimumHoursRequiredHalfDay: val.workingHours.minimumHoursRequiredHalfDay,
      // totalHoursCalculations: val.workingHours.totalHoursCalculations,
      graceTimeRequired: val.workingHours.graceTimeRequired,
      graceNumberTimeRequired: val.workingHours.graceNumberTimeRequired,
      // scheduleFrequency: val.shiftRotation.scheduleFrequency,
      // frequencyStartsOn: val.shiftRotation.frequencyStartsOn,
      // frequencyDays: val.shiftRotation.frequencyDays,
      // shiftRotateTo: val.shiftRotation.shiftRotateTo,
      // includeWeekend: val.payDays.includeWeekend,
      // includeHolidays: val.payDays.includeHolidays,
      // includeLeave: val.payDays.includeLeave,
      carryOverBalanceHoursInOvertimeReport: val.payDays.carryOverBalanceHoursInOvertimeReport,
      overtimeReportCalculationBy: val.payDays.overtimeReportCalculationBy,
      // webCheckInCheckout: val.permissions.webCheckInCheckout,
      // mobileCheckInCheckout: val.permissions.mobileCheckInCheckout,
      // managerCanEdit: val.permissions.managerCanEdit,
      // editTheirOwnEntries: val.permissions.editTheirOwnEntries || null, // Not in DB
      // notifyAdminOnEdit: val.permissions.notifyAdminOnEdit,
      // EditEmployeeShiftMapping: null, // Not in DB
      // EmailNotificationForShiftModification: null, // Not in DB
      // RegularizationForFutureDates: val.regularization.regularForFutureEnable,
      // RegularizationRequestCanBeRaised: val.regularization.requestCanBeRaisedForChangeDays,
      // RegularizationEntriesWill: null, // Not in DB
    }, { emitEvent: false, onlySelf: true });
  }

  onShiftScheduleAddEvent(event: any) {
    this.formShiftScheduleSubmit$.next(true);
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

}
