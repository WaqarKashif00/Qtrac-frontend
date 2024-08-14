import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { AbstractComponentService } from "src/app/base/abstract-component-service";
import { ChartTooltip, ChartYAxis, defaultChart, IChartLegend, IChartXAxis, LegendOrientation, LegendPosition, LineChartStyle } from "src/app/shared/api-models/chart-models/line-charts";
import { ReportingHeaderType, SnapshotName, SnapshotTypeConstants } from "../../../constants/type-constant";
import { ChartData, ISnapshotConfiguration, ISnapshotGraphElement } from "../../../snapshot.interface";

@Injectable()
export class ContentListService extends AbstractComponentService {
    constructor() {
        super();
    }

    GenerateGraphData(chartElements: ISnapshotGraphElement[],level:number=0, chart?:any) {
        if(level>0){
            level ++;
        }
        return chartElements?.map<ChartData>((res,index) => {

            let yHeader: ChartYAxis[] = []
            res?.reportData?.yheaders?.forEach(yh => {
                yHeader.push({
                    data: [],
                    visible: true,
                    legendTitle: yh.header
                });
            });

            res?.reportData?.ydata?.forEach((yd, index) => {
                yHeader[index].data = yd;
            });

            res?.reportData?.ystyles?.forEach((ystyle, index) => {
                yHeader[index].style = ystyle;
            });

            return {
                chartLegend: this.GetDefaultChartLegend(),
                chartTitle: res?.data?.name,
                chartType: res?.data?.chart?.name ? res?.data?.chart?.name : (chart? chart.name  : defaultChart),
                chartTooltip: this.GetDefaultChartToolTip(),
                xData: this.GetXData(res),
                xDataOneDimensional : this.GetXDataOneDimensional(res),
                yData: yHeader,
                style: LineChartStyle.smooth,
                nestedChart : (res.elements && res.elements[0]) ? this.GenerateGraphData(res.elements, level, res?.data?.chart ? res?.data?.chart: (chart ? chart : null)) : [],
                isOneDimensional : res?.reportData?.oneDimensional,
                level:level,
                isCollapsed : false
            }
        })
    }

    GetXDataOneDimensional(res: ISnapshotGraphElement) {
        let xData= []
        if(res?.reportData?.oneDimensional){
            res.reportData.xheaders.forEach(xh=>{
                xData.push({
                    xHeader:xh.header
                });
            })
    
            res.reportData.xdata.forEach((xd,index)=>{
                xData[index].data = (xd % 1 != 0) ? xd?.toFixed(2) : xd; 
            });
    
            res.reportData.sparkline.forEach((sl,index)=>{
                xData[index].sparkline = sl;
            });
    
            res.reportData.trending.forEach((tr,index)=>{
                xData[index].trending = tr
            });
        }
        return xData;
    }

    private GetXData(res: ISnapshotGraphElement): IChartXAxis {
        if(!res?.reportData?.oneDimensional){
            return {
                data: res?.reportData?.xheaders?.map<string>(xh => {
                    if (xh.reportingHeaderType == ReportingHeaderType.Date) {
                        return new DatePipe("en-US").transform(new Date(xh.header).toString(), xh.format);
                    }
                    return xh.header;
                }),
                title: null
            };
        }
        
    }

    GetDataByType(Configurations: ISnapshotConfiguration, type: string) {
        let GranuleNameList = ""
        Configurations?.granuleTypes?.find(x => x?.type == type)?.granules?.forEach(x => {
            if (x?.isSelected) {
                if (GranuleNameList) {
                    GranuleNameList = GranuleNameList + ", " + ((x.type == SnapshotTypeConstants.company) ? SnapshotName.company : x?.name)
                } else {
                    GranuleNameList = (x.type == SnapshotTypeConstants.company) ? SnapshotName.company : x?.name;
                }
            }
        })
        return GranuleNameList
    }

    GetDefaultChartLegend() {
        let chartLegend: IChartLegend = {
            isVisible: true,
            orientation: LegendOrientation.vertical,
            position: LegendPosition.left
        }
        return chartLegend;
    }

    GetDefaultChartToolTip() {
        let chartTooltip: ChartTooltip = {
            isTooltipVisible: true,
            TooltipDefault: true
        }
        return chartTooltip;
    }
}
