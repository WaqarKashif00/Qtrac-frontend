import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { process, State } from '@progress/kendo-data-query';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { Confirmable } from 'src/app/shared/decorators/confirmable.decorator';
import { AdvanceRules } from '../../../models/advance-workflow-rules.interface';
import { AdvanceWorkflowRuleService } from '../../advance-workflow-rule.service';

@Component({
  selector: 'lavi-advance-workflow-rule-list',
  templateUrl: './advance-workflow-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./advance-workflow-list.component.scss', './../../../work-flow-configuration/work-flow-configuration.component.scss']
})
export class AdvanceWorkflowListComponent extends AbstractComponent {

  @Input() AdvanceRuleList: AdvanceRules[] = []

  public state: State = {
    skip: 0,
    take: 1000
  };
  public gridData: any = process(this.AdvanceRuleList?.filter(x=>!x.isDeleted), this.state);

  constructor(private changeDetect: ChangeDetectorRef, 
    private advanceWorkflowRuleService:AdvanceWorkflowRuleService) {
    super();
  }

  ngOnChanges() {
    this.gridData = process(this.AdvanceRuleList?.filter(x=>!x.isDeleted), this.state);
    this.changeDetect.detectChanges();
  }

  @Confirmable(CommonMessages.ConfirmDuplicateMessage)
  CopyAdvanceRule(dataItem: AdvanceRules) {
    this.advanceWorkflowRuleService.CreateCopyOfAdvanceRule(dataItem)
  }

  @Confirmable(CommonMessages.ConfirmDeleteMessage)
  DeleteAdvanceRule(id: string) {
    this.advanceWorkflowRuleService.DeleteAdvanceRule(id)
  }

  EditAdvanceRule(dataItem: AdvanceRules) {
    this.advanceWorkflowRuleService.OpenEditModal(dataItem);
  }
}
