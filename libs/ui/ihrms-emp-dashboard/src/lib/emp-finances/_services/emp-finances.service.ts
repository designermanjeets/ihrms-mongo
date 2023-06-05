import { Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class EmpFinancesService {

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
