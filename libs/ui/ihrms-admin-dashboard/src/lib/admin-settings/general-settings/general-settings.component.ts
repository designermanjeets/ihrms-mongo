import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'ihrms-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralSettingsComponent implements AfterViewInit {

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
