import { Injectable } from '@angular/core';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { gql } from 'apollo-angular';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalarySettingsService {

  getPayHeadControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Pay Head Information',
        order: 0,
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
        key: 'name',
        label: 'Pay Head',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'namePayslip',
        label: 'Name On Payslip',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'payhead_type',
        label: 'Pay Head Type',
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Earnings for Employees', value: 'Earnings for Employees' },
          { key: 'Loans and Advances (Assets)', value: 'Loans and Advances (Assets)' },
          { key: 'Reimbursement', value: 'Reimbursement' },
          { key: 'Gratuity', value: 'Gratuity' },
          { key: 'Employers Statutory Contributions', value: 'Employers Statutory Contributions' },
          { key: 'Employees Statutory Deductions', value: 'Employees Statutory Deductions' },
          { key: 'Employers Other Charges', value: 'Employers Other Charges' },
          { key: 'Security Deposit', value: 'Security Deposit' },
        ]
      },
      {
        key: 'stattutoryPaytype',
        label: 'Statutory Pay Type',
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'PF Account (A/c No. 1)', value: 'PF Account (A/c No. 1)' },
          { key: 'Indirect Expenses', value: 'Indirect Expenses' },
          { key: 'EDLI Contribution (A/c No. 21)', value: 'EDLI Contribution (A/c No. 21)' },
          { key: 'Reimbursement to Employees', value: 'Reimbursement to Employees' },
        ]
      },
      {
        key: 'underAccountGroup',
        label: 'Under Acc/Group',
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Current Liabilities', value: 'Current Liabilities' },
          { key: 'Direct Expenses', value: 'Direct Expenses' },
          { key: 'Indirect Expenses', value: 'Indirect Expenses' },
          { key: 'Provisions', value: 'Provisions' },
        ]
      },
      {
        key: 'affectNetSalary',
        label: 'Affect Net Salary',
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: true, value: 'Yes' },
          { key: false, value: 'No' },
        ]
      },
      {
        key: 'currencyOfLedger',
        label: 'Currency Of Ledger',
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'R', value: 'R' },
          { key: '$', value: '$' },
        ]
      },
      {
        key: 'calculationPeroid',
        label: 'Calculation Period',
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Months', value: 'Months' },
          { key: 'Weeks', value: 'Weeks' },
        ]
      },
      {
        key: 'calculationType',
        label: 'Calculation Type',
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'UserDefinedValue', value: 'User Defined Value' },
          { key: 'AsComputedValue', value: 'As Computed Value' },
        ]
      },
      {
        label: 'Computation Information',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: 'computedFormulaID',
        label: 'Compute Formula',
        order: 1,
        controlType: 'dropdown',
        options: [],
        addMoreOption: {
          text: '+ Add Formula',
        }
      },
      {
        key: 'effectiveFrom',
        label: 'Effective From',
        order: 1,
        controlType: 'datepicker'
      },
      {
        key: 'amountGreaterThan',
        label: 'Amount Greater Than',
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'amountUpto',
        label: 'Amount Up To',
        order: 1,
        controlType: 'textbox',
      },
      // {
      //   key: 'slabType',
      //   label: 'Slab Type',
      //   order: 1,
      //   controlType: 'dropdown',
      //   options: [
      //     { key: 'Percentage', value: 'Percentage' },
      //     { key: 'Fixed', value: 'Fixed' },
      //   ]
      // },
      // {
      //   key: 'slabValue',
      //   label: 'Slab Value',
      //   order: 1,
      //   controlType: 'textbox',
      // },
      {
        key: 'roundOff',
        label: 'Round Off',
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'NormalRound', value: 'NormalRound' },
        ]
      },
      {
        key: 'limit',
        label: 'Limit',
        order: 1,
        controlType: 'textbox',
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 49.5,
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getSalaryStructureControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Salary Structure Information',
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
        key: 'salaryStructure',
        label: 'Salary Structure',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'payHeadIDs',
        label: 'Pay Head',
        validators: {
          required: true,
        },
        order: 1,
        type: 'multiple',
        controlType: 'dropdown'
      },
      {
        key: 'printName',
        label: 'Print Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'effectiveFrom',
        label: 'Effective From',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'datepicker'
      },
      {
        key: 'calculatedOn',
        label: 'Calculated On',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Attendance', value: 'Attendance' },
        ]
      },
      {
        key: 'calculatedType',
        label: 'Calculation Type',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'Fixed', value: 'Fixed' },
        ]
      },
      {
        key: 'status',
        label: 'Status',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: true, value: 'Active' },
          { key: false, value: 'Inactive' }
        ],
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
      },
      {
        key: 'isCTC',
        label: 'CTC Component',
        order: 1,
        controlType: 'checkbox',
        value: false
      },
      {
        key: 'isESI',
        label: 'ESI Component',
        order: 1,
        controlType: 'checkbox',
        value: false
      },
      {
        key: 'isPF',
        label: 'PF Component',
        order: 1,
        controlType: 'checkbox',
        value: false
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getPayScheduleControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Calculation',
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
        key: 'calculateMonthlySalaryBasedUpon',
        label: 'Calculate monthly salary based on',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'actualMonthDays', value: 'Actual days in a month' },
          { key: 'organisationDays', value: 'Organisation working days per Month' },
        ]
      },
      {
        key: 'organisationWorkingDays',
        label: 'Organisation working days',
        order: 1,
        controlType: 'hidden',
        options: [
          { key: '20', value: '20' },
          { key: '21', value: '21' },
          { key: '22', value: '22' },
          { key: '23', value: '23' },
          { key: '24', value: '24' },
          { key: '25', value: '25' },
          { key: '26', value: '26' },
          { key: '27', value: '27' },
          { key: '28', value: '28' },
          { key: '29', value: '29' },
          { key: '30', value: '30' },
        ]
      },
      {
        label: 'Schedule',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: 'employeePayDay',
        label: 'Pay your employees on*',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'first', value: 'The first working day of every month' },
          { key: 'last', value: 'The last working day of every month' },
          { key: 'other', value: 'Other Day' },
        ]
      },
      {
        key: 'employeePayDayOther',
        label: 'Other Pay Day',
        order: 1,
        controlType: 'hidden',
        options: [
          { key: '7', value: '7' },
          { key: '15', value: '15' },
          { key: '20', value: '20' },
        ]
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getPayEmployeeSalarySettingControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Employee Salary Setting',
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
        key: 'department',
        label: 'Department',
        order: 1,
        controlType: 'dropdown',
        options: []
      },
      {
        key: 'userID',
        label: 'User',
        order: 1,
        controlType: 'dropdown',
        options: []
      },
      {
        key: 'salary_structure',
        label: 'Salary Structure',
        order: 1,
        controlType: 'dropdown',
        options: []
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

}

