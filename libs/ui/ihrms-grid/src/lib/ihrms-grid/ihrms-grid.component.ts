import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { CellRange, GridApi, GridOptions, RangeSelectionChangedEvent, RowNode } from 'ag-grid-community';
import { GridActionComponent } from '../grid-components/grid-action/grid-action.component';
import { ReqCorrectionComponent } from '../grid-components/req-correction/req-correction.component';
import { GridStatusComponent } from '../grid-components/grid-status/grid-status.component';
import { GridAvatarComponent } from '../grid-components/grid-avatar/grid-avatar.component';
import { GridSimpleListComponent } from '../grid-components/grid-simple-list/grid-simple-list.component';
import { GridCheckBoxComponent } from '../grid-components/grid-check-box/grid-check-box.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANTS, SharedService } from '@ihrms/shared';
import { Subject, Subscription, distinctUntilChanged, tap } from 'rxjs';
import { IdApiValueComponent } from '../grid-components/id-api-value/id-api-value.component';

import { CustomHeaderComponent } from './custom-header.component';
import { GridTimezoneComponent } from '../grid-components/grid-timezone/grid-timezone.component';
import { IsRowMaster } from '@ag-grid-community/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { RichSelectCellRendererComponent } from '../grid-components/rich-select-cell-renderer/rich-select-cell-renderer.component';

@Component({
  selector: 'ihrms-grid',
  templateUrl: './ihrms-grid.component.html',
  styleUrls: ['./ihrms-grid.component.scss']
})
export class IhrmsGridComponent implements OnInit, OnDestroy {

  @Input() set cardRadius(radius: number) {
    if(radius) {
      this._radius = radius;
    }
  };

  @Input() palette: string | undefined;
  public _radius: number | undefined;

  @Input() columnDefs: any[] = [];
  @Input() rowData: any[] = [];

  @Input() title!: string;
  @Input() viewAll!: boolean;
  @Input() isMultiChartCard!: boolean;
  @Input() addRemoveRowButtons!: boolean;
  @Input() pagination!: boolean;
  @Input() paginationPageSize!: number;
  @Input() paginationAutoPageSize!: boolean;
  @Input() height!: number;
  @Input() flatItem!: boolean;
  @Input() columnFit!: boolean;
  @Input() illustration!: string;
  @Input() enableCharts!: boolean;
  @Input() enableRangeSelection = true;
  @Input() suppressClickEdit!: boolean;
  @Input() stopEditingWhenCellsLoseFocus!: boolean;
  @Input() updateGridFromOutside: Subject<any> = new Subject<any>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClickHandler: EventEmitter<any> = new EventEmitter<any>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onGridReadyOut: EventEmitter<any> = new EventEmitter<any>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onCellValueChangedOut: EventEmitter<any> = new EventEmitter<any>();

  private gridApi!: GridApi;
  private gridColumnApi: any;
  private gridOptions!: GridOptions
  @Input() defaultColDef: any;
  @Input() rowClassRules!: any;
  @Input() rowSelection = "single" as any;
  @Input() editType = 'fullRow' as any;
  public singleClickEdit = true;
  frameworkComponents!: any;

  public pinnedTopRowData!: any;
  @Input() pinnedBottomRowData!: any;
  
  @Input() isRowMaster!: IsRowMaster<any>;
  @Input() masterDetail!: boolean;
  @Input() detailCellRendererParams: any;

  subscription!: Subscription;

  public _env: any;

  public randomLoader = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

  public popupParent: HTMLElement = document.body;
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
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {
    this._env = this.sharedService.environment;
  }

  ngOnInit(): void {

    this.ngxService.startLoader(this.randomLoader);

    // this.pinnedTopRowData = this.createData(1, 'Top');

    this.frameworkComponents = {
      GridActionComponent: GridActionComponent,
      ReqCorrectionComponent: ReqCorrectionComponent,
      GridStatusComponent: GridStatusComponent,
      GridAvatarComponent: GridAvatarComponent,
      GridSimpleListComponent: GridSimpleListComponent,
      GridCheckBoxComponent: GridCheckBoxComponent,
      IdApiValueComponent: IdApiValueComponent,
      CustomHeaderComponent: CustomHeaderComponent,
      GridTimezoneComponent: GridTimezoneComponent,
      RichSelectCellRendererComponent: RichSelectCellRendererComponent,
    }

    this.defaultColDef = {
      // flex: 1,
      wrapText: true,
      // autoHeight: true,
      sortable: true,
      resizable: true,
      // filter: true,
      // editable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true
    };

    this.rowClassRules = {
      ...this.rowClassRules,
      'pinnedRow': function (params: any) {
        return params.node.rowPinned === 'bottom';
      },
    };

    this.breakpoint$.subscribe(() =>
      this.breakpointChanged()
    );

  }

