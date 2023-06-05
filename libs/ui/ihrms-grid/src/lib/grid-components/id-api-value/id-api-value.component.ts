import { ChangeDetectorRef, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ihrms-id-api-value',
  templateUrl: './id-api-value.component.html',
  styleUrls: ['./id-api-value.component.scss']
})
export class IdApiValueComponent implements ICellRendererAngularComp {

  public params: any;
  public paramsVal: any;
  public cellValue!: string;

  constructor(
    private cdRef: ChangeDetectorRef
  ) {
  }

  agInit(params: any): void {
    this.params = params;
    this.paramsVal = params.value;
    const sub = this.params.entity.service[this.params.entity.method](this.params.entity.name, this.paramsVal)
      .pipe(map((data: any) => data?.result))
      .subscribe((val: any) => {
        if(val) {
          this.cellValue = val?.name;
          this.refresh(this.params);
          this.cdRef.detectChanges();
          sub.unsubscribe();
        }
      });
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

}

