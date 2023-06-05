import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CONSTANTS } from '@ihrms/shared';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ihrms-approval-settings',
  templateUrl: './approval-settings.component.html',
  styleUrls: ['./approval-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApprovalSettingsComponent implements OnInit, AfterViewInit {

  selectedIndex = 0;

  formLevelExpense!: FormGroup;
  levelControls$!: Observable<ControlBase<any>[]>;

  formExpense!: FormGroup;
  expenseControls$!: Observable<ControlBase<any>[]>;
  formExpenseSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  formLeave!: FormGroup;
  leaveControls$!: Observable<ControlBase<any>[]>;
  formLeaveSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  formOffer!: FormGroup;
  offerControls$!: Observable<ControlBase<any>[]>;
  formOfferSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(
    private cdRef: ChangeDetectorRef,
    private _adss: AdminSettingsService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
  ) {
  }

  ngOnInit(): void {

    this.levelControls$ = this._adss.getLevelControl();

    this.expenseControls$ = this._adss.getExpenseControls();

    this.leaveControls$ = this._adss.getLeaveControls();

    this.offerControls$ = this._adss.getOfferControls();

  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  // Expense Form
  expenseFormSubmitEvent(event: any) {
    this.formExpense.reset();
  }

  expenseFormObjectEvent(form: FormGroup) {
    this.formLevelExpense.reset();
    this.formExpense = form;
    this.formLevelExpense.invalid && this.formExpense.disable();
  }

  expenseLevelFormObjectEvent(form: FormGroup) {
    this.formLevelExpense = form;
    this.formLevelExpense.valueChanges.subscribe(val => {
      if(val) {
        if(this.formExpense) {
          this.formExpense.enable();
          if(this.formLevelExpense.value.Level < this.approverArr.controls.length) {
            this.approverArr.clear();
            this.approverArr.push(this.createApprover());
          }
        }
        if(this.formLeave) {
          this.formLeave.enable();
          if(this.formLevelExpense.value.Level < this.leaveArr.controls.length) {
            this.leaveArr.clear();
            this.leaveArr.push(this.createLeave());
          }
        }
        if(this.formOffer) {
          this.formOffer.enable();
          if(this.formLevelExpense.value.Level < this.offerArr.controls.length) {
            this.offerArr.clear();
            this.offerArr.push(this.createOffer());
          }
        }
      }
    });
  }

  onExpenseSaveEvent(event: any) {
    this.formExpenseSubmit$.next(true);
  }

  formAddMoreExpenseEvent(event: any) {
    if(event.action === 'add') {
      if (this.formLevelExpense.value.Level > this.approverArr.controls.length) {
        this.approverArr.push(this.createApprover());
      } else {
        this.toastrService.error(`Maximum Level Achieved!`, `Error`, {});
      }
    }
    if (event.action === 'close') {
      this.approverArr.removeAt(event.i);
    }
  }

  createApprover():FormGroup{
    return this.fb.group({
      Approver:[null, Validators.required],
    })
  }

  get approverArr():FormArray{
    return <FormArray> this.formExpense.get('dynamicArr');
  }

  // Leave Form
  leaveFormSubmitEvent(event: any) {
    this.formLeave.reset();
  }

  leaveFormObjectEvent(form: FormGroup) {
    this.formLeave = form;
    this.formLevelExpense.reset();
    this.formLevelExpense.invalid && this.formLeave.disable();
  }

  onLeaveSaveEvent(event: any) {
    this.formLeaveSubmit$.next(true);
  }

  formAddMoreLeaveEvent(event: any) {
    if(event.action === 'add') {
      if (this.formLevelExpense.value.Level > this.leaveArr.controls.length) {
        this.leaveArr.push(this.createLeave());
      } else {
        this.toastrService.error(`Maximum Level Achieved!`, `Error`, {});
      }
    } else if(event.action === 'close') {
      this.leaveArr.removeAt(event.i);
    }
  }

  createLeave():FormGroup{
    return this.fb.group({
      Approver:[null, Validators.required],
    })
  }

  get leaveArr():FormArray{
    return <FormArray> this.formLeave.get('dynamicArr');
  }

  // Offer Form
  offerFormSubmitEvent(event: any) {
    this.formOffer.reset();
  }

  offerFormObjectEvent(form: FormGroup) {
    this.formOffer = form;
    this.formLevelExpense.reset();
    this.formLevelExpense.invalid && this.formOffer.disable();
  }

  onOfferSaveEvent(event: any) {
    this.formOfferSubmit$.next(true);
  }

  formAddMoreOfferEvent(event: any) {
    if(event.action === 'add') {
      if (this.formLevelExpense.value.Level > this.offerArr.controls.length) {
        this.offerArr.push(this.createOffer());
      } else {
        this.toastrService.error(`Maximum Level Achieved!`, `Error`, {});
      }
    } else if(event.action === 'close') {
      this.offerArr.removeAt(event.i);
    }
  }

  createOffer():FormGroup{
    return this.fb.group({
      Approver:[null, Validators.required],
    })
  }

  get offerArr():FormArray{
    return <FormArray> this.formOffer.get('dynamicArr');
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

}
