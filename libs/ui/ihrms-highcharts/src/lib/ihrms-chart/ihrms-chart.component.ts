import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Output,
  EventEmitter, Input, ViewChild, ElementRef
} from '@angular/core';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
exporting(Highcharts);
import More from 'highcharts/highcharts-more';
More(Highcharts);
import highcharts3D from 'highcharts/highcharts-3d';
highcharts3D(Highcharts);
import highchartsCylinder from 'highcharts/modules/cylinder';
highchartsCylinder(Highcharts);
import highchartsSankey from 'highcharts/modules/sankey';
highchartsSankey(Highcharts);
import highchartsOrg from 'highcharts/modules/organization';
highchartsOrg(Highcharts);
import { ChartOptions, NavigationOptions, PlotOptions, PointOptionsObject, XAxisOptions } from 'highcharts';

import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';


@Component({
  selector: 'ihrms-chart',
  templateUrl: './ihrms-chart.component.html',
  styleUrls: ['./ihrms-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class IhrmsChartComponent {

  @Input() set cardRadius(radius: number) {
    if(radius) {
      this._radius = radius;
    }
  };

  @Input() palette: string | undefined;

  @Input() multiChart: boolean | undefined;

  @Input() compData: any;

  @Input() timeline!: string | boolean;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClickHandler: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('outerContainer', {read: ElementRef}) private outerContainer: ElementRef | undefined;

  public _radius: number | undefined;

  public viewLoaded = false;

  // Chart Specific Input/Outputs

  @Input() chartConstructor = 'chart';
  @ViewChild('ihrmsHighchart') componentRef: any;


  // Highcharts Variables
  isHighcharts = typeof Highcharts === 'object';
  highcharts: typeof Highcharts = Highcharts;
  highchartsOptions: Highcharts.Options;
  chartOptions: ChartOptions;
  plotOptions!: PlotOptions;
  navigationOptions: NavigationOptions;
  xAxisOptions: XAxisOptions;
  chartSeries: Array<PointOptionsObject> = [];
  _charType: string | undefined;
  chartConfig: any | undefined;
  chartRef: any;
  chartCallback: Highcharts.ChartCallbackFunction;

  oneToOneFlag = true;
  runOutsideAngularFlag = false;

  update = true;
  chartHeaderText: string | undefined;
  chartHeight: any;
  // chartWidth = 500;
  chartResponsiveRules: [] = [];
  xTitle: string | undefined;
  xCategories: [] = []
  yTitle: string | undefined;
  showContextMenu = false;

  doLoadChart = false;

  currMonth: any

  public randomLoader = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);


  @Input() charTitle: string | undefined;

  @Input() set headerText(value: string) {
    if(value !== undefined) {
      this.chartHeaderText = value;
      this.highchartsOptions = {
        ...this.highchartsOptions,
        ... { chart: this.chartOptions }
      };
      this.update = true;
    }
  }

  @Input() set responsiveRules(value: any) {
    if (value !== undefined) {
      this.chartResponsiveRules = value;
      this.highchartsOptions = {
        ...this.highchartsOptions,
        ...{
          responsive: {
            rules: this.chartResponsiveRules
          }
        }
      };
      this.update = true;
    }
  }

  @Input() set series(value: any) {
    const isValidData = _.isArray(value.data)? value.data.length: value.data.data?.length;
    if (value !== undefined) { //  && isValidData

      this.destroyChart();

      this.chartConfig = value.config;
      this.chartSeries = value.data;
      this._charType = value.type;

      this.chartOptions.type = this._charType;

      if(this._charType === 'pie') {

        // this.chartConfig.alpha && (this.chartOptions.spacingTop = -10);
        this.chartOptions.options3d = {
          ...this.chartOptions.options3d,
          ... { enabled: true, alpha: this.chartConfig.alpha }
        };
        this.plotOptions.pie = {
          ...this.plotOptions.pie, 
          ...{ innerSize: this.chartConfig.innerSize, depth: this.chartConfig.depth },
          dataLabels: { enabled: false },
          showInLegend: true
        }

        this.highchartsOptions = {
          ...this.highchartsOptions, ...{ series: [value] }
        };

        if(this.chartConfig.tooltipAffix) {
          (<any>this.plotOptions).pie.dataLabels.format = '<b>{point.name}, {point.y}</b>' + this.chartConfig.tooltipAffix;
        } else {
          this.chartConfig.tooltipAffix = '';
        }

        this.highchartsOptions.tooltip = {
          headerFormat: '<span style="font-size:18px">{point.key}</span><table>',
          pointFormat: '<tr><td style="font-size:14px; color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}' +this.chartConfig.tooltipAffix+'</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        };

      } else if(this._charType === 'column' || this._charType === 'bar') {

        this.chartOptions.spacingTop = 30;

        this.chartOptions.options3d = {
          enabled: true, alpha: this.chartConfig.alpha, beta: this.chartConfig.beta, depth: this.chartConfig.depth
        };

        this.plotOptions.series = {
          ...this.plotOptions.series,
          ...{ depth: this.chartConfig.depth, colorByPoint: value.subType !== 'multi'  }
        }

        this.highchartsOptions.tooltip = {
          headerFormat: '<span style="font-size:18px">{point.key}</span><table>',
          pointFormat: '<tr><td style="font-size:14px; color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        };

        this.highchartsOptions = {
          ...this.highchartsOptions, ...{ series: (value.subType === 'multi' ? this.chartSeries : [value]) as any }
        };

      } else if(this._charType === 'cylinder') {

        this.chartOptions.spacingTop = 30;
        
        this.chartOptions.options3d = {
          ...this.chartOptions.options3d,
          ... {
            enabled: true,
            alpha: this.chartConfig.alpha,
            beta: this.chartConfig.beta,
            depth: this.chartConfig.depth,
            viewDistance: this.chartConfig.viewDistance
          }
        };

        this.plotOptions.series = {
          ...this.plotOptions.series,
          ...{ depth: this.chartConfig.depth, colorByPoint: true }
        }
        this.highchartsOptions = {
          ...this.highchartsOptions, ...{ series: [{ data: this.chartSeries, name: value.name } as any] }
        };

      } else if(this._charType === 'area') {
        this.plotOptions.area = {
          ...this.plotOptions.area,
          ...{
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 2
            }
          }
        }

        this.highchartsOptions = {
          ...this.highchartsOptions, ...{ series: this.chartSeries as any }
        };

      } else if(this._charType === 'spline') {
        this.plotOptions.spline = {
          ...this.plotOptions.spline,
          ...{
            marker: {
              radius: 4,
              lineColor: '#666666',
              lineWidth: 1
            }
          }
        }

        this.highchartsOptions = {
          ...this.highchartsOptions, ...{ series: [{ data: this.chartSeries, name: value.name } as any] }
        };

      } else if(this._charType === 'organization') {

        this.chartOptions = {
          ...this.chartOptions,
          ... { inverted: true }
        };
        this.highchartsOptions = {
          ...this.highchartsOptions,
          ...{ series: [value] },
          ...{
            accessibility: {
              point: {
                descriptionFormatter: function (point: any) {
                  const nodeName = point.toNode.name,
                    nodeId = point.toNode.id,
                    nodeDesc = nodeName === nodeId ? nodeName : nodeName + ', ' + nodeId,
                    parentDesc = point.fromNode.id;
                  return point.index + '. ' + nodeDesc + ', reports to ' + parentDesc + '.';
                }
              }
            },
          },
          tooltip: {
            outside: true
          },
        };
      }

      this.highchartsOptions = {
        ...this.highchartsOptions, ...{ legend: { ...this.highchartsOptions.legend, y: -10 } }
      };

      (value.updateChartFromOutside as Subject<any>)?.subscribe(val => {
        if(val) {
          if(this._charType === 'cylinder') {
            this.highchartsOptions = {
              ...this.highchartsOptions, ...{ series: [{ data: value.data, name: value.name } as any] }
            };
          }
          if(this._charType === 'pie') {
            this.highchartsOptions = {
              ...this.highchartsOptions, ...{ series: [value] }
            };
          }
          this.cdr.detectChanges();
        }
      })

      const syries = this.highchartsOptions.series as any;
      this.doLoadChart =  syries?.length && syries[0].data.length;
      this.update = syries?.length && syries[0].data.length; // true
    }
  }

  @Input() set width(value: any) {
    if (value !== undefined) {
      // this.chartWidth = value;
      // this.chartOptions.width = this.chartWidth;
      this.highchartsOptions = {
        ...this.highchartsOptions,
        ...{
          chart: this.chartOptions
        }
      };
      this.update = true;
    }
  }

  @Input() set height(value: any) {
    if (value !== undefined) {
      this.chartHeight = value;
      this.chartOptions.height = this.chartHeight;
      this.highchartsOptions = {
        ...this.highchartsOptions,
        ...{
          chart: this.chartOptions
        }
      };
      this.update = true;
    }
  }

  @Input() set xAxisCategories(value: any) {
    if (value !== undefined) {
      if(!Array.isArray(value) || value.length <= 0) value = null;
      this.xCategories = value;
      this.xAxisOptions.categories = this.xCategories;
      this.highchartsOptions = {
        ...this.highchartsOptions,
        ...{ xAxis: this.xAxisOptions, crosshair: true }
      };
      this.update = true;
    }
  }

  @Input() set xAxisTitle(value: any) {
    if (value !== undefined) {
      if(value === null) value = '';
      this.xTitle = value;
      this.xAxisOptions = {
        ...this.xAxisOptions,
        ... { title: { text: this.xTitle } }
      };
      this.highchartsOptions = {
        ...this.highchartsOptions,
        ...{ xAxis: this.xAxisOptions }
      };
      this.update = true;
    }
  }

  @Input() set yAxisTitle(value: any) {
    if (value !== undefined) {
      if(value === null) value = '';
      this.yTitle = value;
      this.highchartsOptions = {
        ...this.highchartsOptions,
        ...{ yAxis: { title: { text: this.yTitle } } }
      };
      this.update = true;
    }
  }

  @Input() set contextMenuEnabled(value: any) {
    if (value !== undefined) {
      this.showContextMenu = value;
      this.navigationOptions = {
        ...this.navigationOptions,
        ...{ buttonOptions: { enabled: this.showContextMenu } }
      }
      this.highchartsOptions = {
        ...this.highchartsOptions,
        ... { navigation: this.navigationOptions }
      };
      this.update = true;
    }
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {

    this.ngxService.startLoader(this.randomLoader);

    this.chartCallback = (chart: any) => {
      if(chart) {
        this.chartRef = chart;
        setTimeout( (_: any) => {
          if(this.timeline !== false) {
            this.currMonth = this.timeline === 'year' ?
              moment(moment.now()).format('YYYY') :
              moment(moment.now()).format('MMMM-YYYY');
          }
          this.chartRef && this.chartRef.update(true);
          this.chartRef && this.chartRef.reflow(true);
          this.viewLoaded = true;
          this.ngxService.stopLoader(this.randomLoader);
          this.cdr.detectChanges();
        }, 1000)
      }
    }
    this.chartOptions = this.setChartOptions();
    this.plotOptions = this.setPlotOptions();
    this.navigationOptions = this.setNavigationOptions();
    this.xAxisOptions = this.setXAxisOptions();
    this.highchartsOptions = this.setHighChartOptions();

    if(this.router.url.includes('admin-dashboard')) {
      //
    }

  }

  private destroyChart() {
    if(this.componentRef) {
      if(!_.isEmpty(this.chartRef)) this.chartRef.destroy;
      this.componentRef.chart = null;
    }
  }

  private setChartOptions(): ChartOptions {
    return {
      spacingLeft: -5,
      plotBackgroundColor: 'transparent',
      plotBorderWidth: 0,
      plotShadow: false,
      // height: this.chartHeight,
      // width: this.chartWidth
    }
  }

  private setPlotOptions(): PlotOptions {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const comp = this;
    return {
      series: {
        dataLabels: {
          align: 'center',
          enabled: true
        },
        cursor: 'pointer',
        events: {
          click: function() {
            //comp.onClickHandler.emit({ component: comp, event: 'seriesClickEvent', data: this });
          }
        },
        animation: false
      },
      area: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        events: {
          click: (function() {
            comp.onClickHandler.emit({ component: comp, comp_name: 'IhrmsChartComponent', event: 'pointClickEvent', data: this });
          })
        },
      },
      column: {
        allowPointSelect: true,
        cursor: 'pointer',
        events: {
          click: (function() {
            comp.onClickHandler.emit({ component: comp, comp_name: 'IhrmsChartComponent', event: 'pointClickEvent', data: this });
          })
        },
      },
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        point: {
          events: {
            click: (function() {
              comp.onClickHandler.emit({ component: comp, event: 'pointClickEvent', data: this });
            })
          },
        },
        dataLabels: {
          enabled: true,
          distance: 5,
          format: '<b>{point.name}, {point.y}</b>',
          formatter:function(){
            return '<b>' + this.point.name + ':</b><br/>' + Highcharts.numberFormat(this.percentage,0,'.') + '%';
          }
        }
      }
    }
  }

  private setNavigationOptions(): NavigationOptions {
    return {
      buttonOptions: {
        enabled: this.showContextMenu
      }
    }
  }

  private setXAxisOptions(): XAxisOptions {
    return  {
      categories: this.xCategories,
      title: { text: this.xTitle }
    }
  }

  private setHighChartOptions(): Highcharts.Options {
    return {
      chart: this.chartOptions,
      credits: { enabled: false },
      legend: { enabled: true },
      navigation: this.navigationOptions,
      plotOptions: this.plotOptions,
      responsive: { rules: this.chartResponsiveRules },
      // series: [ { type: this.charType, data: this.chartSeries } ],
      title: { text: this.chartHeaderText },
      // tooltip: { pointFormat: '<b>{point.percentage:.1f}%</b>' },
      xAxis: this.xAxisOptions,
      yAxis: {
        endOnTick: true,
        startOnTick: true,
        labels: { enabled: true },
        title: { text: this.yTitle }
      }
    }
  }


}
