/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { IhrmsSidebarService, NavItem } from '@ihrms/ihrms-sidebar';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { delay, distinctUntilChanged, Subject } from 'rxjs';
import { CONSTANTS, SharedService } from '@ihrms/shared';

@Component({
  selector: 'ihrms-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuItemComponent implements OnInit {

  expanded = false;

  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;

  @Input() item: NavItem | any;

  @Input() depth = 0;

  @Input() opened!: boolean;

  @Output() navItemSelected: EventEmitter<any> = new EventEmitter<any>();

  allAdminMenuItems!: NavItem[];

  constructor(
    private ihrmsSidebarService: IhrmsSidebarService,
    public router: Router,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit(): void {

    this.sharedService.userrolepermission.subscribe((val: any) => this.allAdminMenuItems = val?.NavItemsAdmin);
    
    this.ihrmsSidebarService.currentUrl
    .pipe(
      distinctUntilChanged((obj1: any, obj2: any) => obj1.route === obj2.route)
    )
    .subscribe((url: string) => {
      if (this.item.route && url) {
        const getActiveItem = JSON.parse(sessionStorage.getItem('activeNavItem') || "{}");
        // console.log(`Checking '/${this.item.route}' against '${url}'`);
        // this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.expanded = this.item.displayName === getActiveItem;
        this.ariaExpanded = this.expanded;
        this.cdRef.detectChanges();
      }
    });
  }

  onItemSelected(item: NavItem) {
    this.navItemSelected.emit(item);
    const getActiveItem = JSON.parse(sessionStorage.getItem('activeNavItem') || "{}");
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
      if(this.expanded) {
        sessionStorage.setItem('activeNavItem', JSON.stringify(item.displayName));
      }
      if(item.displayName === 'Settings') {
        this.router.navigate([item.route]);
      }
     }
  }

}
