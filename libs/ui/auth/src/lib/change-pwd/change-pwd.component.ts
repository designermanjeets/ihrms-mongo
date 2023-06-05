import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService, GQL_CHANGEPWD, GQL_LOGIN, GQL_ROLES } from '../_services';

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
  selector: 'ihrms-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePwdComponent implements OnInit {

  hidePassword1 = true
  hidePassword2 = true
  showLogin = false;

  loginForm: FormGroup = new FormGroup({});
  loading = false;
  submitted = false;
  returnUrl: string | undefined;
  error = '';

  tenantOptions: any = [];
  isPasswordMatched = true;

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
    //
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
      eCode: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
      tenant: [''],
    });

    this.loginForm.valueChanges.subscribe(val => {
      if(val) {
        if(val.newPassword !== val.confirmNewPassword) {
          this.isPasswordMatched = false;
        } else {
          this.isPasswordMatched = true;
        }
      }
    })

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {

    this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
        this.toastrService.error(`eCode or Password Incorrect.`,`Change Password Error`, { timeOut: 1000 });
        return;
      }
  
      this.loading = true;
      this.ngxService.startLoader(this.randomLoader);
  
      this.apollo
        .mutate({
          mutation: GQL_CHANGEPWD,
          variables: {
            eCode: this.loginForm.value.eCode,
            oldPassword: this.loginForm.value.oldPassword,
            newPassword: this.loginForm.value.newPassword,
            confirmNewPassword: this.loginForm.value.confirmNewPassword
          },
        })
        .subscribe(({ data }: any) => {
          if (data) {
            this.ngxService.stopLoader(this.randomLoader);
            this.toastrService.success( 'Password Changed Success!', 'Success!', { timeOut: 1000 } );
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1000);
          }
        },(error) => {
            this.ngxService.stopLoader(this.randomLoader);
      });

  }

}