export const GQL_PAYHEADS = gql`
  query getPayHeads(
    $query: Pagination!
  ) {
    getPayHeads(
      query: $query
    ) {
        _id
        affectNetSalary
        amountGreaterThan
        amountUpto
        calculationPeroid
        calculationType
        comments
        computedFormula {
          _id
          name
          formula
        }
        currencyOfLedger
        effectiveFrom
        limit
        name
        namePayslip
        roundOff
        slabType
        slabValue
        stattutoryPaytype
        status
        payhead_type
        underAccountGroup
        audit {
          created_at
        }
      }
    }
`;

export const GQL_EDIT_PAYHEAD = gql`
  mutation editPayHead(
      $id: ID!, 
      $name: String, 
      $namePayslip: String!, 
      $payhead_type: String, 
      $stattutoryPaytype: String, 
      $underAccountGroup: String, 
      $affectNetSalary: Boolean, 
      $currencyOfLedger: String, 
      $calculationType: String, 
      $calculationPeroid: String, 
      $computedFormulaID: ID, 
      $effectiveFrom: ISODate, 
      $amountGreaterThan: String, 
      $amountUpto: String, 
      $slabType: String, 
      $slabValue: String, 
      $roundOff: String, 
      $limit: String, 
      $status: Boolean, 
      $comments: String, 
      $tenantid: ID
    ) {
    editPayHead(
      _id: $id
      name: $name, 
      namePayslip: $namePayslip, 
      payhead_type: $payhead_type, 
      stattutoryPaytype: $stattutoryPaytype, 
      underAccountGroup: $underAccountGroup, 
      affectNetSalary: $affectNetSalary, 
      currencyOfLedger: $currencyOfLedger, 
      calculationType: $calculationType, 
      calculationPeroid: $calculationPeroid, 
      computedFormulaID: $computedFormulaID, 
      effectiveFrom: $effectiveFrom, 
      amountGreaterThan: $amountGreaterThan, 
      amountUpto: $amountUpto, 
      slabType: $slabType, 
      slabValue: $slabValue, 
      roundOff: $roundOff, 
      limit: $limit, 
      status: $status, 
      comments: $comments, 
      tenantid: $tenantid
    ) {
        _id
        name
        namePayslip
        payhead_type
        stattutoryPaytype
        underAccountGroup
        affectNetSalary
        currencyOfLedger
        calculationType
        calculationPeroid
        computedFormula {
          _id
          name
        }
        effectiveFrom
        amountGreaterThan
        amountUpto
        slabType
        slabValue
        roundOff
        limit
        status
        comments
        tenantid
      }
    }
`;

