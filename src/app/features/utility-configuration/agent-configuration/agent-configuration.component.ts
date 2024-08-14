import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LaviListComponent } from 'src/app/base/lavi-list-component';
import { IDropdownList } from 'src/app/models/common/dropdown-list.interface';
import { MenuOperationEnum } from 'src/app/models/enums/menu-operation.enum';
import { Menus, ShowMenuItem } from 'src/app/shared/utility-functions/menu-utility-functions';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { GetDeleteSuccessfulMessage } from '../../../core/utilities/core-utilities';
import { CommonMessages } from '../../../models/constants/message-constant';
import { IAgentRequest } from './add-or-edit-agent-configuration/models/agent-configuration-request.interface';
import { IAgentWorkflow } from './add-or-edit-agent-configuration/models/agent-workflows.interface';
import { AgentConfigurationService } from './agent-configuration.service';

@Component({
  selector: 'lavi-agent-configuration',
  templateUrl: './agent-configuration.component.html',
  styleUrls: ['./agent-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AgentConfigurationService]
})
export class AgentConfigurationComponent extends LaviListComponent {

  public AgentTemplateList$: Observable<IAgentRequest[]>;
  public Workflow$: Observable<IAgentWorkflow[]>;
  public AgentViewType$: Observable<IDropdownList[]>;
  items: any[] = Menus({hideDuplicate:true})

  constructor(private service: AgentConfigurationService, private authStateService: AuthStateService){
    super();
    this.AgentTemplateList$ = service.AgentTemplateList$;
    this.Workflow$ = service.Workflow$;
    this.AgentViewType$ = service.AgentViewType$;
  }

  Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  }

  Destroy(){
    // Inherited from AbstractComponent to destroy component life cycle
  }

  Redirect(){
    this.service.RedirectToAddAgentTemplate();
  }

  OnSelect({ item }, dataItem: IAgentRequest) {
    if (item.text === MenuOperationEnum.Edit) {
      this.service.RedirectToEditAgentTemplate(dataItem.id);
    }

    if (item.text === MenuOperationEnum.Delete) {
      this.DeleteAgent(dataItem);
    }
  }

  ShowMenuItem(item): boolean {
    return ShowMenuItem(item, this.authStateService.AuthorizationDetails,this.roleActions.AgentTemplates);
  }

  RedirectToEditAgentConfiguration(agentId: string){
    this.service.RedirectToEditAgentTemplate(agentId);
  }

  DeleteAgent(agent: IAgentRequest) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.subs.sink = this.service
        .Delete(agent)
        .subscribe((x) => {
          this.service.AppNotificationService.Notify(GetDeleteSuccessfulMessage('Agent template'));
          this.service.GetAgentTemplateList();
        });
    }
  }

}
