import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ControlBase } from '../_models';
import { DynamicFormControlService } from '../_services/dynamic-form-control.service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'ihrms-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DynamicFormComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() set controls(value: ControlBase<string>[] | null | any) {
    if(value) {
      this._controls = value;
    }
  };
  @Input() update!: BehaviorSubject<boolean>;
  @Input() flex!: number;
  @Input() flexGap!: number;
  @Input() flexAlignStart!: boolean;
  @Input() paddingBottomCust!: string;

  @Input() stepper!: MatStepper;
  @Input() stepperNext!: boolean;
  @Input() stepperClose!: boolean;
  @Input() stepperReset!: boolean;
  @Input() stepperSubmit!: boolean;
  @Input() stepperPrevious!: boolean;
  @Input() dynamicControls!: boolean;
  @Input() labelAutoIncrement!: boolean;

  @Input() action!: string;
  @Input() readonly!: boolean;
  @Input() hideForm!: boolean;
  @Input() addSeparator!: boolean;

  @Input() patchValue!: any;

  @Input() formSubmitOutside: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  @Input() formInvalidControls: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  @Output() formChangeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() formStatusEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() formSubmitEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() formObjectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() formClickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() formAddMoreOptionEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() stepperSubmitEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() stepperCancelEvent: EventEmitter<any> = new EventEmitter<any>();

  form!: FormGroup;
  payLoad = '';
  sub: Subscription | undefined;
  @Input() formReset: Subject<any> = new Subject();

  public _controls: any;

  constructor(
    private _dcs: DynamicFormControlService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form = this._dcs.toFormGroup(this._controls as ControlBase<string>[], this.dynamicControls);

    this.sub = this.form.valueChanges.subscribe(val => this.formChangeEvent.emit(val));
    this.sub = this.form.statusChanges.subscribe(val => this.formStatusEvent.emit(val));

    this.formObjectEvent.emit(this.form);
    this.patchValue && this.form.patchValue(this.patchValue);

    this.sub = this.formSubmitOutside.subscribe(val => {
      if(val) {
        console.log('Form Submitted From Outside!', val)
        this.onSubmit();
      }
    })

    this.sub = this.formInvalidControls.subscribe((control: FormControl) => {
      if(control) {
        control.setErrors({ 'invalid': true });
        control.markAsTouched({ onlySelf: true });
        this.cdRef.detectChanges();
      }
    })

  }

  ngAfterViewInit() {
    this.readonly && this.form.disable();
    this.cdRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.patchValue) {
      this.form && this.form.patchValue(this.patchValue);
    }
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  stepperCloseFun(){
    this.stepperCancelEvent.emit(true);
  }

  stepperPreviousFun(){
    this.stepper.previous();
  }

  stepperNextFun(){
    this.stepper.next();
  }

  stepperResetFun(){
    this.stepper.reset();
  }

  stepperSubmitFun() {
    this.stepperSubmitEvent.emit(true);
  }

  onSubmit() {
    if(this.form.status !== 'DISABLED') {
      if (this.form.valid) {
        this.payLoad = this.form.getRawValue();
        this.formSubmitEvent.emit(this.payLoad);
        this.formReset.next(true);
      } else {
        this.validateAllFormFields(this.form);
      }
    } else {
      this.payLoad = this.form.getRawValue();
      this.formSubmitEvent.emit(this.payLoad);
      this.formReset.next(true);
    }
  }

  getFlex(controlFlex: number | string | undefined, flex: number) {
    return controlFlex || flex;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        this.cdRef.detectChanges();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  formEvents(event: any) {
    this.formClickEvent.emit(event);
  }

}
