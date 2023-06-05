/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AfterViewInit, ChangeDetectorRef, Component, Inject, Optional } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { notificationItems } from './_models';
import { CONSTANTS, SharedService } from '@ihrms/shared';
import { NavigationEnd, Router, NavigationStart } from '@angular/router';
import { profileMenuItemsEmp, profileMenuItemsAdmin } from './_models/profileMenuItems';
import { ProfileMenuItems } from '@ihrms/ihrms-navbar';
import { NotificationConfig, NotificationItem } from '@ihrms/ihrms-components';
import { NavItem } from '@ihrms/ihrms-sidebar';
import { AuthService, Role } from '@ihrms/auth';
import { environment } from '../environments/environment';
import gql from 'graphql-tag';
import * as moment from 'moment';
import { distinctUntilChanged, map, Subscription, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Meta } from '@angular/platform-browser';
import { timer } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'

const TOKEN_KEY = 'auth-token';

export const GQL_ROLES = gql`
  query result(
    $query: Pagination!
  ) {
    getRoles(
      query: $query
    ) {
      _id
      role_name
      status
      isDefault
      comments
      privileges {
        module {
          name
          iconName
          url
          sub_module {
            db
            name
            iconName
            isChild
            url
            actions {
              add
              edit
              show
              delete
              authorize
              cancel
              import
              export
            }
          }
        }
      }
      audit {
        created_at
      }
      
    }
  }
`;

export const GQL_GET_ATTENDANCE_BY_DATE_WISE = gql`
  query Query($query: Pagination!) {
    getAttendancesByDayWise(query: $query)
  }
`;

@Component({
  selector: 'ihrms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements AfterViewInit{

  public viewLoaded = false;
  public opened = false; // Change isDocked too
  private isDocked = true;
  public openedNotification = false;
  public mode = 'push' as any;
  public dock = true;
  public isLoggedIn = false;

  sideBarWidth = 230;
  notificationBarWidth = 600;
  dockedSize = '85px'; // Change Dock value in app.component.scss too || translateX(85px)

  navItems!: NavItem[];
  notificationItems: NotificationItem[] = notificationItems;
  profileMenuItems!: ProfileMenuItems[];

  notificationConfig: NotificationConfig = {
    title: 'Company Notifications',
  };
  
  sub!: Subscription;
  getuserrolepermission!: any;
  
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
    translate: TranslateService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    @Optional() private authService: AuthService,
    private sharedService: SharedService,
    private apollo: Apollo,
    private ngxService: NgxUiLoaderService,
    private metaService: Meta,
    private breakpointObserver: BreakpointObserver
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    timer(50).subscribe(() => {
      console.log('updating Meta')
      this.metaService.removeTag('name="viewport"');
      this.metaService.addTag({ name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' })
    })

    this.userSessionCheck();

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if(val.url.includes(`${CONSTANTS.ADMIN_DASHBOARD}`)) {
          this.profileMenuItems = profileMenuItemsAdmin;
          this.sharedService.userrolepermission.subscribe((val: any) => this.navItems = val?.NavItemsAdmin);
        } else if(val.url.includes(`${CONSTANTS.EMP_DASHBOARD}`)) {
          this.sharedService.userrolepermission.subscribe((val: any) => this.navItems = val?.NavItemsEmp);
          this.profileMenuItems = profileMenuItemsEmp;
        }
        this.userSessionCheck();
      }
    });

    this.sharedService.environment = environment;

    this.breakpoint$.subscribe(() =>
      this.breakpointChanged()
    );

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
      this.mode = 'slide';
      this.dockedSize = '55px'
      this.isMobile = true;
    } else {
      this.mode = 'push';
      this.dockedSize = '85px'
      this.isMobile = false;
    }
  }

  userSessionCheck() {
    if(sessionStorage.getItem(TOKEN_KEY)) {
      if(sessionStorage.getItem('tenantId')) {
        this.isLoggedIn = true;
        this.getUserPermissions(JSON.parse(sessionStorage.getItem('role') || '')._id);
      } else if(JSON.parse(sessionStorage.getItem('role') || '').role_name === Role.GONNGOD.toUpperCase()) {
        this.isLoggedIn = true;
      }
    } else {
      this.isLoggedIn = false;
      if(!this.router.url.includes('changepwd')) {
        this.router.navigate(['/login']);
      }
    }
  }

  getClockInOutDataWebClockin() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_GET_ATTENDANCE_BY_DATE_WISE, 
      variables: {
        query: {
          dates: { gte: moment().startOf('day').format() },
          userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
        }}
      }).valueChanges
      .pipe(map((data: any) => data?.data?.getAttendancesByDayWise[0]))
      .subscribe((res: any) => {
        if(res?.punchIn && res?.punchOut) {
        sessionStorage.removeItem('isLoggedIn');
        } else {
          sessionStorage.removeItem('isLoggedIn');
          sessionStorage.setItem('isLoggedIn', res?.punchIn.toString())
        }
    })
  }

  getUserPermissions(role_id: any) {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_ROLES, variables: { query: { limit: 100, id: role_id }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getRoles))
      .subscribe(val => this.sharedService.userrolepermission = val);
      this.getClockInOutDataWebClockin();
  }

  ngAfterViewInit() {
    this.viewLoaded = true;
    this.cdRef.detectChanges();
  }

  enter() {
    if(this.isDocked) {
      this.opened = true;
      this.mode = 'over' as any;
    }
  }

  leave() {
    if(this.isDocked) {
      this.opened = false;
      this.mode = 'push' as any;
    }
  }

  toNumber(val: any) {
    return Number(val.replace('px', ''));
  }

  onNavItemClick(event: any) {
    if(this.opened && this.isMobile) {
      this.opened = false;
    }
  }

  navItemSelectedEvent(event: any) {
    console.log(event)
    // this.opened = true;
  }

  toggleSidebar(event: any) {
    this.opened = !this.opened;
    this.isDocked = !this.isDocked;
    setTimeout( (_: any) => window.dispatchEvent(new Event('resize')), 100); // For Gridster to force Re-Adjust
  }

  toggleNotification() {
    this.openedNotification = !this.openedNotification;
  }

  profileClickEvent(event: any) {
    if(event.item.id === CONSTANTS.MY_PROFILE) {
      if(this.router.url.includes('admin-dashboard')) {
        this.router.navigateByUrl(`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.MY_PROFILE}`);
      } else {
        this.router.navigateByUrl(`${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.MY_PROFILE}`);
      }
    }
    if(event.item.id === CONSTANTS.CREATE_POST) {
      this.router.navigateByUrl(`${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.CREATE_POST}`);
    }
    if(event.item.id === CONSTANTS.LOGOUT) {
      this.authService.logout();
      this.userSessionCheck();
    }
    if(event.item.id === CONSTANTS.ADMIN_DASHBOARD) {
      this.profileMenuItems = profileMenuItemsAdmin;
      this.router.navigateByUrl(`${CONSTANTS.ADMIN_DASHBOARD}`);
    }
    if(event.item.id === CONSTANTS.EMP_DASHBOARD) {
      this.profileMenuItems = profileMenuItemsEmp;
      this.router.navigateByUrl(`${CONSTANTS.EMP_DASHBOARD}`);
    }
  }

  orgClickEvent(event: any) {
    this.router.navigateByUrl(`${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_MY_ORG}`);
  }

  dashboardClickEvent(event: any) {
    this.router.navigateByUrl(`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.DASHBOARD_ALL}`);
  }

}