export const GQL_ADD_PAYHEAD = gql`
  mutation createPayHead(
      $name: String!, 
      $namePayslip: String!, 
      $payhead_type: String, 
      $stattutoryPaytype: String, 
      $underAccountGroup: String, 
      $affectNetSalary: Boolean, 
      $currencyOfLedger: String, 
      $calculationType: String, 
      $calculationPeroid: String, 
      $computedFormulaID: ID, 
      $effectiveFrom: ISODate, 
      $amountGreaterThan: String, 
      $amountUpto: String, 
      $slabType: String, 
      $slabValue: String, 
      $roundOff: String, 
      $limit: String, 
      $status: Boolean, 
      $comments: String, 
      $tenantid: ID
  ) {
    createPayHead(
      name: $name, 
      namePayslip: $namePayslip, 
      payhead_type: $payhead_type, 
      stattutoryPaytype: $stattutoryPaytype, 
      underAccountGroup: $underAccountGroup, 
      affectNetSalary: $affectNetSalary, 
      currencyOfLedger: $currencyOfLedger, 
      calculationType: $calculationType, 
      calculationPeroid: $calculationPeroid, 
      computedFormulaID: $computedFormulaID, 
      effectiveFrom: $effectiveFrom, 
      amountGreaterThan: $amountGreaterThan, 
      amountUpto: $amountUpto, 
      slabType: $slabType, 
      slabValue: $slabValue, 
      roundOff: $roundOff, 
      limit: $limit, 
      status: $status, 
      comments: $comments, 
      tenantid: $tenantid
    ) {
      name
      namePayslip
      payhead_type
      stattutoryPaytype
      underAccountGroup
      affectNetSalary
      currencyOfLedger
      calculationType
      calculationPeroid
      computedFormula {
        _id
        name
      }
      effectiveFrom
      amountGreaterThan
      amountUpto
      slabType
      slabValue
      roundOff
      limit
      status
      comments
      tenantid
    }
  }
`;

export const GQL_PAYFORMULAS = gql`
  query GetPayFormulas($query: Pagination!) {
    getPayFormulas(query: $query) {
      formula
      name
      _id
      status
    }
  }
`;

export const GQL_PAYFORMULAS_CREATE = gql`
  mutation CreatePayFormula($name: String!, $formula: String!) {
    createPayFormula(name: $name, formula: $formula) {
      _id
      name
      formula
    }
  }
`;

