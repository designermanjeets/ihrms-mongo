import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { AdminSettingsService } from '../admin-settings/_services/admin-settings.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'ihrms-other-masters',
  templateUrl: './other-masters.component.html',
  styleUrls: ['./other-masters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherMastersComponent implements OnInit, AfterViewInit {

  selectedIndex = 0;

  formSystem!: FormGroup;
  systemControls$!: Observable<ControlBase<any>[]>;
  formSystemSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(
    private cdRef: ChangeDetectorRef,
    private _adss: AdminSettingsService
  ) {
  }

  ngOnInit(): void {

    this.systemControls$ = this._adss.getSystemControls();

  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  // System form
  formSystemSubmitEvent(event: any) {
    this.formSystem.reset();
  }

  formSystemObjectEvent(form: FormGroup) {
    this.formSystem = form;
  }

  onSystemSaveEvent(event: any) {
    this.formSystemSubmit$.next(true);
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

}
