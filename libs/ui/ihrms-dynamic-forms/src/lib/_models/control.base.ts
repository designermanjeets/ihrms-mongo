interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minDate?: any;
  maxDate?: any;
  minTime?: any;
  maxTime?: any;
  nullValidator?: boolean;
}

export class ControlBase<T> {
  value?: any | undefined;
  key?: string;
  label: string;
  required?: boolean;
  order: number;
  controlType: string;
  type?: string | undefined | any;
  placeholder?: string;
  buttonType?: string;
  fxFlex?: number | string | undefined;
  disabled?: boolean;
  protected?: boolean;
  options?: {key: string | number | boolean, value: string}[];
  config?: {key: string, value: string}[];
  marginTop?: number | string | undefined;
  marginRight?: number | string | undefined;
  marginRightAuto?: boolean | undefined;
  textAlign?: string | undefined;
  class?: string[];
  addMoreOption?: Record<string, unknown> | undefined;
  hint?: string;
  validators?: JsonFormValidators;

  constructor(options: {
    value?: any;
    key?: string;
    label?: string;
    required?: boolean;
    order?: number;
    controlType?: string;
    type?: string | undefined | any;
    placeholder?: string;
    buttonType?: string;
    fxFlex?: number | string | undefined;
    disabled?: boolean;
    protected?: boolean;
    options?: {key: string | number | boolean, value: string}[];
    config?: {key: string, value: string}[];
    marginTop?: number | string | undefined;
    marginRight?: number | string | undefined;
    marginRightAuto?: boolean | undefined;
    textAlign?: string | undefined;
    class?: string[];
    addMoreOption?: Record<string, unknown> | undefined;
    hint?: string;
    validators?: JsonFormValidators;
  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || 'text';
    this.buttonType = options.buttonType;
    this.placeholder = options.placeholder || '';
    this.fxFlex = options.fxFlex || undefined;
    this.disabled = options.disabled || false;
    this.protected = options.protected || false;
    this.options = options.options || [];
    this.config = options.config || [];
    this.marginTop = options.marginTop || undefined;
    this.marginRight = options.marginRight || undefined;
    this.marginRightAuto = options.marginRightAuto || undefined;
    this.textAlign = options.textAlign || undefined;
    this.class = options.class || undefined;
    this.hint = options.hint || undefined;
    this.addMoreOption = options.addMoreOption || undefined;
    this.validators = options.validators || undefined;
  }
}