  sizeToFit() {
    !this.isMobile && this.gridApi.sizeColumnsToFit();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridOptions = {
      ...this.gridOptions,
      applyColumnDefOrder: true,
      columnDefs: this.columnDefs,
      rowData: this.rowData,
      onFirstDataRendered: this.onFirstDataRendered,
    };

    this.onGridReadyOut.emit({gridApi: this.gridApi, gridColumnApi: this.gridColumnApi, gridOptions: this.gridOptions, action: CONSTANTS.ON_GRID_READY, component: this, comp_name: CONSTANTS.IHRMS_GRID_COMPONENT});

    !this.isMobile && params.api?.resetRowHeights();
    !this.isMobile && params.api?.sizeColumnsToFit();
    setTimeout((_: any) => this.ngxService.stopLoader(this.randomLoader), 500);

    this.subscription = this.updateGridFromOutside?.subscribe((val: any) => {
      if(val) {
        if(val.action === CONSTANTS.EDIT) {
          (this.gridApi.getRowNode(val.rowIndex) as RowNode).setData(val.data || val.rowData);
        }
        if(val.action === CONSTANTS.ADD_ANY || val.action === CONSTANTS.ADD) {
          this.gridApi.applyTransaction({ add: [val.data] });
        }
        if(val.action === CONSTANTS.CANCEL) {
          const delNode = this.gridApi.getRowNode(val.rowIndex) as RowNode;
          delNode && this.gridApi.applyTransaction({ remove: [delNode.data] });
        }
        if(val.action === CONSTANTS.UPDATE) {
          if(val.columnDefs) {
            this.gridOptions.columnDefs = [];
            this.columnDefs = val.columnDefs; this.gridOptions.columnDefs = val.columnDefs;
            setTimeout( () => val.columnFit && !this.isMobile ? this.sizeToFit() : this.autoSizeAll(false), 1000);
          }
          if(val.rowData) {
            this.gridOptions.rowData = [];
            this.rowData = val.rowData; this.gridOptions.rowData = val.rowData;
          }
          if(val.pinnedBottomRowData) {
            this.pinnedBottomRowData = [];
            this.pinnedBottomRowData = val.pinnedBottomRowData;
          }
          this.cdRef.detectChanges();
        }
      }
    });

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

  onCellValueChanged(event: any) {
    this.onCellValueChangedOut.emit({ event, component: this, comp_name: CONSTANTS.IHRMS_GRID_COMPONENT, action: CONSTANTS.ON_CELL_VALUE_CHANGED });
  }

  isRowSelectable(rowNode: RowNode) {
    return true;
  }

  onFirstDataRendered(event: any) {
    if(!this.isMobile) {
      this.columnFit ? this.sizeToFit() : this.autoSizeAll(false);
    }
    this.onClickHandler.emit({ event, component: this, comp_name: CONSTANTS.IHRMS_GRID_COMPONENT, action: CONSTANTS.ON_FIRST_DATA_RENDERED });
  }

  autoSizeAll(skipHeader: any) {
    const allColumnIds: any[] = [];
    this.gridColumnApi.getAllColumns().forEach(function (column: any) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  onRowClicked(event: any) {
    this.onClickHandler.emit({ event, component: this, comp_name: CONSTANTS.IHRMS_GRID_COMPONENT, action: CONSTANTS.ROW_CLICKED });
  }

  onRowDoubleClicked(event: any) {
    this.onClickHandler.emit({ event, component: this, comp_name: CONSTANTS.IHRMS_GRID_COMPONENT, action: CONSTANTS.ROW_DOUBLE_CLICKED });
  }

  onRowSelected(event: any) {
    if (!event.node.selected)
      return;
    this.onClickHandler.emit({ event, component: this, comp_name: CONSTANTS.IHRMS_GRID_COMPONENT, action: CONSTANTS.ON_ROW_SELECTED });
  }

  onSelectionChanged(event: any) {
    this.onClickHandler.emit({ event, component: this, comp_name: CONSTANTS.IHRMS_GRID_COMPONENT, action: CONSTANTS.ON_SELECTION_CHANGED });
  }

  onRangeSelectionChanged(event: RangeSelectionChangedEvent) {
    const cellRanges = this.gridApi.getCellRanges();
    // if no selection, clear all the results and do nothing more
    if (!cellRanges || cellRanges.length === 0) {
      return;
    }
    // set range count to the number of ranges selected
    const sum = 0;
    const api = this.gridApi;
    if (cellRanges) {
      cellRanges.forEach(function (range: CellRange) {
        // get starting and ending row, remember rowEnd could be before rowStart
        const startRow = Math.min(
          range.startRow?.rowIndex as number,
          range.endRow?.rowIndex as number
        );
        const endRow = Math.max(range.startRow?.rowIndex as number, range.endRow?.rowIndex as number);
        for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
          range.columns.forEach(function (column) {
            const rowModel = api.getModel();
            const rowNode = rowModel?.getRow(rowIndex);
            const value = api.getValue(column, rowNode as any);
            // rowNode && (rowNode.data[column['colId']] = true);
          });
        }
      });
    }
  }

  onMoreClick(event: any) {
    this.onClickHandler.emit({ event, component: this, comp_name: CONSTANTS.IHRMS_GRID_COMPONENT, action: CONSTANTS.VIEW_ALL });
  }

  moreOptionsClicked(matMenuItem: any) {
    this.onClickHandler.emit({ matMenuItem, component: this, comp_name: CONSTANTS.IHRMS_GRID_COMPONENT, action: CONSTANTS.REFRESH, title: this.title });
  }

  onAddRowClick(event: any) {
    this.onClickHandler.emit({ event, component: this, comp_name: CONSTANTS.IHRMS_GRID_COMPONENT, action: CONSTANTS.GRID_ADD_ROW });
  }

  onRemoveRowClick(event: any) {
    this.onClickHandler.emit({ event, component: this, comp_name: CONSTANTS.IHRMS_GRID_COMPONENT, action: CONSTANTS.GRID_REMOVE_ROW });
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
