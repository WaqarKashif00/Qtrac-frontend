import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AddOrEditAgentConfigurationService } from './add-or-edit-agent-configuration.service';
import { IAgentDropDowns } from './models/agent-dropdowns.interface';

@Component({
  selector: 'lavi-agent-template',
  templateUrl: './add-or-edit-agent-configuration.component.html',
  styleUrls: ['./add-or-edit-agent-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AddOrEditAgentConfigurationService]
})
export class AddOrEditAgentConfigurationComponent extends AbstractComponent {
  public DropDownsData$: Observable<IAgentDropDowns>;
  public IsEditedMode$: Observable<boolean>;
  public IsClassicMode$: Observable<boolean>;
  public ShowPanel$: Observable<boolean>;

  get AgentTemplateForm() {
    return this.agentService.AgentTemplateForm;
  }

  constructor(private agentService: AddOrEditAgentConfigurationService) {
    super();
    this.SetObservables();
    this.SetInitialData();
  }

  Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }
  public SetObservables() {
    this.DropDownsData$ = this.agentService.DropDownsData$;
    this.IsEditedMode$ = this.agentService.IsEditMode$;
    this.IsClassicMode$ = this.agentService.IsClassicMode$;
    this.ShowPanel$ = this.agentService.ShowPanel$;
  }

  public SetInitialData() {
    this.agentService.CallMultipleApi();
    this.agentService.SetMode();
  }

  public OnChangeOfAgentViewType(value: string) {
    this.agentService.ValidationBasedOnAgentView(value);
  }

  public OnChangeOfWorkflow(workflowId: string) {
    this.agentService.OnchangeOfWorkflow(workflowId);
  }

  public OnChangeOfCustomerUrlTab() {
    this.agentService.OnChangeOfCustomerUrlTab();
  }

  public Save() {
    this.agentService.SaveAgentConfiguration(this.AgentTemplateForm);
  }

  public ResetClassicBiDirectionalCheckbox(){
    this.agentService.ResetBidirectionalCheckBox();
  }
  public ResetClassicCreateGroupCheckbox(){
    this.agentService.ResetCreateGroupCheckBox()
  }
}
