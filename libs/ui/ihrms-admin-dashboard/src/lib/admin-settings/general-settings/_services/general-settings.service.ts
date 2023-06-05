import { Injectable } from '@angular/core';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { gql } from 'apollo-angular';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralSettingsService {

  getGeneralControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Company Information',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: '_id',
        label: 'ID',
        order: 1,
        controlType: 'hidden'
      },
      {
        key: 'companyName',
        label: 'Company Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyLegalName',
        label: 'Legal Name',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyContactPerson',
        label: 'Contact Person',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyAddress',
        label: 'Company Address',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyPostalOrZipCode',
        label: 'Postal or Zip Code',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyCity',
        label: 'City',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyStateProvince',
        label: 'State/Province',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyCountry',
        label: 'Country',
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Punjab', value: 'Punjab' }
        ]
      },
      {
        key: 'companyEmail',
        label: 'Company Email',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyPhone',
        label: 'Company Phone',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyPhone2',
        label: 'Company Phone 2',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyMobilePhone',
        label: 'Mobile Phone',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyFax',
        label: 'Fax',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyWebsite',
        label: 'Website',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyRegistration',
        label: 'Company Registration',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'companyVAT',
        label: 'Company VAT',
        order: 1,
        controlType: 'textbox'
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getCompanyTaxControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Company Tax Details',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: '_id',
        label: 'ID',
        order: 1,
        controlType: 'hidden'
      },
      {
        key: 'companyName',
        label: 'Company Name',
        order: 1,
        controlType: 'hidden'
      },
      {
        key: 'PAN',
        label: 'PAN',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'TAN',
        label: 'TAN',
        validators: {
          required: true,
        },
        order: 2,
        controlType: 'textbox'
      },
      {
        key: 'TDSCircleAOSCode',
        label: 'TDS circle / AO code',
        validators: {
          required: true,
        },
        order: 2,
        controlType: 'textbox'
      },
      {
        key: 'taxPayFrequency',
        label: 'Tax Payment Frequency',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Monthly', value: 'Monthly' }
        ]
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getEPFControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Company EPF Information',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: '_id',
        label: 'ID',
        order: 1,
        controlType: 'hidden'
      },
      {
        key: 'companyName',
        label: 'Company Name',
        order: 1,
        controlType: 'hidden'
      },
      {
        key: 'EPFNumber',
        label: 'EPF Number',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'deductionCycle',
        label: 'Deduction Cycle',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Monthly', value: 'Monthly' }
        ]
      },
      {
        key: 'employerContributionRate',
        label: 'Employer Contribution Rate',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: '12 % of Actual PF Wage', value: '12 % of Actual PF Wage' }
        ]
      },
      {
        key: 'employeeContributionRate',
        label: 'Employee Contribution Rate',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: '12 % of Actual PF Wage', value: '12 % of Actual PF Wage' }
        ]
      },
      {
        key: 'includeEmployerContributionInCTC',
        label: 'Include employer\'s contribution in the CTC',
        order: 1,
        controlType: 'checkbox',
        fxFlex: 100
      },
      {
        key: 'overridePFContriAtEmployeeLevel',
        label: 'Override PF contribution rate at employee level',
        order: 1,
        controlType: 'checkbox',
        fxFlex: 100
      },
      {
        label: 'PF Configuration when LOP Applied',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: 'proRateRestrictedPFWage',
        label: 'Pro-rate Restricted PF Wage',
        order: 1,
        controlType: 'checkbox',
        fxFlex: 100,
        hint: '(PF contribution will be pro-rated based on the number of days worked by the employee.)'
      },
      {
        key: 'considerAllIfWageLessThanAmount',
        label: 'Consider all applicable PF components if PF wage is less than 15k after Loss of Pay',
        order: 1,
        controlType: 'checkbox',
        fxFlex: 100,
        hint: '(PF contribution will be pro-rated based on the number of days worked by the employee.)'
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getESIControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Company ESI Information',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: '_id',
        label: 'ID',
        order: 1,
        controlType: 'hidden'
      },
      {
        key: 'companyName',
        label: 'Company Name',
        order: 1,
        controlType: 'hidden'
      },
      {
        key: 'ESINumber',
        label: 'ESI Number',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'deductionCycle',
        label: 'Deduction Cycle',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Monthly', value: 'Monthly' }
        ]
      },
      {
        key: 'employerContributionRate',
        label: 'Employee\'s Contribution (Of Gross Pay)',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
        placeholder: 'Percentage'
      },
      {
        key: 'employeeContributionRate',
        label: 'Employer\'s Contribution (Of Gross Pay)',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
        placeholder: 'Percentage'
      },
      {
        key: 'includeEmployerContributionInCTC',
        label: 'Include employer\'s contribution in the CTC',
        order: 1,
        controlType: 'checkbox',
        fxFlex: 50
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getProfTaxControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Professional Tax Information',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: '_id',
        label: 'ID',
        order: 1,
        controlType: 'hidden'
      },
      {
        key: 'companyName',
        label: 'Company Name',
        order: 1,
        controlType: 'hidden'
      },
      {
        key: 'workLocation',
        label: 'Work Location',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Punjab', value: 'Punjab' }
        ]
      },
      {
        key: 'PTNumber',
        label: 'PT Number',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        key: 'deductionCycle',
        label: 'Deduction Cycle',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Monthly', value: 'Monthly' }
        ]
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getLabourWelfareFundControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Labour Welfare Fund Information',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: '_id',
        label: 'ID',
        order: 1,
        controlType: 'hidden'
      },
      {
        key: 'companyName',
        label: 'Company Name',
        order: 1,
        controlType: 'hidden'
      },
      {
        key: 'workLocation',
        label: 'Work Location',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Punjab', value: 'Punjab' }
        ]
      },
      {
        key: 'employeeContributionRate',
        label: 'Employees\' Contribution',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        key: 'employerContributionRate',
        label: 'Employer\'s Contribution',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        key: 'deductionCycle',
        label: 'Deduction Cycle',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Monthly', value: 'Monthly' }
        ]
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

}

