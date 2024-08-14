import { ChartTooltip, ChartYAxis, IChartLegend, IChartXAxis, ILineStyle } from "src/app/shared/api-models/chart-models/line-charts";

export interface IGranules {
    id: string;
    type: string;
    name: string;
    selections?: IGranules[],
    chart?:IGranules
    baselines?: IBaseline[]
}

export interface IGranulesSelected {
    id: string;
    type: string;
    name: string;
    granules: IGranulesSelected[]
    isSelected: boolean
}

export interface IKpiGranulesSelected extends IGranulesSelected {
    selections: IGranulesSelected[];
    baselines: IBaselineKPI[];
}

export interface ISnapshotConfiguration {
    granuleTypes: IGranulesSelected[],
    kpis: IKpiGranulesSelected[]
}

export interface IGranulesState {
    item: IGranulesSelected;
    value: boolean;
    parentId?: string;
    isInstantSave?: boolean,
    isParentItself?: boolean,
    baseline?: IBaselineKPI
}

export interface ISnapshotStateRequest {
    companyId: string;
    name: string,
    selections: IGranules[]
}

export interface ISnapshotStateResponse {
    id: string;
    pk: string;
    type: string;
    companyId: string;
    name: string,
    selections: IGranules[]
}

export interface IBaseline {
    id: string;
    name: string;
    value: number;
    style: string;
    color: string;
}

export interface IBaselineKPI {
    id: string;
    name: string;
    value: number;
    style: IGranulesSelected[];
    color: IGranulesSelected[];
}

export interface ISnapshotGraphResponse {
    elements: ISnapshotGraphElement[]
}

export interface ISnapshotGraphElement {
    reportData: IGraphElementReportData;
    data: IGraphElementData
    elements: ISnapshotGraphElement[];
    displayId: string
}

export interface IGraphElementData {
    name: string;
    chart?:IGraphElementData;
}

export interface IGraphElementReportData {
    xheaders: IHeader[];
    yheaders?: IHeader[];
    ydata?: Array<any[]>;
    xdata?:Array<any>
    ystyles?: Array<ILineStyle>;
    oneDimensional: boolean;
    sparkline?:Array<any[]>;
    trending?:Array<string>
}

export interface IHeader {
    reportingHeaderType: string,
    header: string,
    format: string
}

export interface ChartData{
    chartTitle: string;
    chartType:string;
    chartTooltip:ChartTooltip;
    chartLegend: IChartLegend;
    xData:IChartXAxis;
    yData:ChartYAxis[];
    style:string;
    nestedChart? : ChartData[];
    isOneDimensional:boolean;
}