import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { AdminSettingsService } from '../_services/admin-settings.service';

@Component({
  selector: 'ihrms-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemSettingsComponent implements OnInit, AfterViewInit {

  formSystem!: FormGroup;
  systemControls$!: Observable<ControlBase<any>[]>;
  formSystemSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(
    private cdRef: ChangeDetectorRef,
    private _adss: AdminSettingsService
  ) { }

  ngOnInit(): void {
    this.systemControls$ = this._adss.getSystemControls();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  formSystemSubmitEvent(event: any) {
    console.log(event);
    this.formSystem.reset();
  }

  formSystemObjectEvent(form: FormGroup) {
    this.formSystem = form;
  }

  onSystemAddEvent(event: any) {
    this.formSystemSubmit$.next(true);
  }

}
