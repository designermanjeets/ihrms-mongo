import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone, OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { OnDutyRequestsService } from './_services/on-duty-requests.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { CONSTANTS } from '@ihrms/shared';

@Component({
  selector: 'ihrms-on-duty-requests',
  templateUrl: './on-duty-requests.component.html',
  styleUrls: ['./on-duty-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnDutyRequestsComponent implements OnInit, OnDestroy {

  title!: string;

  form: FormGroup | undefined;
  sub!: Subscription;

  formConfig: any;
  controls$!: Observable<ControlBase<any>[]>;
  controlsObj!: ControlBase<any>[];
  updateForm$ = new BehaviorSubject(false);
  formSubmitOutside$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  formInvalidControls$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  @Input() dialogEventInput$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  @Output() dialogEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  constants = CONSTANTS;

  constructor(
    private _odr: OnDutyRequestsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OnDutyRequestsComponent>,
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.title = this.data.title;
    this.controls$ = this.data.controls;
    this.formConfig = this.data.formConfig;

    this.sub = this.dialogEventInput$.subscribe((res: any) => {
      if(res && res.action && res.value) {
        if(res.action === CONSTANTS.FORM_SUBMIT_EVENT && res.type === CONSTANTS.VALIDATION_ERROR) {
          for (const valueElement of res.value) {
            const control = this.form && this.form.get(valueElement.members[0]);
            this.formInvalidControls$.next(control);
          }
        }
      }
    });

    this.sub = this.controls$?.subscribe((cntrls: ControlBase<any>[]) => this.controlsObj = cntrls);

  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  formObjectEvent (form: FormGroup) {
    this.form = form;
    this.dialogEventEmitter.emit({ action: CONSTANTS.FORM_OBJECT_EVENT, value: form });

    this.sub = this.form?.valueChanges.subscribe(val => {
      if(val) {
        this.dialogEventEmitter.emit({ action: CONSTANTS.FORM_VALUE_CHANGE, value: val });
      }
    })
    this.sub = this.form?.statusChanges.subscribe(val => {
      if(val) {
        this.dialogEventEmitter.emit({ action: CONSTANTS.FORM_STATUS_CHANGE, value: val });
      }
    })

  };

  formSubmitEvent = (formRawData: any)  => {
    if(this.form?.valid) {
      !this.formConfig?.closeFromOutside && this.closeDialog(formRawData); // this.form?.value
    } else {
      // console.log('Invalid');
    }
    this.dialogEventEmitter.emit({ action: CONSTANTS.FORM_SUBMIT_EVENT, value: formRawData }); // this.form?.value
  };

  formSubmitted = () => {
    this.formSubmitOutside$.next(true);
    this.dialogEventEmitter.emit({ action: CONSTANTS.FORM_SUBMIT_EVENT, value: this.form?.getRawValue() });
    if(this.formConfig?.action === this.constants.CANCEL) {
      // this.closeDialog(this.form?.value);
    }
    if(this.formConfig?.action === this.constants.VISIBILITY) {
      this.closeDialog(0);
    }
  };

  closeDialog(event: any) {
    this.ngZone.run(() => this.dialogRef.close(event));
  }

}
