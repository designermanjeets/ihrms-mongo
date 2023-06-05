import { Injectable } from '@angular/core';
import { ControlBase } from '../_models/control.base';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class DynamicFormControlService {

  constructor(private formBuilder: FormBuilder) {}

  toFormGroup(controls: ControlBase<string>[] | any, dynamicControls: boolean) {
    const group: any = {};
    const newControls = controls[0].dynamicArr ? controls[0].dynamicArr: controls;

    for (const control of newControls) {
      const validatorsToAdd = [];
      if(control.validators) {
        for (const [key, value] of Object.entries(control.validators as ControlBase<string>)) {
          switch (key) {
            case 'min':
              validatorsToAdd.push(Validators.min(value));
              break;
            case 'max':
              validatorsToAdd.push(Validators.max(value));
              break;
            case 'required':
              if (value) {
                validatorsToAdd.push(Validators.required);
              }
              break;
            case 'requiredTrue':
              if (value) {
                validatorsToAdd.push(Validators.requiredTrue);
              }
              break;
            case 'email':
              if (value) {
                validatorsToAdd.push(Validators.email);
              }
              break;
            case 'minLength':
              validatorsToAdd.push(Validators.minLength(value));
              break;
            case 'maxLength':
              validatorsToAdd.push(Validators.maxLength(value));
              break;
            case 'pattern':
              validatorsToAdd.push(Validators.pattern(value));
              break;
            case 'nullValidator':
              if (value) {
                validatorsToAdd.push(Validators.nullValidator);
              }
              break;
            default:
              break;
          }
        }
      }
      control.key && (group[control.key] = new FormControl({ value: control.value != null ? control.value: '', disabled: control.disabled }, validatorsToAdd));
    }

    return !dynamicControls ?
            new FormGroup(group) :
            new FormGroup({
              'dynamicArr': this.formBuilder.array([new FormGroup(group)])
            });
  }

}
