import { IHeaderParams } from '@ag-grid-community/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';

export interface ICustomHeaderParams {
  menuIcon: string;
}

@Component({
  selector: 'ihrms-custom-header',
  template: `
    <div>
      <div
        *ngIf="params.enableMenu"
        #menuButton
        class="customHeaderMenuButton"
        (click)="onMenuClicked($event)"
      >
        <span class="ag-icon ag-icon-menu" unselectable="on" role="presentation"></span>
      </div>
      <div class="customHeaderLabel">{{ params.displayName }} - MS</div>
      <div
        *ngIf="params.enableSorting"
        (click)="onSortRequested('asc', $event)"
        [ngClass]="ascSort"
        class="customSortDownLabel"
      >
        <i class="ag-icon ag-icon-asc"></i>
      </div>
      <div
        *ngIf="params.enableSorting"
        (click)="onSortRequested('desc', $event)"
        [ngClass]="descSort"
        class="customSortUpLabel"
      >
        <i class="ag-icon ag-icon-desc"></i>
      </div>
      <div
        *ngIf="params.enableSorting"
        (click)="onSortRequested(null, $event)"
        [ngClass]="noSort"
        class="customSortRemoveLabel"
      >
        <i class="ag-icon ag-icon-none"></i>
      </div>
    </div>
  `,
  styles: [
    `
      .customHeaderMenuButton,
      .customHeaderLabel,
      .customSortDownLabel,
      .customSortUpLabel,
      .customSortRemoveLabel {
        float: left;
        margin: 0 0 0 3px;
      }

      .customSortUpLabel {
        margin: 0;
      }

      .customSortRemoveLabel {
        font-size: 11px;
      }

      .active {
        color: cornflowerblue;
      }
      .customSortUpLabel .ag-icon, .customSortDownLabel .ag-icon, .customSortRemoveLabel .ag-icon {
        display: none;
      }
      .customSortUpLabel:hover .ag-icon, .customSortDownLabel:hover .ag-icon, .customSortRemoveLabel:hover .ag-icon {
        display: block;
      }
    `,
  ],
})
export class CustomHeaderComponent implements IHeaderAngularComp {
  public params!: IHeaderParams & ICustomHeaderParams;

  public ascSort = 'inactive';
  public descSort = 'inactive';
  public noSort = 'inactive';

  @ViewChild('menuButton', { read: ElementRef }) public menuButton!: ElementRef;

  // @ts-ignore
  agInit(params: IHeaderParams & ICustomHeaderParams): void {
    this.params = params;
    console.log(this.params);

    params.column.addEventListener(
      'sortChanged',
      this.onSortChanged.bind(this)
    );

    this.onSortChanged();
  }

  onMenuClicked(event: any) {
    this.params.showColumnMenu(this.menuButton.nativeElement);
  }

  onSortChanged() {
    this.ascSort = this.descSort = this.noSort = 'inactive';
    if (this.params.column.isSortAscending()) {
      this.ascSort = 'active';
    } else if (this.params.column.isSortDescending()) {
      this.descSort = 'active';
    } else {
      this.noSort = 'active';
    }
  }

  onSortRequested(order: 'asc' | 'desc' | null, event: any) {
    this.params.setSort(order as any, event.shiftKey);
  }

  // @ts-ignore
  refresh(params: IHeaderParams) {
    return false;
  }
}
