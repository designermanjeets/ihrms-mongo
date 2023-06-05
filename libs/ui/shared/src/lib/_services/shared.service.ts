/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { NavItem } from '@ihrms/ihrms-sidebar';
import { CONSTANTS } from '../constants/constants';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  NavItemsAdmin!: NavItem[];
  NavItemsEmp!: NavItem[];

  private _permission: any;
  private _environment: any;
  private _userrolepermission: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public get environment(): any {
    return this._environment;
  }

  public set environment(val: any) {
    if(val) {
      this._environment = val;
    }
  }

  public get userrolepermission(): any {
    return this._userrolepermission.asObservable();
  }

  public set userrolepermission(val: any) {
    if(val && val.length) {
      this.generateUserSpecificMenuItems(val[0].privileges);
    }
  }

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  generateUserSpecificMenuItems(permissionVal: any) {

    sessionStorage.removeItem('_userrolepermission')
    this._userrolepermission.next(null);
    this._permission = [];
    this.NavItemsAdmin = [];
    this.NavItemsEmp = [];

    this.NavItemsAdmin.push({
      displayName: 'Home',
      iconName: 'grid_view',
      route: `${CONSTANTS.ADMIN_DASHBOARD}`,
    });

    this.NavItemsEmp.push({
      displayName: 'Home',
      iconName: 'grid_view',
      route: `${CONSTANTS.EMP_DASHBOARD}`,
    });

    this._permission = JSON.parse(JSON.stringify(permissionVal));
    sessionStorage.setItem('_userrolepermission', JSON.stringify(this._permission));

    this._permission?.module?.forEach(async(module: any, idx: number) => {
      
      // Check for Admin Menu Items
      if(module.url?.includes(CONSTANTS.ADMIN_DASHBOARD)){
        module.sub_module.forEach((sub_mod: any, idy: number) => (sub_mod['displayName'] = sub_mod.name, sub_mod['route'] = sub_mod.url));
        const val = module.sub_module?.filter((res: any) => res.actions.show );
          if(val.length){
              this.NavItemsAdmin.push({
                displayName: module.name,
                iconName: module.iconName,
                route: module.url,
                children: module.sub_module?.filter((sub: any) => sub.isChild && sub.actions.show)
              });
            }
          }

      // check For Non-Admin Menu Items
      module.sub_module.forEach((sub_mod: any, idy: number) => {
        if(sub_mod.actions.show == true && sub_mod.url?.includes(CONSTANTS.EMP_DASHBOARD)){
          this.NavItemsEmp.push({
            displayName: sub_mod.name,
            iconName: sub_mod.iconName,
            route: sub_mod.url
          });
        }
      });
    });

    this._userrolepermission.next({ NavItemsAdmin: this.NavItemsAdmin, NavItemsEmp: this.NavItemsEmp });
  }

  checkuserPermission(moduleDisplayName: any, sub_moduleDisplayName: any, action: any) {
    let allow = false;
    const _permiss: any = JSON.parse(sessionStorage.getItem('_userrolepermission') || '');
    (this._permission || _permiss)?.module?.forEach(async(u: any, idx: number) => {
        u.sub_module?.some((u: any, idy: number) => {
          if(u.name === sub_moduleDisplayName && u.actions[action] == true) {
            allow = true;
          }
        });

      });

    return allow;
  }
  
  checkIfAdminOrNon() {
    let allow = false;
    const _permiss: any = JSON.parse(sessionStorage.getItem('_userrolepermission') || '');
    (this._permission || _permiss)?.module?.forEach(async(module: any, idx: number) => {
      if(module.name === CONSTANTS.ADMIN) {
        module.sub_module?.forEach((sub_mod: any, idy: number) => {
          for (const action in sub_mod.actions) {
            if(sub_mod.actions[action] === true) {
              allow = true;
              console.log('At Least 1 is True');
            }
          }
        });
      }
    });

    return allow;
  }

  checkForNewAttendanceEntries(): Observable<any> {
    return this.http.get<any>('https://ihrms-attendance-express.azurewebsites.net/ihrms-sql')
  }

  webHookTestOnLeaveRequest(): Observable<any> {

    const SENDER = "447860099299"
    const RECIPIENT = "919988339877"

    const payload = {
    "messages":
        [
            {
                "from": SENDER,
                "to": RECIPIENT,
                "content": {
                    "templateName": "registration_success",
                    "templateData": {
                      "body": {
                        "placeholders": [
                          "sender",
                          "message",
                          "delivered",
                          "testing"
                        ]
                      },
                      "header": {
                        "type": "IMAGE",
                        "mediaUrl": "https://ihrms-ui.azurewebsites.net/assets/ihrms-logo.jpeg"
                      },
                      "buttons": [
                        {
                          "type": "QUICK_REPLY",
                          "parameter": "yes-payload"
                        },
                        {
                          "type": "QUICK_REPLY",
                          "parameter": "no-payload"
                        },
                        {
                          "type": "QUICK_REPLY",
                          "parameter": "later-payload"
                        }
                      ]
                  },
                  "language": "en"
                }
            }
        ]
    }

    const headers = new HttpHeaders()
      .set('Authorization', 'App e6b4e3b44900089a80c54733e1580ed8-813f7095-fbb3-4c71-9f33-e222f5bcf975')
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.post<any>('https://yrqjjg.api.infobip.com/whatsapp/1/message/template', payload,  { 'headers': headers })
  }


}