import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Group } from 'src/app/models/common/work-flow-detail.interface';
import { Mode } from 'src/app/models/enums/mode.enum';
import { GroupsService } from './groups.service';

@Component({
  selector: 'lavi-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['../work-flow-configuration/work-flow-configuration.component.scss'],
  providers: [GroupsService]
})
export class GroupsComponent extends AbstractComponent {

  GroupList$: Observable<Group[]>;
  OpenGroupModal$: Observable<boolean>;
  Mode: string;

  constructor(private service: GroupsService) {
    super();
    this.InitObservables();
  }

  private InitObservables() {
    this.GroupList$ = this.service.groupList$;
    this.OpenGroupModal$ = this.service.OpenGroupModal$;
  }

  Add() {
    this.Mode = Mode.Add;
    this.service.OpenModalAndInitAddConfigurations();
  }

  Edit(group: Group) {
    this.Mode = Mode.Edit;
    this.service.OpenModalAndInitEditConfigurations();
    this.service.SetEditData(group);
  }

  Copy(group: Group) {
    this.service.CopyGroup(group);
  }

  Delete(id: string) {
    this.service.Delete(id);
  }

  Save(form: FormGroup) {
    if (this.Mode === Mode.Add) {
      this.service.Add(form);
    }
    if (this.Mode === Mode.Edit) {
      this.service.Edit(form);
    }
  }

  CloseModal() {
    this.service.CloseModalAndResetForm();
  }
}
