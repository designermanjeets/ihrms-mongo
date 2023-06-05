import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Inject, Input, OnDestroy,
  OnInit, Optional,
  ViewChild
} from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { BehaviorSubject, combineLatest, concat, EMPTY, forkJoin, Observable, of, Subject, Subscription } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { GQL_CREATE_USER, GQL_UPDATE_USER, MyprofileService } from './_services/myprofile.service';
import { GQL_ALL_EMPLOYEES, GQL_DEPARTMENTS, GQL_DESIGNATIONS, GQL_EMPLOYEES, GQL_EMPLOYEE_BY_ID, GQL_EMPLOYEE_TYPES, GQL_JOB_TITLES, GQL_MODE_OF_EMPLOYMENT, GQL_ROLE, GQL_SHIFTS, IhrmsComponentsService } from '../_services/ihrms-components.service';
import { CONSTANTS } from '@ihrms/shared';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ihrms-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MyprofileService,
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }}
  ]
})
export class MyProfileComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() readOnlyOfficial!: boolean;
  @Input() readOnlyPersonal!: boolean;
  @Input() readOnlyQualification!: boolean;
  @Input() readOnlyExperience!: boolean;

  @Input() patchValueOfficial!: any;
  @Input() patchValuePersonal!: any;
  @Input() patchValueQualification!: any;
  @Input() patchValueExperience!: any;

  @Input() createProfile!: boolean;
  @Input() isMyProfile!: boolean;
  @Input() fieldsToBeDisabled!: any[];

  formOfficialInfo!: FormGroup;
  formPersonalInfo!: FormGroup;
  formQualificationInfo!: FormGroup;
  formExperienceInfo!: FormGroup;

  officialControls$!: Observable<ControlBase<any>[]>;
  personalControls$!: Observable<ControlBase<any>[]>;
  qualificationsControls$!: Observable<ControlBase<any>[]>;
  experienceControls$!: Observable<ControlBase<any>[]>;

  officialControlsObj!: any;
  personalControlsObj!: any;
  qualificationsControlsObj!: any;
  experienceControlsObj!: any;

  updateQuali$ = new BehaviorSubject(false);
  updateExp$ = new BehaviorSubject(false);

  formOfficialInfoSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  formPersonalInfoSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  formQualificationInfoSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  formExperienceInfoSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  employeeQualiData: any | undefined;
  employeeQualiBtnText = CONSTANTS.ADD;
  employeeQualiGridApi!: GridApi;
  employeeQualiGridColumnApi!: ColumnApi;
  employeeQualiGridOptions!: GridOptions;
  employeeQualiRowCurrentSelected!: number;
  employeeQualiRowIndexOrID: Subject<any> = new Subject();

  employeeExpData: any | undefined;
  employeeExpBtnText = CONSTANTS.ADD;
  employeeExpGridApi!: GridApi;
  employeeExpGridColumnApi!: ColumnApi;
  employeeExpGridOptions!: GridOptions;
  employeeExpRowCurrentSelected!: number;
  employeeExpRowIndexOrID: Subject<any> = new Subject();

  sub!: Subscription;

  userProfileDataState: any;
  userProfileDataStateTemp: any;

  public profileLoader = new Date(Date.now()).toString();

  @ViewChild('stepper') stepper: MatStepper | undefined;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _mps: MyprofileService,
    private _ihrmscs: IhrmsComponentsService,
    private fb: FormBuilder,
    @Optional() public dialogRef: MatDialogRef<MyProfileComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private apollo: Apollo
  ) { }

  ngOnInit(): void {

    this.employeeQualiData = {
      title: '',
      pagination: true,
      columnFit: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'educationName' },
          { field: 'boardUniversity' },
          { field: 'fromMonthYear' },
          { field: 'toMonthYear' },
          { field: 'percentage' },
          { field: 'schoolCollege' },
          { field: 'educationType' },
          {
            field: 'Action', cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputEmployeeQualiActions.bind(this),
              value: { actionBtn: ['edit', 'cancel'] }
            },
            hide: this.readOnlyQualification
          }
        ],
        rowData: [],
        updateGridFromOutside: this.employeeQualiRowIndexOrID,
      },
      flex: 100
    };

    this.employeeExpData = {
      title: '',
      pagination: true,
      columnFit: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'companyName' },
          { field: 'fromMonthYear' },
          { field: 'toMonthYear' },
          { field: 'reasonForLeaving' },
          { field: 'isCurrentCompany', cellRenderer: 'GridCheckBoxComponent', autoHeight: true },
          {
            field: 'Action', cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputEmployeeExpActions.bind(this),
              value: { actionBtn: ['edit', 'cancel'] }
            },
            hide: this.readOnlyExperience
          }
        ],
        rowData: [],
        updateGridFromOutside: this.employeeExpRowIndexOrID,
      },
      flex: 100
    };

    this.getControlsAndControlObjs();

    this.getEntities();

    this.cdRef.detectChanges();

  }

  ngAfterViewInit() {
    // this.stepper?.reset();
    if(this.isMyProfile) {
      const userID = JSON.parse(sessionStorage.getItem('auth-user') || '').userID;
      this.getUserDataById(userID);
    }
    if(this.dialogData && this.dialogData?.formConfig?.patchValue) {
      this.getUserDataById(this.dialogData?.formConfig?.patchValue?._id);
    } else {
      this.userProfileDataStateTemp = null;
      this._mps.setUserProfileData = null;
    }
    this.stepper?.selectionChange.subscribe((val: any) => this.saveUserData());
    this.stepper?.animationDone.subscribe(() => this.patchUserData());
    this._mps.getUserProfileData.subscribe((val: any) => this.userProfileDataState = val);
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  getEntities() {
    this.ngxService.startLoader('profileLoader');
    const mapObjArr = [
      { controlsObj: this.officialControlsObj, query: 'getModeOfEmployments', formObj: 'modeOfEmploymentId' },
      { controlsObj: this.officialControlsObj, query: 'getRoles', formObj: 'roleId' },
      { controlsObj: this.officialControlsObj, query: 'getJobTitles', formObj: 'jobTitleId' },
      { controlsObj: this.officialControlsObj, query: 'getDepartments', formObj: 'unitDepartmentId' },
      { controlsObj: this.officialControlsObj, query: 'getShifts', formObj: 'employeeShiftIds' },
      { controlsObj: this.officialControlsObj, query: 'getEmployeeTypes', formObj: 'employeeTypeId' },
      { controlsObj: this.officialControlsObj, query: 'getAllUsers', formObj: 'reportingManagerId' },
    ];

    const getModeOfEmployments = this.apollo.watchQuery<any, any>({ query: GQL_MODE_OF_EMPLOYMENT, variables: { query: { limit: 100 }}}).valueChanges;
    const getRoles = this.apollo.watchQuery<any, any>({ query: GQL_ROLE, variables: { query: { limit: 100 }}}).valueChanges;
    const getJobTitles = this.apollo.watchQuery<any, any>({ query: GQL_JOB_TITLES, variables: { query: { limit: 100 }}}).valueChanges;
    const getDepartments = this.apollo.watchQuery<any, any>({ query: GQL_DEPARTMENTS, variables: { query: { limit: 100 }}}).valueChanges;
    const getShifts = this.apollo.watchQuery<any, any>({ query: GQL_SHIFTS, variables: { query: { limit: 100 }}}).valueChanges;
    const getEmployeeTypes = this.apollo.watchQuery<any, any>({ query: GQL_EMPLOYEE_TYPES, variables: { query: { limit: 100 }}}).valueChanges;
    const getAllUsers = this.apollo.watchQuery<any, any>({ query: GQL_ALL_EMPLOYEES, variables: { query: { limit: 1000, }}}).valueChanges; //approvers: [{ approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID }] 

    this.sub = combineLatest([ getModeOfEmployments, getRoles, getJobTitles, getDepartments, getShifts, getEmployeeTypes, getAllUsers])
    .pipe(
      map( (val: any) => val),
      catchError(() => {
        this.toastrService.error( `APIs are failing, Please Contact System Administrator!`, `Contact System Administrator!`, { } );
        return of(null)
      }),
      finalize( () =>  console.log('Done Loading All User Sub Masters!'))
    ).subscribe((results: any) => {
      if (results) {
        results.forEach((res: any, i: number) => {
          if (res.data[mapObjArr[i].query].length) {
            this.getSelectOptions(mapObjArr[i].controlsObj, res.data[mapObjArr[i].query], mapObjArr[i].formObj);
          }
        });
        this.ngxService.stopLoader('profileLoader');
        this.cdRef.detectChanges();
      }
    }, error => this.ngxService.stopLoader('profileLoader'));
  }

  getControlsAndControlObjs() {
    this.officialControls$ = this._mps.getOfficialControls();
    this.personalControls$ = this._mps.getPersonalControls$();
    this.qualificationsControls$ = this._mps.getQualificationsControls$();
    this.experienceControls$ = this._mps.getExperienceControls$();

    this.sub = this.officialControls$.subscribe((cntrls: ControlBase<any>[]) => this.officialControlsObj = cntrls);
    this.sub = this.personalControls$.subscribe((cntrls: ControlBase<any>[]) => this.personalControlsObj = cntrls);
    this.sub = this.qualificationsControls$.subscribe((cntrls: ControlBase<any>[]) => this.qualificationsControlsObj = cntrls);
    this.sub = this.experienceControls$.subscribe((cntrls: ControlBase<any>[]) => this.experienceControlsObj = cntrls);

  }

  getSelectOptions(controlsObj: any, items: any, formObj: string, optionKey?: string, optionValue?: string) {
    const control = controlsObj.filter((c: any) => c.key === formObj)[0];
    control && (control.options = []);
    control && items.forEach((vl: any, i: number) => {
      const optKey = optionKey ? items[i][optionKey] : (items[i]._id || items[i].statusId);
      const optValue = optionValue ? items[i][optionValue] : (items[i].name || items[i].role_name || items[i].eCode);
      control.options?.push({key: optKey, value: optValue})
    });
  }

  saveUserData() {
    this._mps.setUserProfileData = {
      formOfficialInfo: this.formOfficialInfo?.getRawValue(),
      formPersonalInfo: this.formPersonalInfo?.getRawValue(),
      formQualificationInfo: this.userProfileDataState?.formQualificationInfo,
      formExperienceInfo: this.userProfileDataState?.formExperienceInfo,
    };
  }

  patchUserData() {
    this.formOfficialInfo?.patchValue(this.userProfileDataState?.formOfficialInfo);
    this.formPersonalInfo?.patchValue(this.userProfileDataState?.formPersonalInfo);
    if(!this.createProfile) {
      this.formOfficialInfo?.get('eCode')?.disable({ emitEvent: false });
      this.formOfficialInfo?.get('username')?.disable({ emitEvent: false });
    }
    this.disableMyProfileFilds();
  }

  formCancelEvent(event: boolean) {
    if(this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigateByUrl(`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_ALL_EMPLOYEES}`);
    }
  }

  getUserDataById(_id: string) {
    this.apollo.watchQuery<any, any>({ query: GQL_EMPLOYEE_BY_ID, variables: { query: { limit: 100, id: _id }}})
    .valueChanges.subscribe(val => {
      if(val.data?.getUsers?.length) {
        this.userProfileDataStateTemp = val.data.getUsers[0];
        this.formOfficialInfo.patchValue(this.userProfileDataStateTemp);
        this.formOfficialInfo.get('eCode')?.disable({ emitEvent: false });
        this.formOfficialInfo.get('username')?.disable({ emitEvent: false });
        // formQualificationInfo
        this.employeeQualiData.gridData.rowData = val.data.getUsers[0].qualification;
        this.employeeQualiRowIndexOrID.next({rowData: val.data.getUsers[0].qualification, action: CONSTANTS.UPDATE});
        // // Experience
        this.employeeExpData.gridData.rowData = val.data.getUsers[0].experience;
        this.employeeExpRowIndexOrID.next({rowData: val.data.getUsers[0].experience, action: CONSTANTS.UPDATE});
        
        this._mps.setUserProfileData = {
          formOfficialInfo: this.formOfficialInfo?.getRawValue(),
          formPersonalInfo: this.formPersonalInfo?.getRawValue(),
          formQualificationInfo: this.userProfileDataState?.formQualificationInfo,
          formExperienceInfo: this.userProfileDataState?.formExperienceInfo,
        };
        this.disableMyProfileFilds();
      }
    })
  }

  disableMyProfileFilds() {
    if(this.isMyProfile) {
      console.log(this.fieldsToBeDisabled);
      this.fieldsToBeDisabled.forEach(fields => {
        this.formOfficialInfo.get(fields)?.disable({ emitEvent: false });
      })
    }
  }

  formOfficialInfoObjectEvent (form: FormGroup) {
    this.formOfficialInfo = form;
    if(this.dialogData && this.dialogData?.formConfig?.patchValue) {
      this.formOfficialInfo.patchValue(this.userProfileDataStateTemp);
    }
    this.sub = this.formOfficialInfo?.valueChanges
      .pipe(
        debounceTime(100),
        map(val => val && val.unitDepartmentId),
        distinctUntilChanged(),
        switchMap((id) => id ? this.apollo.watchQuery<any, any>({ query: GQL_DESIGNATIONS, variables: { query: { limit: 100, departmentId: id }}}).valueChanges: EMPTY))
        .subscribe((val: any) => {
          if(val && val.data && val.data.getDesignations?.length) {
            this.getSelectOptions(this.officialControlsObj, val.data.getDesignations,  'designationId');
            this.cdRef.detectChanges();
          }
      });
  };

  formPersonalObjectEvent (form: FormGroup) {
    this.formPersonalInfo = form;
    if(this.dialogData && this.dialogData?.formConfig?.patchValue) {
      this.formPersonalInfo.patchValue(this.userProfileDataStateTemp);
    }
  };

  formQualificationObjectEvent (form: FormGroup) {
    this.formQualificationInfo = form;
    this.formQualificationInfo?.valueChanges
      .pipe( debounceTime(100))
      .subscribe(val => {
        if(val && val.fromMonthYear) {
          const control = this.qualificationsControlsObj.filter((c: any) => c.key === 'toMonthYear')[0];
          control.validators.minDate = val.fromMonthYear;
          this.updateQuali$.next(true);
        }
    });

  };

  formExperienceObjectEvent (form: FormGroup) {
    this.formExperienceInfo = form;
    this.sub = this.formExperienceInfo?.valueChanges
      .pipe( debounceTime(100))
      .subscribe(val => {
        if(val && val.dynamicArr[0].fromMonthYear) {
          const control = this.experienceControlsObj[0].dynamicArr.filter((c: any) => c.key === 'toMonthYear')[0];
          control.validators.minDate = val.dynamicArr[0].fromMonthYear;
          this.updateExp$.next(true);
        }
      });
  };

  formSubmitEvent(event: any, form: FormGroup) {
    console.log(form);
    console.log(event);
  };

  // formAddMoreQualiEvent(event: any) {
  //   this.dynamicExpArray.push(this.createExpGroup());
  //   this.validateAllFormFields(this.formExperienceInfo);
  // }

  get dynamicExpArray() {
    return this.formExperienceInfo.get('dynamicArr') as FormArray;
  }

  createExpGroup(): FormGroup {
    return this.fb.group({
      company: ['', Validators.required],
      fromMonthYear: ['', Validators.required],
      toMonthYear: ['', Validators.required],
      reasonForLeaving: [''],
      isCurrentCompany: ['']
    });
  }

  onEmployeeQualiGridReady(event: any) {
    this.employeeQualiGridApi = event.gridApi;
    this.employeeQualiGridColumnApi = event.gridColumnApi;
    this.employeeQualiGridOptions = event.gridOptions;
  }

  formAddMoreQualiEvent(event: any) {
    const formValue = event?.form?.value; // Since we have only 1 item in array always,  until dynamic generated many
    if(this.employeeQualiBtnText === CONSTANTS.EDIT) {
      console.log(CONSTANTS.EDIT);
      this.employeeQualiRowIndexOrID.next({rowIndex: this.employeeQualiRowCurrentSelected, data: formValue, action: CONSTANTS.EDIT});
    }
    if(this.employeeQualiBtnText === CONSTANTS.ADD) {
      delete event.id;
      console.log(CONSTANTS.ADD);
      this.employeeQualiRowIndexOrID.next({rowIndex: this.employeeQualiRowCurrentSelected, data: formValue, action: CONSTANTS.ADD});
    }
    //
    this.employeeQualiBtnText = CONSTANTS.ADD;
    this.formQualificationInfo.reset();

    const items: Array<any> = [];
    this.employeeQualiGridApi.forEachNode( (node: any) => items.push(node.data));
    this.userProfileDataState.formQualificationInfo = items;
    this.employeeQualiData.gridData.rowData = items;

    this.cdRef.detectChanges();
  }

  outputEmployeeQualiActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formQualificationInfo.patchValue(fData);
      this.employeeQualiBtnText= CONSTANTS.EDIT;
      console.log(CONSTANTS.EDIT);
      this.employeeQualiRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      console.log(CONSTANTS.CANCEL);
      this.employeeQualiGridApi.applyTransaction({ remove: [event.params.data] });
    }
    const items: Array<any> = [];
    this.employeeQualiGridApi.forEachNode( (node: any) => items.push(node.data));
    this.userProfileDataState.formQualificationInfo = items;
    this.employeeQualiData.gridData.rowData = items;
    this.cdRef.detectChanges();
  }

  onEmployeeExpGridReady(event: any) {
    this.employeeExpGridApi = event.gridApi;
    this.employeeExpGridColumnApi = event.gridColumnApi;
    this.employeeExpGridOptions = event.gridOptions;
  }

  formAddMoreExpEvent(event: any) {
    const formValue = event?.form?.value?.dynamicArr[0]; // Since we have only 1 item in array always,  until dynamic generated many
    if(this.employeeExpBtnText === CONSTANTS.EDIT) {
      console.log(CONSTANTS.EDIT);
      this.employeeExpRowIndexOrID.next({rowIndex: this.employeeExpRowCurrentSelected, data: formValue, action: CONSTANTS.EDIT});
    }
    if(this.employeeExpBtnText === CONSTANTS.ADD) {
      delete event.id;
      console.log(CONSTANTS.ADD);
      this.employeeExpRowIndexOrID.next({rowIndex: this.employeeExpRowCurrentSelected, data: formValue, action: CONSTANTS.ADD});
    }
    //
    this.employeeExpBtnText = CONSTANTS.ADD;
    this.formExperienceInfo.reset();

    const items: Array<any> = [];
    this.employeeExpGridApi.forEachNode( (node: any) => items.push(node.data));
    this.userProfileDataState.formExperienceInfo = items;
    this.employeeExpData.gridData.rowData = items;

    this.cdRef.detectChanges();
  }

  outputEmployeeExpActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.dynamicExpArray.controls[0].patchValue(fData); // There's always 1 now, because of Grid
      this.employeeExpBtnText = CONSTANTS.EDIT;
      console.log(CONSTANTS.EDIT);
      this.employeeExpRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      console.log(CONSTANTS.CANCEL);
      this.employeeExpGridApi.applyTransaction({ remove: [event.params.data] });
    }
    const items: Array<any> = [];
    this.employeeExpGridApi.forEachNode( (node: any) => items.push(node.data));
    this.userProfileDataState.formExperienceInfo = items;
    this.employeeExpData.gridData.rowData = items;
    this.cdRef.detectChanges();
  }

  stepperSubmitEvent(event: boolean) {
    if(event) {

      this.ngxService.startLoader(this.profileLoader);

      const payload = {
        ...this.userProfileDataState.formOfficialInfo,
        ...this.userProfileDataState.formPersonalInfo,
        ...{ qualification: this.userProfileDataState.formQualificationInfo },
        ...{ experience:  this.userProfileDataState.formExperienceInfo },
      }

      !payload.status && (payload.status = false);
      !payload.overtime && (payload.overtime = false);

      if(this.dialogData?.formConfig?.patchValue ||  this.isMyProfile) {
        delete payload.password; // Password should never be edited
        // Update User
        this.sub = this.apollo
        .mutate({
          mutation: GQL_UPDATE_USER,
          variables: payload,
        })
        .subscribe(val => {
          if(val) {
            this.ngxService.stopLoader(this.profileLoader);
            this.toastrService.success( `Success`, `User Updated Successfully!`, { } );
            this.stepper?.reset();
          }
        }, error => {
          this.ngxService.stopLoader(this.profileLoader);
          this.toastrService.error( `${error.error?.error?.message}`, `User Updation Failed!`, { } );
        });
      } else {
        // Create User
        this.sub = this.apollo
        .mutate({
          mutation: GQL_CREATE_USER,
          variables: payload,
        })
        .subscribe(val => {
          console.log(val);
          if(val) {
            this.ngxService.stopLoader(this.profileLoader);
            this.toastrService.success( `Success`, `User Created Successfully!`, { } );
            this.stepper?.reset();
          }
        }, error => {
          this.ngxService.stopLoader(this.profileLoader);
          this.toastrService.error( `${error.error.error.message}`, `User Creation Failed!`, { } );
        });
      }
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        this.cdRef.detectChanges();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}
