/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IHRMSUtilityDirective } from '@ihrms/shared';
import { NavItem } from '../_models/nav-item';

@Component({
  selector: 'ihrms-sidebar',
  templateUrl: './ihrms-sidebar.component.html',
  styleUrls: ['./ihrms-sidebar.component.scss'],
  providers: [ IHRMSUtilityDirective ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IhrmsSidebarComponent implements OnInit {

  @Input() opened!: boolean;
  @Input() sideBarWidth: number | undefined;
  @Input() dockedSize: string | undefined;
  @Input() navItems: NavItem[] | any;

  @Output() navItemClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() navItemSelectedEvent: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    //
  }

  onNavItemClick(event: any, item: any) {
    this.navItemClick.emit({event, item});
  }

  navItemSelected(event: any) {
    this.navItemSelectedEvent.emit(event);
  }

}
