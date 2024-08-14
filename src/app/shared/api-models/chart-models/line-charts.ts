export class ChartTooltip{
    isTooltipVisible:boolean;
    TooltipDefault?:boolean=true;
    TooltipValueFirst?:boolean;
    TooltipNameOnly?:boolean;
    TooltipValueOnly?:boolean;
}

export interface IChartLegend{
    position:string;
    orientation:string;
    isVisible:boolean
}

export interface IChartXAxis{
    data:string[] | number [];
    title:string
}

export class ChartYAxis{
    data:any[];
    legendTitle:string;
    visible:boolean = true;
    style?: ILineStyle
}

export class ILineStyle{
    lineStyle:string;
    colorStyle:string;
}
export enum LegendOrientation{
    vertical = "vertical",
    horizontal = "horizontal"
}

export enum LegendPosition{
    top = "top",
    bottom = "bottom",
    left = "left",
    right = "right"
}

export enum LineChartStyle{
    normal = "normal",
    smooth = "smooth",
    step = "step",
} 

export enum LineDashStyle{
    dash="dash"
}

export enum BaseLineStyle{
    line="line",
    dashed="dashed"
}

export const defaultChart = "column" 
