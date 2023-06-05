import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  Output, SimpleChanges, TemplateRef
} from '@angular/core';
import { CONSTANTS } from '@ihrms/shared';
import { Subject, distinctUntilChanged, tap } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'

@Component({
  selector: 'ihrms-multi-charts',
  templateUrl: './multi-charts.component.html',
  styleUrls: ['./multi-charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MultiChartsComponent implements AfterViewInit, OnChanges {

  @Input() set cardRadius(radius: number) {
    if(radius) {
      this._radius = radius;
    }
  };

  @Input() palette: string | undefined;

  @Input() compData!: any;

  @Input() filterConfig!: any;

  @Input() filters!: boolean;

  @Input() title: string | undefined;

  @Input() gridComponentFullHeight!: any;

  @Input() gridHeaderTemplate!: TemplateRef<any>;

  @Input() flexStart!: boolean;

  @Input() isMobileFullHeight!: boolean;

  @Input() updateMultiChart: Subject<any> = new Subject();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClickHandler: EventEmitter<any> = new EventEmitter<any>();

  public _radius: number | undefined;
  
  Breakpoints = Breakpoints;
  currentBreakpoint = '';
  isMobile = false;

  readonly breakpoint$ = this.breakpointObserver
    .observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
    .pipe(
      tap(value => console.log(value)),
      distinctUntilChanged()
    );

  onClickHandlerFun($event: any) {
    this.onClickHandler.emit($event);
  }

  onFiltersClickHandlerFun($event: any) {
    this.onClickHandler.emit($event);
  }

  getHeight(offsetHeight: number | undefined | any) {
    return this.filterConfig?.uploadButton ? offsetHeight - 45: offsetHeight - 15;
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
    this.updateMultiChart.subscribe(val => {
      if(val && val.length) {
        this.compData = [...val];
        this.cdRef.detectChanges();
        this.onClickHandler.emit({ action: CONSTANTS.REFRESH, component: this, comp_name: CONSTANTS.IHRMS_MULTI_CHART_COMPONENT });
      }
    });

    this.breakpoint$.subscribe(() =>
      this.breakpointChanged()
    );

  }

  private breakpointChanged() {
    if(this.breakpointObserver.isMatched(Breakpoints.Large)) {
      this.currentBreakpoint = Breakpoints.Large;
    } else if(this.breakpointObserver.isMatched(Breakpoints.Medium)) {
      this.currentBreakpoint = Breakpoints.Medium;
    } else if(this.breakpointObserver.isMatched(Breakpoints.Small)) {
      this.currentBreakpoint = Breakpoints.Small;
    } else if(this.breakpointObserver.isMatched('(max-width: 759px)')) {
      this.currentBreakpoint = '(max-width: 759px)';
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cdRef.detectChanges();
  }

  onGridReadyOut(event: any) {
    this.onClickHandler.emit(event);
  }

  onConfirmRoster(event: any) {
    this.onClickHandler.emit({ action: CONSTANTS.ROSTER_CONFIRM, component: this, comp_name: CONSTANTS.IHRMS_MULTI_CHART_COMPONENT });
  }

}