export const GQL_PAYFORMULAS_UPDATE = gql`
  mutation UpdatePayFormula($id: ID!, $name: String!, $formula: String!) {
    editPayFormula(_id: $id, name: $name, formula: $formula) {
      _id
      name
      formula
    }
  }
`;

export const GQL_PAYSTRUCTURE = gql`
  query GetPayStructures($query: Pagination!) {
    getPayStructures(query: $query) {
      _id
      calculatedOn
      calculatedType
      effectiveFrom
      isCTC
      isESI
      isPF
      payHeadIDs
      payHeads {
        _id
        name
        calculationType
        computedFormula {
          formula
          name
        }
        payhead_type
        calculationType
      }
      printName
      salaryStructure
      status
      audit {
        created_at
      }
    }
  }
`;

export const GQL_PAYSTRUCTURE_CREATE = gql`
  mutation CreatePayStructure(
      $salaryStructure: String!, 
      $payHeadIDs: [ID], 
      $printName: String, 
      $effectiveFrom: ISODate, 
      $calculatedOn: String, 
      $calculatedType: String, 
      $isCTC: Boolean, 
      $isESI: Boolean, 
      $isPF: Boolean, 
      $status: Boolean
    ) {
    createPayStructure(
      salaryStructure: $salaryStructure, 
      payHeadIDs: $payHeadIDs, 
      printName: $printName, 
      effectiveFrom: $effectiveFrom, 
      calculatedOn: $calculatedOn, 
      calculatedType: $calculatedType, 
      isCTC: $isCTC, 
      isESI: $isESI, 
      isPF: $isPF, 
      status: $status
    ) {
      _id
      calculatedOn
      calculatedType
      effectiveFrom
      isCTC
      isESI
      isPF
      payHeadIDs
      payHeads {
        _id
        name
        payhead_type
      }
      printName
      salaryStructure
      status
      audit {
        created_at
      }
    }
  }
`;

export const GQL_PAYSTRUCTURE_UPDATE = gql`
  mutation EditPayStructure(
      $id: ID!,
      $salaryStructure: String!, 
      $payHeadIDs: [ID],
      $printName: String, 
      $effectiveFrom: ISODate, 
      $calculatedOn: String, 
      $calculatedType: String, 
      $isCTC: Boolean, 
      $isESI: Boolean, 
      $isPF: Boolean, 
      $status: Boolean
    ) {
    editPayStructure(
      _id: $id,
      salaryStructure: $salaryStructure,  
      payHeadIDs: $payHeadIDs, 
      printName: $printName, 
      effectiveFrom: $effectiveFrom, 
      calculatedOn: $calculatedOn, 
      calculatedType: $calculatedType,
      isCTC: $isCTC, 
      isESI: $isESI, 
      isPF: $isPF, 
      status: $status
    ) {
      _id
      calculatedOn
      calculatedType
      effectiveFrom
      isCTC
      isESI
      isPF
      payHeadIDs
      payHeads {
        _id
        name
        payhead_type
      }
      printName
      salaryStructure
      status
      audit {
        created_at
      }
    }
  }
`;

export const GQL_PAYSCHEDULES = gql`
  query GetPaySchedules($query: Pagination!) {
    getPaySchedules(query: $query) {
      _id
      calculateMonthlySalaryBasedUpon
      employeePayDay
      employeePayDayOther
      organisationWorkingDays
      status
    }
  }
`;

export const GQL_PAYSCHEDULES_CREATE = gql`
  mutation CreatePaySchedule(
    $calculateMonthlySalaryBasedUpon: String!, 
    $organisationWorkingDays: String, 
    $employeePayDay: String!, 
    $employeePayDayOther: String
  ) {
    createPaySchedule(
      calculateMonthlySalaryBasedUpon: $calculateMonthlySalaryBasedUpon, 
      organisationWorkingDays: $organisationWorkingDays, 
      employeePayDay: $employeePayDay, 
      employeePayDayOther: $employeePayDayOther
    ) {
      _id
      calculateMonthlySalaryBasedUpon
      employeePayDay
      employeePayDayOther
      organisationWorkingDays
      status
      audit {
        created_at
      }
    }
  }
`;

