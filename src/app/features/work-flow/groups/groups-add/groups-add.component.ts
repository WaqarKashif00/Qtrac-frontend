import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { WorkflowValidationMessage } from 'src/app/models/validation-message/workflow-message';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'lavi-groups-add',
  templateUrl: './groups-add.component.html',
  styleUrls: ['./groups-add.component.scss'],
})
export class GroupsAddComponent extends AbstractComponent {
  @Input() IsGroupDialogOpen: boolean;
  @Input() Mode: string;
  @Output() SaveForm: EventEmitter<FormGroup> = new EventEmitter();
  @Output() Close: EventEmitter<void> = new EventEmitter();

  WorkflowMessage = WorkflowValidationMessage;

  constructor(
    private service: GroupsService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
  }

  get AddGroupForm() {
    return this.service.AddEditGroupForm;
  }

  Init() {
    this.service.InitRequiredAddEditConfigurations();
  }

  ModalClose() {
    this.Close.emit();
    this.service.PushQueueAndQuestionSetInRoutingSubject();
  }

  Save() {
    this.SaveForm.emit(this.AddGroupForm);
  }
  OnColorPickerValueChange() {
    this.changeDetector.detectChanges();
  }
}
