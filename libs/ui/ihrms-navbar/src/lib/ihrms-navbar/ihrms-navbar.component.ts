import { Component, EventEmitter, Input, OnInit, Output, SecurityContext } from '@angular/core';
import { User } from '@ihrms/auth';
import { ProfileMenuItems } from '../_models';
import { DomSanitizer, ɵDomSanitizerImpl } from '@angular/platform-browser';

@Component({
  selector: 'ihrms-navbar',
  templateUrl: './ihrms-navbar.component.html',
  styleUrls: ['./ihrms-navbar.component.scss']
})
export class IhrmsNavbarComponent {

  @Input() profileMenuItems: ProfileMenuItems[] = [];

  user: User = {
    username: JSON.parse(sessionStorage.getItem('auth-user') || '').username,
    userImg: 'shiba1.jpg',
    designation: JSON.parse(sessionStorage.getItem('auth-user') || '').designation
  };

  notificationMenus = [
    { icon: 'account_circle', text: 'You have pending verification.' },
    { icon: 'logout', text: 'This is another notification.' },
    { icon: 'account_circle', text: 'You have pending verification 2.' },
    { icon: 'logout', text: 'This is another notification 2.' },
    { icon: 'account_circle', text: 'You have pending verification 3.' },
    { icon: 'logout', text: 'This is another notification 3.' }
  ];

  placeholder = 'Search Goal, Leave or Salary';

  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() toggleNotification: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() profileClickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() orgClickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() dashboardClickEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected _sanitizer: DomSanitizer,
    protected _sanitizerImpl: ɵDomSanitizerImpl
  ) {
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onToggleNotification() {
    this.toggleNotification.emit();
  }

  openDashboard() {
    this.dashboardClickEvent.emit(true);
  }

  openOrgChart() {
    this.orgClickEvent.emit(true);
  }

  onProfileClick(event: any, item: any) {
    this.profileClickEvent.emit({ event, item });
  }

  backgroundImg(headerImg: any) {
    // raw URL
    const url = `${'http://localhost:4200/assets/' + headerImg}`;
    // safe value type URL
    const safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url as any);
    // sanitized back from safe value raw URL
    return this._sanitizerImpl.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
  }

}
