import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IGroupDetails } from '../../models/agent-models';

@Component({
  selector: 'lavi-select-group',
  templateUrl: './select-group.component.html',
  styleUrls: ['./select-group.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectGroupComponent extends AbstractComponent {

  @Input() GroupDialogVisible: boolean;
  @Input() DisplayMessage: string;
  @Input() Groups: IGroupDetails[];

  @Output() OnCancel: EventEmitter<void>;
  @Output() OnAssignGroup: EventEmitter<FormGroup>;

  SelectGroupForm: FormGroup;
  DefaultDropDownData = {
    value: null,
    text: 'Select Visitor Tag'
  };

  get GroupDropdownData() {
    const dropdownData = this.Groups ? this.Groups.map(x => {
      return {
        value: x.id,
        text: x.groupName
      };
    }) : [];
    return dropdownData;
  }

  constructor(private formBuilder: FormBuilder) {
    super();
    this.Groups = [];
    this.InitializeForm();
    this.OnCancel = new EventEmitter();
    this.OnAssignGroup = new EventEmitter<FormGroup>();
  }

  Init() {
    this.SelectGroupForm.reset();
  }

  private InitializeForm() {
    this.SelectGroupForm = this.formBuilder.group({
      group: [null],
    });
  }


  Cancel() {
    this.OnCancel.emit();
  }
  AddToGroup() {
    this.OnAssignGroup.emit(this.SelectGroupForm);
  }
}