export const GQL_TENANTS_BY_ID = gql`
  query result(
    $query: Pagination!
  ) {
    getTenants(
      query: $query
    ) {
      _id
      name
      email
      profile {
        companyName
        companyLegalName
        companyContactPerson
        companyAddress
        companyPostalOrZipCode
        companyCity
        companyStateProvince
        companyCountry
        companyEmail
        companyPhone
        companyPhone2
        companyMobilePhone
        companyFax
        companyWebsite
        companyRegistration
        companyVAT
      }
      tax {
        PAN
        taxPayFrequency
        TAN
        TDSCircleAOSCode
      }
      epf {
        EPFNumber
        deductionCycle
        employerContributionRate
        employeeContributionRate
        includeEmployerContributionInCTC
        overridePFContriAtEmployeeLevel
        proRateRestrictedPFWage
        considerAllIfWageLessThanAmount
      }
      esi {
        ESINumber
        deductionCycle
        employerContributionRate
        employeeContributionRate
        includeEmployerContributionInCTC
      }
      professionalTax {
        workLocation
        PTNumber
        deductionCycle
      }
      lwf {
        workLocation
        deductionCycle
        employerContributionRate
        employeeContributionRate
      }
    }
  }
`;

export const GQL_UPDATE_TENANT = gql`
  mutation editTenantMutation(
    $id: ID!
    $name: String!
    $email: String
    $profile: profileInputs
    $tax: taxInputs
    $epf: epfInputs
    $esi: esiInputs
    $professionalTax: professionalTaxInputs
    $lwf: lwfInputs
  ) {
    editTenant(
      _id: $id
      name: $name
      email: $email
      profile: $profile
      tax: $tax
      epf: $epf
      esi: $esi
      professionalTax: $professionalTax
      lwf: $lwf
    ) {
      _id
      name
      email
      profile {
        companyName
        companyLegalName
        companyContactPerson
        companyAddress
        companyPostalOrZipCode
        companyCity
        companyStateProvince
        companyCountry
        companyEmail
        companyPhone
        companyPhone2
        companyMobilePhone
        companyFax
        companyWebsite
        companyRegistration
        companyVAT
      }
      tax {
        PAN
        taxPayFrequency
        TAN
        TDSCircleAOSCode
      }
      epf {
        EPFNumber
        deductionCycle
        employerContributionRate
        employeeContributionRate
        includeEmployerContributionInCTC
        overridePFContriAtEmployeeLevel
        proRateRestrictedPFWage
        considerAllIfWageLessThanAmount
      }
      esi {
        ESINumber
        deductionCycle
        employerContributionRate
        employeeContributionRate
        includeEmployerContributionInCTC
      }
      professionalTax {
        workLocation
        PTNumber
        deductionCycle
      }
      lwf {
        workLocation
        deductionCycle
        employerContributionRate
        employeeContributionRate
      }
    }
  }
`;
