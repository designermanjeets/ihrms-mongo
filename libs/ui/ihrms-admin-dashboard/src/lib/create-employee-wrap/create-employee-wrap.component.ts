import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ihrms-create-employee-wrap',
  templateUrl: './create-employee-wrap.component.html',
  styleUrls: ['./create-employee-wrap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateEmployeeWrapComponent implements OnInit {

  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.cdRef.detectChanges();
  }

}