export const GQL_PAYSCHEDULES_UPDATE = gql`
  mutation EditPaySchedule(
    $id: ID!, 
    $calculateMonthlySalaryBasedUpon: String!, 
    $organisationWorkingDays: String, 
    $employeePayDay: String!, 
    $employeePayDayOther: String
  ) {
    editPaySchedule(
      _id: $id, 
      calculateMonthlySalaryBasedUpon: $calculateMonthlySalaryBasedUpon, 
      organisationWorkingDays: $organisationWorkingDays, 
      employeePayDay: $employeePayDay, 
      employeePayDayOther: $employeePayDayOther
    ) {
      _id
      calculateMonthlySalaryBasedUpon
      employeePayDay
      employeePayDayOther
      organisationWorkingDays
      status
      audit {
        created_at
      }
    }
  }
`;

export const GQL_EMPLOYEE_PAY_CALCULATE = gql`
  mutation CalculatePayStructure($input: CalculatedPayStructureInput!) {
    calculatePayStructure(input: $input) {
      _id
      username
      eCode
      salaryStructure
      calculatedPayHeads {
        _id
        name
        calculatedValue
      }
    }
  }
`;

export const GQL_SALARY_CREATE = gql`
  mutation createSalary (
    $eCode: String!
    $effectiveDate: ISODate!
    $month: ISODate
    $salaryStructure: String
    $departmentId: ID
    $salaryStructureId: ID
    $CTC: Int
    ) {
      createSalary(
        eCode: $eCode, 
        effectiveDate: $effectiveDate, 
        month: $month, 
        salaryStructure: $salaryStructure, 
        departmentId: $departmentId,
        salaryStructureId: $salaryStructureId
        CTC: $CTC,
    ) {
      _id
      effectiveDate
      month
      CTC
      departmentId
      salaryStructure
      salaryStructureId
      Department {
        name
      }
      audit {
        created_at
      }
    }
  }
`;

export const GQL_EDIT_SALARY = gql`
  mutation editSalary (
    $_id: ID
    $eCode: String
    $effectiveDate: ISODate
    $month: ISODate
    $salaryStructureId: ID
    $departmentId: ID
    $salaryStructure: String
    $payHeads: [SalaryPayHeadInputs]
    $CTC: Int
    ) {
      editSalary(
        _id: $_id
        eCode: $eCode, 
        effectiveDate: $effectiveDate, 
        month: $month,
        salaryStructure: $salaryStructure,
        salaryStructureId: $salaryStructureId, 
        departmentId: $departmentId,
        payHeads: $payHeads,
        CTC: $CTC,
    ) {
      _id
      eCode
      effectiveDate
      month
      CTC
      departmentId
      salaryStructureId
      audit {
        created_at
      }
    }
  }
`;


export const GQL_SALARY_REVISIONS = gql`
  mutation createSalaryRevisons (
    $_id: ID
    $eCode: String
    $effectiveDate: ISODate
    $month: ISODate
    $salaryStructureId: ID
    $departmentId: ID
    $salaryStructure: String
    $payHeads: [SalaryPayHeadInputs]
    $CTC: Int
    ) {
      createSalaryRevisons(
        _id: $_id
        eCode: $eCode, 
        effectiveDate: $effectiveDate, 
        month: $month,
        salaryStructure: $salaryStructure,
        salaryStructureId: $salaryStructureId, 
        departmentId: $departmentId,
        payHeads: $payHeads,
        CTC: $CTC,
    ) {
      _id
      eCode
      effectiveDate
      month
      CTC
      departmentId
      salaryStructureId
      audit {
        created_at
      }
    }
  }
`;

export const GQL_UPLOAD_EMPLOYEE_SALARY_DETAILS = gql`
mutation InsertManyMutation(
  $input: Void!
) {
  insertManySalaryUsers(input: $input)
}
`;
