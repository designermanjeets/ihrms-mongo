import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CONSTANTS, SharedService } from '@ihrms/shared';

const USER_KEY = 'auth-user';
const USER_ROLE = 'role';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private sharedService: SharedService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const checkIfAdminOrNon = this.sharedService.checkIfAdminOrNon() ? CONSTANTS.ADMIN: CONSTANTS.EMPLOYEE;
      // check if route is restricted by role
      if (route.data.roles && route.data.roles.indexOf(checkIfAdminOrNon?.toUpperCase()) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
