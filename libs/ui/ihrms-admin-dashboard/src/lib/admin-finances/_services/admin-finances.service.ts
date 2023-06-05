import { Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class AdminFinancesService {

  getGridsterOptions(cardSize: number, _this: any, gridType?: any) {
    return {
      fixedRowHeight: cardSize,
      gridType: gridType !== 'scroll'? GridType.Fit: GridType.VerticalFixed,
      compactType: CompactType.CompactUp,
      draggable: { enabled: false },
      resizable: {
        enabled: true
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      useTransformPositioning: true,
      displayGrid: DisplayGrid.None,
      itemChangeCallback: (item: GridsterItem) => {
        // update DB with new size
      },
      itemResizeCallback: (item: GridsterItem) => {
        // update DB with new size
      },
      initCallback: (GridsterComponent: any) => {
        setTimeout( (_: any) => _this.gridResize.next(true), 500); // Sometimes Buggy
      }
    };
  }

}

export const GQL_SALARY = gql`
  query result(
    $query: Pagination!
  ) {
    getSalary(
      query: $query
    ) {
      _id
      eCode
      month
      username
      effectiveDate
      salaryStructure
      salaryStructureId
      departmentId
      department {
       name
      }
      payHeads {
        _id
        name
        value
        payhead_type
        calculationType
       }
      CTC
      audit {
        created_at
      }
    }
  }
`;

export const GQL_SALARY_REVISIONS = gql`
  query GetSalaryRevisions($query: Pagination!) {
    getSalaryRevisions(query: $query) {
      _id
      CTC
      department {
        name
      }
      eCode
      effectiveDate
      month
      payHeads {
        _id
        name
        payhead_type
        calculationType
        value
      }
      salaryStructure
      username
    }
  }
`;

export const GQL_DAYS_WISE_SALARY = gql`
  query result(
    $query: AttendanceSheetInput!
  ) {
    getCalculateSalarydayWise(query: $query)
  }
`;

export const GQL_CREATE_PAYROLL = gql`
  mutation CreatePayroll(
    $month: ISODate,
    $payrolls: [PayrollsInputs], 
    $payrollInputs: PayrollInputsInputs
  ) {
    createPayroll(
      month: $month,
      payrolls: $payrolls, 
      payrollInputs: $payrollInputs
    ) {
      _id
      month
      payrollInputs {
        empViewRelease
        payInputs
        payrollProcess
        statementView
      }
      payrolls {
        salaryId
        status
        month
        day_diff
        eCode
        totalDaysAbsent
        totalDaysPresent
        total_pay_heads_salary
        Earnings_for_Employee
        Employees_Statutory_Deductions
        Employers_Statutory_Contributions
        Security_Deposit
        companyDaysOFF
        overtime
        total_overtime
        total_overtime_done_by_user
        user_overtime
        user_range_salary
        user_salary
        username
      }
      audit {
        created_at
        modified_at
      }
    }
  }
`;

export const GQL_DELETE_PAYROLL = gql`
  mutation DeletePayroll(
    $_id: ID,
    $month: ISODate, 
    $payrolls: [PayrollsInputs], 
    $payrollInputs: PayrollInputsInputs
  ) {
    deletePayroll(
      _id: $_id,
      month: $month,
      payrolls: $payrolls, 
      payrollInputs: $payrollInputs
    ) {
      _id
    }
  }
`;


export const GQL_EDIT_PAYROLL = gql`
  mutation EditPayroll(
    $month: ISODate, 
    $payrolls: [PayrollsInputs], 
    $payrollInputs: PayrollInputsInputs
  ) {
    editPayroll(
      month: $month, 
      payrolls: $payrolls, 
      payrollInputs: $payrollInputs
    ) {
      audit {
        created_at
        modified_at
      }
      month
      payrollInputs {
        empViewRelease
        payInputs
        payrollProcess
        statementView
      }
      payrolls {
        salaryId
        status
        month
        eCode
        day_diff
        totalDaysAbsent
        totalDaysPresent
        total_pay_heads_salary
        Earnings_for_Employee
        Employees_Statutory_Deductions
        Employers_Statutory_Contributions
        Security_Deposit
        companyDaysOFF
        overtime
        user_overtime
        total_overtime
        total_overtime_done_by_user
        user_range_salary
        user_salary
        username
      }
    }
  }
`;

export const GQL_GET_PAYROLL = gql`
  query Query($query: Pagination!) {
    getPayroll(query: $query) {
      month
      payrollInputs {
        empViewRelease
        payInputs
        payrollProcess
        statementView
      }
      payrolls {
        month
        status
        salaryId
        day_diff
        eCode
        totalDaysAbsent
        totalDaysPresent
        total_pay_heads_salary
        Earnings_for_Employee
        Employees_Statutory_Deductions
        Employers_Statutory_Contributions
        Security_Deposit
        companyDaysOFF
        overtime
        total_overtime_done_by_user
        user_overtime
        total_overtime
        user_range_salary
        user_salary
        username
      }
      _id
      audit {
        created_at
        modified_at
      }
    }
  }
`;


export const GQL_GET_MONTHLY_OVERTIME = gql`
  query Query($query: AttendanceSheetInput!) {
    getOvertimeMonthWise(query: $query)
  }
`;

export const GQL_GET_SALARY_SLIP_DETAILS = gql`
  query result(
    $query: AttendanceSheetInput!
  ) {
    getUserSalarySlip(query: $query)
  }
`;
