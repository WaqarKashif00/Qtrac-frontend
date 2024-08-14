import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { WorkflowMessages } from '../../message-constant';
import { Group } from '../../models/work-flow-request.interface';

@Component({
  selector: 'lavi-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss', '../../work-flow-configuration/work-flow-configuration.component.scss']
})
export class GroupsListComponent extends AbstractComponent {

  @Input() GroupList: Group[] = [];
  @Output() OnEdit: EventEmitter<Group> = new EventEmitter();
  @Output() OnCopyGroup: EventEmitter<Group> = new EventEmitter();
  @Output() OnDelete: EventEmitter<string> = new EventEmitter();
  Groups: Group[]=[];

  constructor() {
    super();
  }

  Edit(group) {
    this.OnEdit.emit(group);
  }

  Copy(group) {
    this.OnCopyGroup.emit(group);
  }

  Delete(id: string) {
    if (confirm(WorkflowMessages.ConfirmDeleteMessage)) {
      this.OnDelete.emit(id);
    }
  }

  public ngOnChanges() {
    this.Groups = this.GroupList.filter(x=>!x.isDeleted);
  }
}
