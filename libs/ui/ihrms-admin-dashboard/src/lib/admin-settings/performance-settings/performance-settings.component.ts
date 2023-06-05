import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ihrms-performance-settings',
  templateUrl: './performance-settings.component.html',
  styleUrls: ['./performance-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformanceSettingsComponent implements OnInit, AfterViewInit {

  selectedIndex = 0;

  formGoal!: FormGroup;
  goalControls$!: Observable<ControlBase<any>[]>;
  formGoalSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  formKeyPerformanceEvents!: FormGroup;
  keyPerformanceEventsControls$!: Observable<ControlBase<any>[]>;
  formKeyPerformanceEventsSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(
    private cdRef: ChangeDetectorRef,
    private _adss: AdminSettingsService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
  ) {
  }

  ngOnInit(): void {

    this.goalControls$ = this._adss.getGoalSettingControls();
    this.keyPerformanceEventsControls$ = this._adss.getKeyPerformanceEventsControls();

  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  // Goal Form
  goalFormSubmitEvent(event: any) {
    this.formGoal.reset();
  }

  goalFormObjectEvent(form: FormGroup) {
    this.formGoal = form;
    this.formGoal.valueChanges.subscribe(val => {
      if(val) {
        console.log(val);
      }
    });
  }

  onGoalSaveEvent(event: any) {
    this.formGoalSubmit$.next(true);
  }

  formAddMoreGoalEvent(event: any) {
    if(event.action === 'Add Goal') {
      this.goalArr.push(this.createGoal());
    }
    if (event.action === 'Remove Goal') {
      this.goalArr.removeAt(event.i);
    }
  }

  createGoal():FormGroup{
    return this.fb.group({
      goal:[null, Validators.required],
      status:[null],
      dueDate:[null],
      associatedPerformanceDiscussions:[null],
      description:[null, Validators.required],
    })
  }

  get goalArr():FormArray{
    return <FormArray> this.formGoal.get('dynamicArr');
  }

  // formKeyPerformance
  keyPerformanceEventsFormSubmitEvent(event: any) {
    this.formKeyPerformanceEvents.reset();
  }

  keyPerformanceEventsFormObjectEvent(form: FormGroup) {
    this.formKeyPerformanceEvents = form;
    this.formKeyPerformanceEvents.valueChanges.subscribe(val => {
      if(val) {
        console.log(val);
      }
    });
  }

  onKeyPerformanceEventsSaveEvent(event: any) {
    this.formKeyPerformanceEventsSubmit$.next(true);
  }

  formAddMoreKeyPerformanceEvent(event: any) {
    if(event.action === 'Add Goal') {
      this.formKeyPerformanceEventsArr.push(this.createGoal());
    }
    if (event.action === 'Remove Goal') {
      this.formKeyPerformanceEventsArr.removeAt(event.i);
    }
  }

  createKeyPerformance():FormGroup{
    return this.fb.group({
      goal:[null, Validators.required],
      status:[null],
      dueDate:[null],
      associatedPerformanceDiscussions:[null],
      description:[null, Validators.required],
    })
  }

  get formKeyPerformanceEventsArr():FormArray{
    return <FormArray> this.formKeyPerformanceEvents.get('dynamicArr');
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

}
