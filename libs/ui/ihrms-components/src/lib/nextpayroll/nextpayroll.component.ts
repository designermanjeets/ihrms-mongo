import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import * as _moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { distinctUntilChanged, tap } from 'rxjs';

@Component({
  selector: 'ihrms-nextpayroll',
  templateUrl: './nextpayroll.component.html',
  styleUrls: ['./nextpayroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NextpayrollComponent implements OnInit{

  @Input() set cardRadius(radius: number) {
    if(radius) {
      this._radius = radius;
    }
  };

  @Input() palette: string | undefined;

  @Input() compData: any | undefined;

  @Input() title: string | undefined;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClickHandler: EventEmitter<any> = new EventEmitter<any>();

  public _radius: number | undefined;

  counter: any = {};

  public randomLoader = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

  Breakpoints = Breakpoints;
  currentBreakpoint = '';
  isMobile = false;

  readonly breakpoint$ = this.breakpointObserver
    .observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
    .pipe(
      tap(value => console.log(value)),
      distinctUntilChanged()
    );

  constructor(
    private ngxService: NgxUiLoaderService,
    private cdRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {

    this.ngxService.startLoader(this.randomLoader);

    this.clockUpdate();

    setInterval(this.clockUpdate.bind(this), 1000);

    setTimeout( () => this.ngxService.stopLoader(this.randomLoader), 1000);

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

  clockUpdate() {

    const today = _moment();
    const lastDay = _moment().endOf("month");

    this.counter = {
      today : today,
      lastDay : lastDay,
      duration : _moment.duration(lastDay.diff(today))
    }

    this.cdRef.detectChanges();

  }

}
