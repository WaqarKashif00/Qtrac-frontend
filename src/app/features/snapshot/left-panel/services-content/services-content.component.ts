import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { SnapshotTypeConstants } from '../../constants/type-constant';
import { IGranulesSelected, IGranulesState, ISnapshotConfiguration } from '../../snapshot.interface';
import { SnapshotService } from '../../snapshot.service';

@Component({
  selector: 'lavi-services-content',
  templateUrl: './services-content.component.html',
  styleUrls: ['./services-content.component.scss', './../left-panel.component.scss', './../../snapshot.component.scss']
})
export class ServicesContentComponent extends AbstractComponent {

  @Input() Configurations: ISnapshotConfiguration;
  @Output() CheckboxChanged: EventEmitter<IGranulesState> = new EventEmitter();
  WorkflowParentId :string = null;
  workflows = [];
  IsEditing$: Observable<boolean>;

  constructor(private snapshotService : SnapshotService) {
    super();
    this.IsEditing$ = snapshotService.IsEditing$;
  }

  ngOnChanges(data) {
    let tempWorkflow = this.Configurations?.granuleTypes?.find(x => x.type == SnapshotTypeConstants.workflow);
    this.WorkflowParentId = tempWorkflow?.id
    this.workflows = tempWorkflow?.granules ? tempWorkflow?.granules : []
  }

  CheckBoxChecked(granule: IGranulesSelected, value: boolean,parentId?:string,isParent?:boolean) {
    this.CheckboxChanged.emit({
      item: granule,
      value: value,
      parentId:parentId,
      isInstantSave : true,
      isParentItself:isParent
    })
  }

  expandCollapse(data){
    data.isSelected = !data.isSelected;
  }
}
