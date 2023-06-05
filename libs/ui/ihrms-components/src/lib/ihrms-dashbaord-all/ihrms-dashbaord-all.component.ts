import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'ihrms-dashbaord-all',
  templateUrl: './ihrms-dashbaord-all.component.html',
  styleUrls: ['./ihrms-dashbaord-all.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IhrmsDashbaordAllComponent implements AfterViewInit {

  @Input() set cardRadius(radius: number) {
    if(radius) {
      this._radius = radius;
    }
  };

  @Input() palette: string | undefined;

  @Input() compData!: any;

  @Input() title: string | undefined;

  @Input() gridComponentFullHeight!: any;

  @Input() updateComponent: Subject<any> = new Subject();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClickHandler: EventEmitter<any> = new EventEmitter<any>();

  public _radius: number | undefined;

  constructor(
    private cdRef: ChangeDetectorRef
  ) {
  }

  onClickHandlerFun(event: any, item: any) {
    this.onClickHandler.emit({ event, item });
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
    this.updateComponent.subscribe(val => this.cdRef.detectChanges());
  }

}
