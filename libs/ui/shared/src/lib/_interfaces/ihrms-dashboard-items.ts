import { GridsterItem, GridsterItemComponentInterface } from 'angular-gridster2';
import { Subject } from 'rxjs';

export interface IhrmsDashboardItem {
    dynamicComponent: any;
    gridsterItem: { cols: number, rows: number, y: number, x: number },
    x?: number;
    y?: number;
    rows?: number;
    cols?: number;
    layerIndex?: number;
    initCallback?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void;
    dragEnabled?: boolean;
    resizeEnabled?: boolean;
    compactEnabled?: boolean;
    maxItemRows?: number;
    minItemRows?: number;
    maxItemCols?: number;
    minItemCols?: number;
    minItemArea?: number;
    maxItemArea?: number;
    flatItem?: boolean;
    gridComponentFullHeight?: boolean;
    inputs: {
        compData?: any;
        cardRadius?: number;
        title?: string;
        filters?: boolean,
        viewAll?: boolean,
        filterConfig?: {
            filterForm?: boolean;
            addButton?: boolean;
            addButtonText?: string;
            uploadButton?: boolean;
            uploadText?: string;
            show_Export_Button?: boolean;
            uploadSample?: { text: string, url: string };
            managerMapping?: boolean
        };
        columnDefs?: any[],
        rowData?: any[],
        flatItem?: boolean,
        gridComponentFullHeight?: boolean;
        updateMultiChart?: Subject<any>
        updateGridFromOutside?: Subject<any>,
        isMobileFullHeight?: boolean
    };
    outputs: {
        onClickHandler?: { handler: any, args: any };
        onGridReadyOut?: { handler: any, args: any };
    };
}