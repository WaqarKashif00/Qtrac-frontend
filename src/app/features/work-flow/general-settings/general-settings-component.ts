import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { AbstractComponent } from "src/app/base/abstract-component";
import { GeneralSettingsServices } from "./general-settings-service";
import { WorkflowValidationMessage } from "src/app/models/validation-message/workflow-message";
import { ITextFieldLoaderSettings } from "src/app/models/common/text-field-loader-settings.interface";

@Component({
  selector: 'lavi-general-settings',
  templateUrl: './general-settings-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GeneralSettingsServices],
  styleUrls: ['./general-settings-component.scss', '../work-flow-configuration/work-flow-configuration.component.scss']
})

export class GeneralSettingsComponent extends AbstractComponent {

  WorkFlowMessage = WorkflowValidationMessage;
  get GeneralSettingForm() {
    return this.generalSettingService.GeneralSettingForm;
  }
  get WorkflowNameFormControl() {
    return this.generalSettingService.GeneralSettingForm.get("name");
  }
  LoaderSettings: ITextFieldLoaderSettings = {
    TextFiledDivClasses: ["col-lg-12", "col-md-12"]
  };
  constructor(private generalSettingService: GeneralSettingsServices,
              private readonly changeDetectorRef: ChangeDetectorRef) {
    super();
  }
  Init(){
    this.subs.sink = this.WorkflowNameFormControl.statusChanges.subscribe(() => {
      this.changeDetectorRef.detectChanges();
    })
  }


}
