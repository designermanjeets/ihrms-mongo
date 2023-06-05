import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { MatTabChangeEvent } from '@angular/material/tabs';


@Component({
  selector: 'ihrms-salary-settings',
  templateUrl: './salary-settings.component.html',
  styleUrls: ['./salary-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalarySettingsComponent implements AfterViewInit {

  selectedIndex = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _adss: AdminSettingsService
  ) { }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

}
