import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { SettingsService } from './settings.service';
import { WorkflowValidationMessage } from 'src/app/models/validation-message/workflow-message';

@Component({
  selector: 'lavi-settings',
  templateUrl: './settings.component.html',
  styleUrls:['./settings.component.scss', '../work-flow-configuration/work-flow-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[SettingsService]
})
export class SettingsComponent extends AbstractComponent {

  @Input() IsSettingsDialogOpen: boolean;
  WorkflowMessage = WorkflowValidationMessage;

  listItems = [];
  get SettingForm() {
    return this.settingsService.SettingForm;
  }

  constructor(private settingsService: SettingsService) {
    super();
  }

  get MiddlefixNumberFormat(){
    return this.SettingForm.get('singleNumberFormat.middlefix').value;
  }

  Init(){
    this.listItems = this.settingsService.GetDisplays();
  }

  Save(){
    this.settingsService.Save();
  }

  Cancel(){
    this.settingsService.Cancel();
  }

}
