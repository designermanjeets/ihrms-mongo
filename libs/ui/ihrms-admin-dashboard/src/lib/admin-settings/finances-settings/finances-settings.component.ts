import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'ihrms-finances-settings',
  templateUrl: './finances-settings.component.html',
  styleUrls: ['./finances-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancesSettingsComponent implements AfterViewInit {

  selectedIndex = 0;

  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

}
