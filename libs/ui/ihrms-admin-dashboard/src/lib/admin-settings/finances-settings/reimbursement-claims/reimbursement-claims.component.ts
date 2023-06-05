import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { FinancesSettingsService } from '../_services/finances-settings.service';

@Component({
  selector: 'ihrms-reimbursement-claims',
  templateUrl: './reimbursement-claims.component.html',
  styleUrls: ['./reimbursement-claims.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReimbursementClaimsComponent implements OnInit, AfterViewInit {

  noComponent!: boolean;

  form!: FormGroup;
  controls$!: Observable<ControlBase<any>[]>;
  formSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

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

}
