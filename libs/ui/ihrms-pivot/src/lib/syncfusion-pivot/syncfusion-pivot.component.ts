import { ChangeDetectorRef, Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';

// syncfusion
import {
  IDataOptions, PivotView, FieldListService, CalculatedFieldService,
  ToolbarService, ConditionalFormattingService, ToolbarItems, DisplayOption, IDataSet,
  NumberFormattingService, IAxisSet, GroupingBarService, GroupingService, VirtualScrollService, DrillThroughService, QueryCellInfoEventArgs, PDFExportService, ExcelExportService
} from '@syncfusion/ej2-angular-pivotview';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';
import { enableRipple } from '@syncfusion/ej2-base';
import { ChartSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/chartsettings';
import { ILoadedEventArgs, ChartTheme } from '@syncfusion/ej2-charts';
import { ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { Observable } from 'rxjs';
enableRipple(false);

/**
 * Pivot Table Overview Sample
 */
declare const require: any;
const Universitydata: IDataSet[] = require('./mock.data.json');
const AttendanceData: IDataSet[] = require('./mock.attendance.data.json');

@Component({
  selector: 'ihrms-syncfusion-pivot',
  templateUrl: './syncfusion-pivot.component.html',
  styleUrls: ['./syncfusion-pivot.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CalculatedFieldService, ToolbarService, ConditionalFormattingService, FieldListService, NumberFormattingService, GroupingBarService, GroupingService, VirtualScrollService, DrillThroughService, PDFExportService, ExcelExportService]
})
export class SyncfusionPivotComponent {

  public dataSourceSettings!: IDataOptions;
  public gridSettings!: GridSettings;
  public toolbarOptions!: ToolbarItems[];
  public chartSettings!: ChartSettings;
  public displayOption!: DisplayOption;
  public cellTemplate!: string;
  public observable = new Observable();

  @ViewChild('pivotview')
  public pivotObj!: PivotView;

  // Custom Config
  _pivotConfig: any;

  @Input() set pivotConfig(value: any) {
    if (value) {
      console.log(value);
      this._pivotConfig = value;
      this.loadPivot(this._pivotConfig);
      this.cdRef.detectChanges();
    }
  };

  constructor(
    private cdRef: ChangeDetectorRef
  ) {}

  queryCell(args: QueryCellInfoEventArgs | any): void {
    (this.pivotObj.renderModule as any).rowCellBoundEvent(args);
    if (args.data && args.cell) {
      const cellInfo: IAxisSet | any = args.data[Number(args.cell.getAttribute('data-colindex'))] as IAxisSet;

      if (cellInfo && cellInfo.axis === 'value' && this.pivotObj.pivotValues[cellInfo.rowIndex] && ((this.pivotObj.pivotValues[cellInfo.rowIndex][0]) as IAxisSet).hasChild) {
        if (args.cell.classList.contains(cellInfo.cssClass)) {
          args.cell.classList.remove(cellInfo.cssClass);
          cellInfo.style = undefined;
        }
      }
    }
  }

  enginePopulated(): void {
    this.pivotObj.grid.queryCellInfo = this.queryCell.bind(this);
  }

  hyperlinkCellClick(args: MouseEvent) {
    const cell: Element | any = (args.target as Element).parentElement;
    const pivotValue: IAxisSet = this.pivotObj.pivotValues[Number(cell.getAttribute('index'))][Number(cell.getAttribute('data-colindex'))] as IAxisSet;
    if (pivotValue.index) {
      const link: string = Universitydata[pivotValue.index[0]].link as string;
      window.open(link, '_blank');
    }
  }

  saveReport(args: any) {
    let reports = [];
    let isSaved = false;
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
      reports = JSON.parse(localStorage.pivotviewReports);
    }
    if (args.report && args.reportName && args.reportName !== '') {
      const report = JSON.parse(args.report);
      report.dataSourceSettings.dataSource = [];
      report.pivotValues = [];
      args.report = JSON.stringify(report);
      reports.map(function (item: any): any {
        if (args.reportName === item.reportName) {
          item.report = args.report; isSaved = true;
        }
      });
      if (!isSaved) {
        reports.push(args);
      }
      localStorage.pivotviewReports = JSON.stringify(reports);
    }
  }

  fetchReport(args: any) {
    let reportCollection: string[] = [];
    const reeportList: string[] = [];
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
      reportCollection = JSON.parse(localStorage.pivotviewReports);
    }
    reportCollection.map(function (item: any): void { reeportList.push(item.reportName); });
    args.reportName = reeportList;
  }

  loadReport(args: any) {
    let reportCollection: string[] = [];
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
      reportCollection = JSON.parse(localStorage.pivotviewReports);
    }
    reportCollection.map(function (item: any): void {
      if (args.reportName === item.reportName) {
        args.report = item.report;
      }
    });
    if (args.report) {
      const report = JSON.parse(args.report);
      report.dataSourceSettings.dataSource = this.pivotObj.dataSourceSettings.dataSource;
      this.pivotObj.dataSourceSettings = report.dataSourceSettings;
    }
  }

  removeReport(args: any) {
    let reportCollection: any[] = [];
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
      reportCollection = JSON.parse(localStorage.pivotviewReports);
    }
    for (let i = 0; i < reportCollection.length; i++) {
      if (reportCollection[i].reportName === args.reportName) {
        reportCollection.splice(i, 1);
      }
    }
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
      localStorage.pivotviewReports = JSON.stringify(reportCollection);
    }
  }

  renameReport(args: any) {
    let reportsCollection: any[] = [];
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
      reportsCollection = JSON.parse(localStorage.pivotviewReports);
    }
    if (args.isReportExists) {
      for (let i = 0; i < reportsCollection.length; i++) {
        if (reportsCollection[i].reportName === args.rename) {
          reportsCollection.splice(i, 1);
        }
      }
    }
    reportsCollection.map(function (item: any): any { if (args.reportName === item.reportName) { item.reportName = args.rename; } });
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
      localStorage.pivotviewReports = JSON.stringify(reportsCollection);
    }
  }

  newReport() {
    this.pivotObj.setProperties({ dataSourceSettings: { columns: [], rows: [], values: [], filters: [] } }, false);
  }

  chartSeriesCreated() {
    if (this.pivotObj && this.pivotObj.chartSettings && this.pivotObj.chartSettings.chartSeries) {
      this.pivotObj.chartSettings.chartSeries.legendShape = this.pivotObj.chartSettings.chartSeries.type === 'Polar' ? 'Rectangle' : 'SeriesType';
    }
  }

  beforeToolbarRender(args: any) {
    args.customToolbar.splice(6, 0, {
      type: 'Separator'
    });
    args.customToolbar.splice(9, 0, {
      type: 'Separator'
    });
  }

  loadPivot(pivotConfig: any) {
    this.cellTemplate = '<span class="tempwrap"></span>';
    this.chartSettings = {
      title: pivotConfig?.title,
      chartSeries: { type: 'Column' },
      load: this.observable.subscribe(args => {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        (args as ILoadedEventArgs).chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() +
          selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast');
      }) as any
    } as ChartSettings;

    this.displayOption = { view: 'Both' } as DisplayOption;
    this.gridSettings = {
      columnWidth: 120, 
      allowSelection: true, 
      rowHeight: 36,
      selectionSettings: { mode: 'Cell', type: 'Single', cellSelectionMode: 'Box' },
      excelQueryCellInfo: this.observable.subscribe((args: ExcelQueryCellInfoEventArgs | any) => {
        if (args) {
          if (((args as ExcelQueryCellInfoEventArgs).cell as IAxisSet).axis === 'value' && ((args as ExcelQueryCellInfoEventArgs).cell as IAxisSet).value === undefined) {
            if (args && args.style && args.style.numberFormat) {
              args.style.numberFormat = undefined;
            }
          }
        }
      }) as any
    } as GridSettings;

    this.toolbarOptions = [ 'New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load', 'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'Formatting', 'FieldList'] as ToolbarItems[];

    this.dataSourceSettings = pivotConfig?.dataSourceSettings;
    console.log(this.dataSourceSettings);
  }

}
