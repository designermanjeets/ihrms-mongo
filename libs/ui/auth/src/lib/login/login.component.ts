import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService, GQL_LOGIN, GQL_ROLES } from '../_services';

import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/types';
import { swiperImages } from '../_models';
import { CONSTANTS, SharedService } from '@ihrms/shared';
import { TokenStorageService } from '../_services/token.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Apollo } from 'apollo-angular';
import { map, Subscription } from 'rxjs';
import { Role } from '@ihrms/auth';

const TOKEN_KEY = 'auth-token';

@Component({
  selector: 'ihrms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginComponent implements OnInit {

  hidePassword = true
  showLogin = false;

  loginForm: FormGroup = new FormGroup({});
  loading = false;
  submitted = false;
  returnUrl: string | undefined;
  error = '';

  swiperConfig: SwiperOptions = {
    pagination: { el: '.swiper-pagination', clickable: true },
    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev'
    // },
    spaceBetween: 100,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    loop: true,
    autoplay: {
      delay: 3500,
    },
  };

  swiperImages: swiperImages[] = [
    { path: './assets/login.png', alt: './assets/login.png', caption: 'Manage you Attendance daily, Monthly and Yearly 1' },
    { path: './assets/login2.png', alt: './assets/login2.png', caption: 'Manage you Attendance daily, Monthly and Yearly 2' },
    { path: './assets/login3.png', alt: './assets/login3.png', caption: 'Manage you Attendance daily, Monthly and Yearly 3' }
  ]

  tenantOptions: any = [];
  isLoggiedIn = false;

  @ViewChild('usefulSwiper', {static: false}) usefulSwiper: SwiperComponent | any;

  public randomLoader = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

  sub!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
    private tokenStorage: TokenStorageService,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    private apollo: Apollo
  ) {

    // redirect to home if already logged in
    if (sessionStorage.getItem(TOKEN_KEY) && sessionStorage.getItem('tenantId')) {
      const role = sessionStorage.getItem('role');
      role && JSON.parse(role).role_name === (CONSTANTS.ADMIN).toUpperCase() ? this.router.navigate([CONSTANTS.ADMIN_DASHBOARD]) : this.router.navigate([CONSTANTS.EMP_DASHBOARD]);
      this.showLogin = false;
    } else {
      this.showLogin = true;
    }

  }

  ngOnInit() {

    this.initLoginForm();

    this.activatedRoute.data.subscribe(data => {
      if(data) {
        this.authService.environment = data?.environment;
        this.sharedService.environment = data?.environment;
      }
    });

    // get return url from route parameters
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];

  }

  initLoginForm() {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      tenant: [''],
    });

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {

    if(this.isLoggiedIn && this.tenantOptions?.length > 1) {
      const role = sessionStorage.getItem('role') || '';
      sessionStorage.setItem('tenantId', this.loginForm.value.tenant);
      // this.getUserPermissions(JSON.parse(role)._id);

      this.sub = this.apollo.watchQuery<any, any>({ query: GQL_ROLES, variables: { query: { limit: 100, id: JSON.parse(role)._id }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getRoles))
      .subscribe(val => {
        if(val) {
          this.sharedService.userrolepermission = val;
          const checkIfAdminOrNon = this.sharedService.checkIfAdminOrNon();
          this.returnUrl ? 
            this.router.navigate([this.returnUrl]) : 
            role && checkIfAdminOrNon ? 
              this.router.navigate([CONSTANTS.ADMIN_DASHBOARD]) : 
              this.router.navigate([CONSTANTS.EMP_DASHBOARD]);
        }
      });

    } else {

      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
        this.toastrService.error(`Username or Password Incorrect.`,`Login Error`, { timeOut: 1000 });
        return;
      }
  
      this.loading = true;
      this.ngxService.startLoader(this.randomLoader);
  
      this.apollo
        .mutate({
          mutation: GQL_LOGIN,
          variables: {
            username: this.loginForm.value.username,
            email: this.loginForm.value.username,
            password: this.loginForm.value.password
          },
        })
        .subscribe(({ data }: any) => {
          if (data) {
            if(data.login.tenants?.length < 2) {
              sessionStorage.setItem('tenantId', data.login?.user.tenantid);
            }
            this.ngxService.stopLoader(this.randomLoader);
            this.toastrService.success( 'Login Success!', 'Login Success!', { timeOut: 1000 } );
            setTimeout( () => this.onLoginSuccessGQL(data), 1000);
          }
        },(error) => {
            this.ngxService.stopLoader(this.randomLoader);
      });
    }

  }

  onLoginSuccessGQL(data: any) {
    data.login.user.userID = data.login?.user._id;
    this.tokenStorage.saveToken(data.login?.token);
    this.tokenStorage.saveRefreshToken(data.login?.refresh_token);
    this.tokenStorage.saveUser(
      { ...data.login?.user, 
        ...data.login?.role,
        ...{ designation: data.login?.designation?.name } }
      );
    this.tokenStorage.saveRole(data.login?.role);
    if(data.login?.role?.role_name === Role.GONNGOD.toUpperCase()) {
      sessionStorage.setItem('tenantId', data.login?.user.tenantid);
    }
    // this.getUserPermissions(data.login?.role?._id);
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_ROLES, variables: { query: { limit: 100, id: data.login?.role?._id }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getRoles))
      .subscribe(val => {
        if(val) {
          this.sharedService.userrolepermission = val;
          if(data.login.tenants?.length && data.login?.role?.role_name !== Role.GONNGOD.toUpperCase()) {
            if(data.login.tenants?.length > 1) {
              this.isLoggiedIn = true;
              this.loginForm.get('username')?.disable();
              this.loginForm.get('password')?.disable();
              this.tenantOptions = data.login.tenants;
            } else {
              this.redirectOptions(data);
            }
          } else {
            this.redirectOptions(data);
          }
        }
      });
  }

  redirectOptions(data: any) {
    const checkIfAdminOrNon = this.sharedService.checkIfAdminOrNon();
    this.returnUrl ? 
      this.router.navigate([this.returnUrl]) : 
      checkIfAdminOrNon ?  
        this.router.navigate([CONSTANTS.ADMIN_DASHBOARD]) : 
        this.router.navigate([CONSTANTS.EMP_DASHBOARD]);
  }

  getUserPermissions(role_id: any) {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_ROLES, variables: { query: { limit: 100, id: role_id }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getRoles))
      .subscribe(val => this.sharedService.userrolepermission = val);
  }

  changepass(event: any) {
    this.router.navigate(['login/changepwd']);
  }

  logout() {
    this.authService.logout();
  }

}
