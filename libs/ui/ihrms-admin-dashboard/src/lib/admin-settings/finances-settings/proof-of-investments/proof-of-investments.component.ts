import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { FinancesSettingsService } from '../_services/finances-settings.service';

@Component({
  selector: 'ihrms-proof-of-investments',
  templateUrl: './proof-of-investments.component.html',
  styleUrls: ['./proof-of-investments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProofOfInvestmentsComponent implements OnInit, AfterViewInit {

  noComponent!: boolean;

  form!: FormGroup;
  controls$!: Observable<ControlBase<any>[]>;
  formSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  poiObj = {
    notifyWhenRelease: false,
    emailReminders: false,
    notifyWhenLocked: false,
    fromMonth: false,
  };

  locked = true;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _fss: FinancesSettingsService
  ) { }

  ngOnInit(): void {
    this.controls$ = this._fss.getFlexiBenefitsControls();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  formSubmitEvent(event: any) {
    this.form.reset();
  }

  formObjectEvent(form: FormGroup) {
    this.form = form;
  }

  onAddEvent(event: any) {
    this.formSubmit$.next(true);
  }

  onPOIChange(event: any, poiObj:any) {
    console.log(event);
    console.log(poiObj);
  }

}
