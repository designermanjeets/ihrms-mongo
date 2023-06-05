import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CONSTANTS } from '@ihrms/shared';

@Component({
  selector: 'ihrms-list-items',
  templateUrl: './ihrms-list-items.component.html',
  styleUrls: ['./ihrms-list-items.component.scss']
})
export class IhrmsListItemsComponent implements OnInit {

  @Input() set cardRadius(radius: number) {
    if(radius) {
      this._radius = radius;
    }
  };

  @Input() palette: string | undefined;

  @Input() set compData(val: any) {
    if(val) {
      this._compData = val;
    }
  };

  public _compData: any;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClickHandler: EventEmitter<any> = new EventEmitter<any>();

  public _radius: number | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  listSelection(event: any) {
    this.onClickHandler.emit({event, component: this, comp_name: CONSTANTS.IHRMS_LIST_ITEMS_COMPONENT});
  }

}
