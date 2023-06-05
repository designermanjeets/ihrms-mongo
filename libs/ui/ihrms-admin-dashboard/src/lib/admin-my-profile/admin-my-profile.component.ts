import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IhrmsAdminDashboardService } from '../_services/ihrms-admin-dashboard.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'ihrms-admin-my-profile',
  templateUrl: './admin-my-profile.component.html',
  styleUrls: ['./admin-my-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminMyProfileComponent implements OnInit, AfterViewInit {

  mySelf: any;

  public randomLoader = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

  constructor(
    private cdRef: ChangeDetectorRef,
    private _ihrmsads: IhrmsAdminDashboardService,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
  ) {
  }

  ngOnInit(): void {
    this.getMyInfo();
  }

  getMyInfo() {
    this.ngxService.startLoader(this.randomLoader);
    const myID = sessionStorage.getItem('auth-user');
    this._ihrmsads.getEntityByID('User', Number(myID))
      .pipe(map((val: any) => val?.result))
      .subscribe(val => {
        if(val) {
          console.log(val);
          this.mySelf = val;
          this.ngxService.stopLoader(this.randomLoader);
          this.cdRef.detectChanges();
        }
      }
    )
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

}
