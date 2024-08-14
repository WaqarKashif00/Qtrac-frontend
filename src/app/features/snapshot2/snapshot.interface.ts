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

export interface AgentService {
  servicesPerformed: number;
  agentId: string;
  serviceId: string;
}

export interface AgentTicket {
  agentId: string;
  count: number;
}

export interface AgentServiceData {
  agentServices: AgentService[];
  agentTickets: AgentTicket[];
}

export interface ServiceDepth {
  length: number;
  timePeriod: Date;
}

export interface ServicesDepth {
  serviceId: string;
  serviceDepth: ServiceDepth[];
}

export interface NumberingRule {
  prefix: string;
  middlefix: string;
  postfix: string;
}

export interface QueueWait {
  length: number;
  timePeriod: Date;
}

export interface QueueData {
  id: string;
  name: string;
  numberingRule: NumberingRule;
  queueWait: QueueWait[];
  isDeleted?: boolean;
}

export interface AppointmentCount {
  requestTimeUTC: number;
  isAppointment: boolean;
  customerState: string;
}

export interface SnapShotRedux {
  agentServiceData: AgentServiceData;
  servicesDepth: ServicesDepth[];
  queueData: QueueData[];
  appointmentCount: AppointmentCount[];
  waitMetrics: any[][];
  serviceMetrics: any[][];
}
export interface LiveBranchData {
  liveActiveCount$: any;
  liveQueueCount: {length: number, timePeriod: string}[]
  liveWaitTime: {length: number, timePeriod: string}[]
  liveServingCount: {servingNow: number}[]
  liveAbandonCount: { abandon: number, time: string}[]
  liveNoShowCount: {noShow: number, time: string}[]
  liveActiveCount:  {activeNow: number}[]
  liveServedCount: { length: number, timePeriod:string}[]
}


