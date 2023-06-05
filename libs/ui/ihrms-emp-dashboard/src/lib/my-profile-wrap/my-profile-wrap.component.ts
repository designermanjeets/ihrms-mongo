import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { CONSTANTS } from '@ihrms/shared';
import { GQL_USER_BY_ID,} from '../_services/ihrms-emp-dashboard.service';
import { GQL_EMPLOYEES, IhrmsDialogComponent, MultiChartsComponent } from '@ihrms/ihrms-components';

@Component({
  selector: 'ihrms-my-profile-wrap',
  templateUrl: './my-profile-wrap.component.html',
  styleUrls: ['./my-profile-wrap.component.scss']
})
export class MyProfileWrapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
