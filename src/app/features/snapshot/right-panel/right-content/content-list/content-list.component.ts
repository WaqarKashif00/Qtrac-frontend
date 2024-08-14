import { Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { GraphArrow, GraphArrowType } from '../../../constants/graph-constant';
import { SnapshotTypeConstants } from '../../../constants/type-constant';
import { ChartData, ISnapshotConfiguration, ISnapshotGraphResponse } from '../../../snapshot.interface';
import { ContentListService } from './content-list.service';

@Component({
  selector: 'lavi-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss'],
  providers: [ContentListService]

})
export class ContentListComponent extends AbstractComponent {

  @Input() IsEditing: boolean;
  @Input() Configurations: ISnapshotConfiguration;
  @Input() SnapshotGraph: ISnapshotGraphResponse
  GraphData: ChartData[] = [];
  Tags: string;
  Scopes: string;
  DataView: string;
  TimePeriod: string;
  Locations: string;
  arrowType = GraphArrowType;
  get GraphContext(){
    return {
      graphItems:this.GraphData
    };
  }

  constructor(private service: ContentListService) {
    super();
  }

  ngOnChanges(changes) {
    if (changes?.SnapshotGraph?.currentValue) {
      this.GraphData = this.GenerateGraphData(changes?.SnapshotGraph?.currentValue);
    }
    if (changes?.Configurations?.currentValue) {
      this.Tags = this.GetDataByType(changes?.Configurations?.currentValue, SnapshotTypeConstants.tag);
      this.Scopes = this.GetDataByType(changes?.Configurations?.currentValue, SnapshotTypeConstants.scope);
      this.DataView = this.GetDataByType(changes?.Configurations?.currentValue, SnapshotTypeConstants.dataview);
      this.TimePeriod = this.GetDataByType(changes?.Configurations?.currentValue, SnapshotTypeConstants.timeperiod);
      this.Locations = this.GetDataByType(changes?.Configurations?.currentValue,SnapshotTypeConstants.location)
    }
  }

  GenerateGraphData(graphResponse: ISnapshotGraphResponse) {
    return this.service.GenerateGraphData(graphResponse?.elements)
  }

  GetDataByType(Configurations: ISnapshotConfiguration, type: string) {
    return this.service.GetDataByType(Configurations, type);
  }

  GraphContextMain(graph:any){
    return {
      graphItems:graph?.nestedChart
    };
  }

  GraphContextData(graph:any){
    return {
      graph: graph,
      level:graph?.level
    }
  }

  GraphTitleContext(graph:any){
    return {
      title:graph?.chartTitle,
      level:graph?.level,
      graph:graph
    }
  }

  ExpandAndCollapse(graph:any){
    graph.isCollapsed = !graph.isCollapsed;
  }

  OneDimensionalGraphContext(graph:any){
    return{
      graph:graph?.xDataOneDimensional,
      level:graph?.level
    }
  }

  GetArrowCode(key:string){
    return GraphArrow?.find(x=>x.key==key)?.value
  }
}
