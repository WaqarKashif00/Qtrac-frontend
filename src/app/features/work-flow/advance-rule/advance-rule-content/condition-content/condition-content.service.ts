import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { AbstractComponentService } from "src/app/base/abstract-component-service";
import { PreServiceQuestion, Service } from "src/app/models/common/work-flow-detail.interface";
import { QuestionType } from "src/app/models/enums/question-type.enum";
import { ConditionVariable } from "../../../models/advance-workflow-rules.interface";
import { TypeOfMultiSelect, TypesAndOperations } from "../../../operators-on-type-selection";
import { WorkFlowService } from "../../../work-flow.service";
import { AdvanceWorkflowRuleService } from "../../advance-workflow-rule.service";

@Injectable()
export class ConditionContentService extends AbstractComponentService {


    get Services() {
        return this.workflowService?.WorkFlow?.services?.filter((x: any) => !x.isDeleted)?.map((x: Service) => {
            return x?.serviceNames?.find(name => name.isDefault)?.serviceName;
        });
    }

    get Queues() {
        return this.workflowService?.WorkFlow?.queues?.filter((x: any) => !x.isDeleted)?.map(x => x?.name);
    }

    get Groups() {
        return this.workflowService?.Groups$?.pipe(map(x=>{return x?.filter(y=>!y.isDeleted).map(x=>x?.groupName)}));

    }

    get workflows() {
        return this.workflowService.workflowList$.pipe(map(x => {
            return x.map(wf => wf.generalSetting.name);
        }));
    }

    get Branches() {
        return this.workflowService.BranchesName$;
    }

    get SelectedLanguage (){
  
        return this.workflowService.SupportedLanguages$.pipe(map(x => {
            return x.map(Selectedlanguage => Selectedlanguage.language);
        }));
    }

    constructor(private service: AdvanceWorkflowRuleService, private workflowService: WorkFlowService) {
        super();
    }

    IsConditionMultiValueType(question: ConditionVariable): PreServiceQuestion {
        let ques = this.workflowService?.WorkFlow?.preServiceQuestions?.find(x => x?.id == question?.id);
        if (!ques) {
            this.workflowService?.WorkFlow?.questionSets?.forEach(set => {
                if (!ques) {
                    ques = set?.questions?.find(x => x?.id == question?.id)
                }
            })
        }
        let response = (ques?.type == QuestionType.DropDown.value || ques?.type == QuestionType.MultiSelect.value || ques?.type == QuestionType.Options.value);
        return response ? ques : null
    }

    RemoveIndividualCondition(Index: number, ParentIndex: number) {
        this.service.RemoveIndividualCondition(Index, ParentIndex)
    }

    ChangeOperator(data_type: string, id?: string) {
        if(id){
            data_type = TypeOfMultiSelect
        }
        let operators = TypesAndOperations.get(data_type);
        return operators;
    }
}