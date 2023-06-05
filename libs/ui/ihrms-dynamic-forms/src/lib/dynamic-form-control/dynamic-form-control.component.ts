import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input, OnChanges,
  OnDestroy,
  OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import { ControlBase } from '../_models/control.base';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ihrms-dynamic-form-control',
  templateUrl: './dynamic-form-control.component.html',
  styleUrls: ['./dynamic-form-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DynamicFormControlComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  minDate!: Date;
  maxDate!: Date;
  date!: Date;

  @Input() control!: ControlBase<string> | any;
  @Input() form!: FormGroup;
  @Input() reset: Subject<any> = new Subject<any>();
  @Input() dynamicControls!: boolean;
  @Input() labelAutoIncrement!: boolean;
  @Input() action!: string;
  @Input() hideForm!: boolean;
  @Input() addSeparator!: boolean;
  @Input() flex!: number;
  @Input() flexGap!: number;
  @Input() paddingBottomCust!: string;
  @Input() flexAlignStart!: boolean;
  @Input() update!: BehaviorSubject<boolean>;

  @Output() formEvents = new EventEmitter();

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | undefined;
  subscription!: Subscription;

  get isCustomValidator() {
    const dynaArr =  this.form.get('dynamicArr') as FormArray;
    let cntrl = null;
    if(dynaArr) {
      // this.dynamicArray.controls.forEach((group: FormGroup | any, ind: number) => {
      //   for (const control in group.controls) {
      //     const c = group.controls[control];
      //     cntrl = (c.invalid && c.dirty) || (c.invalid && c.touched);
      //   }
      // });
      return;
    } else {
      const control = this.form.controls[this.control.key] as FormControl
      cntrl = (control.invalid && control.dirty) || (control.invalid && control.touched);
    }
    return cntrl;
  }

  get dynamicArray() {
    return this.form.get('dynamicArr') as FormArray;
  }

  get dynamicFormGroup() {
    return this.dynamicArray?.controls[0] as FormGroup;
  }

  get groupControls() {
    return this.dynamicFormGroup?.value;
  }

  constructor(
    private cdRef: ChangeDetectorRef
  ) {
  }

  uploadFileEvt(imgFile: any) {
    this.selectedFile = imgFile.target.files[0];
    if (imgFile.target.files && imgFile.target.files[0]) {
      // Do some Stuff
    }
  }

  ngOnInit() {
    this.subscription = this.reset?.subscribe((val: boolean) => {
      if(val) {
        this.selectedFile = undefined;
      }
    });
  }

  ngAfterViewInit() {
    this.updateControlData(); // Default
    this.update?.pipe(debounceTime(1000)).subscribe(val => val && this.updateControlData());
    this.cdRef.detectChanges();
  }

  updateControlData() {
    if(this.control?.dynamicArr) {
      this.control?.dynamicArr.forEach((ctrl: ControlBase<any>) => {
        if(ctrl.controlType) {
          this.updateControl(ctrl);
        }
      });
    } else {
      this.updateControl(this.control);
    }
  }

  updateControl(control: ControlBase<any>) {
    if(control?.validators?.minDate) { // && this.maxDate
      if(control?.validators?.minDate instanceof Date) {
        const d = new Date(control?.validators?.minDate);
        this.minDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      } else {
        this.minDate = new Date();
        this.minDate.setMonth(this.maxDate.getMonth() - 12 * control?.validators?.minDate);
      }
    }
    if(control?.validators?.maxDate) {
      if(control?.validators?.maxDate instanceof Date) {
        const d = new Date(control?.validators?.maxDate);
        this.maxDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      } else {
        this.maxDate = new Date();
        this.maxDate.setMonth(this.maxDate.getMonth() - 12 * control?.validators?.maxDate);
      }
    }
    if(control?.protected) {
      if(this.form?.get(control.key as any)?.value) {
        this.form.get(control.key as any)?.disable();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes) {
      this.cdRef.detectChanges();
    }
  }

  onButtonClick(event: any, form: any, control: any, i: number | null) {
    this.formEvents.emit({event, form, control, action: control?.label, i})
  }

  onMoreOptionClick(event: any, form: FormGroup, control: any) {
    this.formEvents.emit({event, form, control, action: control?.addMoreOption})
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getFlex(controlFlex: number | string | undefined, flex: number) {
    return controlFlex || flex;
  }

  getControlRequired(ctrl: any, key: any) {
    return (ctrl.controls[key].errors?.required && ctrl.controls[key].dirty) || (ctrl.controls[key].errors?.required && ctrl.controls[key].touched);
  }

  getControlInvalid(ctrl: any, key: any) {
    return (ctrl.controls[key].errors?.invalid && ctrl.controls[key].dirty) || (ctrl.controls[key].errors?.invalid && ctrl.controls[key].touched);
  }

  getControlMinLength(ctrl: any, key: any) {
    if(ctrl.controls) {
      return (ctrl.controls[key].errors?.minlength && ctrl.controls[key].dirty) || (ctrl.controls[key].errors?.minlength && ctrl.controls[key].touched);
    } else {
      return (ctrl.errors?.minlength && ctrl.dirty) || (ctrl.errors?.minlength && ctrl.touched);
    }
  }

  getControlPattern(ctrl: any, key: any) {
    return (ctrl.controls[key].errors?.pattern && ctrl.controls[key].dirty) || (ctrl.controls[key].errors?.pattern && ctrl.controls[key].touched);
  }

  getControlDatePickerMax(ctrl: any, key: any) {
    return (ctrl.controls[key].errors?.matDatepickerMax && ctrl.controls[key].dirty) || (ctrl.controls[key].errors?.matDatepickerMax && ctrl.controls[key].touched);
  }

  getControlDatePickerMin(ctrl: any, key: any) {
    return (ctrl.controls[key].errors?.matDatepickerMin && ctrl.controls[key].dirty) || (ctrl.controls[key].errors?.matDatepickerMin && ctrl.controls[key].touched);
  }

  checkError(control: AbstractControl) {
    console.log(control.status);
  }

}
