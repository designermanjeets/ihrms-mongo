import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models';
import { SharedService } from '@ihrms/shared';
import { gql } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';


// We use the gql tag to parse our query string into a query document
export const GQL_LOGIN = gql`
  mutation login(
    $username: String
    $email: String!
    $password: String!
  ) {
    login(
      username: $username
      email: $email
      password: $password
    ) {
      user {
        username
        _id
        tenantid
        eCode
      }
      role {
        _id
        role_name
      }
      tenants {
        _id
        name
        printName
      }
      token
      refresh_token
      tokenExpiration
      designation {
        name
      }
    }
  }
`;

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


// We use the gql tag to parse our query string into a query document
export const GQL_CHANGEPWD = gql`
  mutation ChangePassword(
    $eCode: String!, 
    $oldPassword: String!, 
    $newPassword: String!
  ) {
    changePassword(
      eCode: $eCode, 
      oldPassword: $oldPassword, 
      newPassword: $newPassword
    ) {
      newPassword
      oldPassword
      user {
        username
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private _environment: any;

  public get environment(): any {
    return this._environment;
  }

  public set environment(val: any) {
    if(val) {
      this._environment = val;
    }
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get toaster_Service() {
    return this.toasterService;
  }

  private currentUserSubject: BehaviorSubject<User> | any;
  public currentUser: Observable<User>;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private toasterService: ToastrService
  ) {

    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(
        JSON.stringify(sessionStorage.getItem('currentUser'))
      )
    );

    this.currentUser = this.currentUserSubject.asObservable();

  }

  login(username: string, password: string) {

    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.post<any>(`${this.environment.apiURL}/TokenAuth/Authenticate`, { userNameOrEmailAddress: username, password },  { 'headers': headers })
      .pipe(map(data => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(data.result);
        return data.result;
      }));

  }

  logout() {
    // remove user from local storage to log user out
    window.sessionStorage.clear();
    window.localStorage.clear();
    this.currentUserSubject.next(null);
    console.log('window.location.reload()');
    window.location.reload();
  }

  refreshToken(token: string) {

    this.environment = this.environment || this.sharedService.environment;

    return this.http.post(`${this.environment.apiURL}/TokenAuth/Authenticate` + 'refreshtoken', {
      refreshToken: token
    }, this.httpOptions);
  }

  getUserRole(userId: number) {
    return this.http.get(`${this.environment.apiURL}/services/app/Role/Get?Id=${userId}`);
  }

}
