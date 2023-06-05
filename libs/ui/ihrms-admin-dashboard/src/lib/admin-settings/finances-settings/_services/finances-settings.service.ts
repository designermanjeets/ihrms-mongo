import { Injectable } from '@angular/core';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancesSettingsService {

  getFlexiBenefitsControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'FBP Preference',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: 'CompanyName',
        label: 'Company Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'LegalName',
        label: 'Legal Name',
        validators: {
          required: true,
        },
        order: 2,
        controlType: 'textbox'
      },
      {
        key: 'ContactPerson',
        label: 'Contact Person',
        validators: {
          required: true,
        },
        order: 3,
        controlType: 'textbox'
      },
      {
        key: 'CompanyAddress',
        label: 'Company Address',
        validators: {
          required: true,
        },
        order: 4,
        controlType: 'textbox'
      },
      {
        key: 'PostalorZipCode',
        label: 'Postal or Zip Code',
        validators: {
          required: true,
        },
        order: 5,
        controlType: 'textbox'
      },
      {
        key: 'City',
        label: 'City',
        validators: {
          required: true,
        },
        order: 6,
        controlType: 'textbox'
      },
      {
        key: 'State/Province',
        label: 'State/Province',
        validators: {
          required: true,
        },
        order: 7,
        controlType: 'textbox'
      },
      {
        key: 'Country',
        label: 'Country',
        validators: {
          required: true,
        },
        order: 8,
        controlType: 'dropdown',
        options: [
          { key: 'Punjab', value: 'Punjab' }
        ]
      },
      {
        key: 'CompanyEmail',
        label: 'Company Email',
        validators: {
          required: true,
        },
        order: 9,
        controlType: 'textbox'
      },
      {
        key: 'CompanyPhone',
        label: 'Company Phone',
        validators: {
          required: true,
        },
        order: 10,
        controlType: 'textbox'
      },
      {
        key: 'CompanyPhone2',
        label: 'Company Phone 2',
        validators: {
          required: true,
        },
        order: 11,
        controlType: 'textbox'
      },
      {
        key: 'MobilePhone',
        label: 'Mobile Phone',
        validators: {
          required: true,
        },
        order: 12,
        controlType: 'textbox'
      },
      {
        key: 'Fax',
        label: 'Fax',
        order: 13,
        controlType: 'textbox'
      },
      {
        key: 'Website',
        label: 'Website',
        order: 14,
        controlType: 'textbox'
      },
      {
        key: 'CompanyRegistration',
        label: 'Company Registration',
        validators: {
          required: true,
        },
        order: 15,
        controlType: 'textbox'
      },
      {
        key: 'CompanyVAT',
        label: 'Company VAT',
        validators: {
          required: true,
        },
        order: 16,
        controlType: 'textbox'
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

}
