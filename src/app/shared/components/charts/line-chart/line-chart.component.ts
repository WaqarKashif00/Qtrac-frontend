import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { AbstractComponent } from "src/app/base/abstract-component";
import { BaseLineStyle, ChartTooltip, ChartYAxis, IChartLegend, IChartXAxis, LineChartStyle, LineDashStyle } from "src/app/shared/api-models/chart-models/line-charts";

@Component({
    selector: 'lavi-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent extends AbstractComponent {
    
    @Input() Title: string
    @Input() TooltipData: ChartTooltip;
    @Input() ChartType:string;
    @Input() LegendData: IChartLegend;
    @Input() XAxisData: IChartXAxis;
    @Input() YAxisData: ChartYAxis[]
    @Input() Style: string = LineChartStyle.normal
    @Input() Level:number = 0;
    constructor() {
        super();
    }

    tooltipText(name: string, value: string): string {
        if (this.TooltipData?.TooltipDefault) {
            return this.Title + " : " + value + " (" + name + ")";
        }
        if (this.TooltipData?.TooltipNameOnly) {
            return name;
        }
        if (this.TooltipData.TooltipValueOnly) {
            return value;
        }
        if (this.TooltipData?.TooltipValueFirst) {
            return value + ' : ' + name
        }
    }

    YChartType(yData:ChartYAxis){
        return yData?.style?.lineStyle ? (yData?.style?.lineStyle == BaseLineStyle.dashed ? BaseLineStyle.line : yData?.style?.lineStyle) : this.ChartType
    }

    YChartColor(yData:ChartYAxis){
        return yData?.style?.colorStyle ? yData?.style?.colorStyle : null
    }

    YChartDash(yData:ChartYAxis){
        return yData?.style?.lineStyle == BaseLineStyle.dashed ? LineDashStyle.dash : null
    }
}