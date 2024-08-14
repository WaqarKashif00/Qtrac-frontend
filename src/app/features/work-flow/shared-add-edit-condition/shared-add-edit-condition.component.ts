import { Component, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { GroupResult } from "@progress/kendo-data-query";
import { Observable, of } from "rxjs";
import { AbstractComponent } from "src/app/base/abstract-component";
import { DynamicFieldIds, NumberTimeMagnitude, TextDynamicFieldForDropdown, TimeInNumberDynamicField } from "src/app/models/constants/dynamic-field.constants";
import { Validations } from "src/app/models/constants/validation.constant";
import { Mode } from "src/app/models/enums/mode.enum";
import { QuestionType } from "src/app/models/enums/question-type.enum";
import { WorkflowValidationMessage } from "src/app/models/validation-message/workflow-message";
import { EventName, Operator, variable_type } from "../models/conditional-events";
import { defaultData } from '../models/workflow-default-value';
import { Operators } from "../operators-on-type-selection";
import { SharedConditionService } from "./shared-condition.service";

@Component({
    selector: 'lavi-shared-add-edit-condition',
    templateUrl: './shared-add-edit-condition.component.html',
    styleUrls: ['../work-flow-configuration/work-flow-configuration.component.scss'],
    providers:[SharedConditionService]
})

export class SharedAddEditConditionComponent extends AbstractComponent {
    @Input() FormGroup : FormGroup;
    @Input() conditionsNameList : GroupResult[];
    @Input() eventsNameList : EventName[];
    @Input() Index : Number;
    @Input() Mode: string = Mode.Add
    @Output() Delete : EventEmitter<any> = new EventEmitter<any>();
    questionType = QuestionType;
    operatorEnum = Operators
    defaultData=defaultData;
    WorkflowMessage = WorkflowValidationMessage;
    Validation = Validations;
    VariableType = variable_type
    operators$: Observable<Operator[]>;
    MultiValueData$ : Observable<string[]>;
    DynamicField = TextDynamicFieldForDropdown
    TimeDynamicField = TimeInNumberDynamicField

    get Services(){
        return this.sharedConditionService.Services;
    }

    get Queues(){
        return this.sharedConditionService.Queues
    }

    get Groups(){
        return this.sharedConditionService.Groups
    }

    get Workflows(){
        return this.sharedConditionService.workflows
    }

    get Locations(){
        return this.sharedConditionService.Branches
    }

    get CheckTextControlVisibility(){
        return !(this.DynamicField.some(x=> x.id == this.FormGroup?.value?.condition?.id))
    }

    
    get showMinuteLabel(){
        return this?.TimeDynamicField?.some(x=>x.id == this.FormGroup?.value?.condition?.id) ? NumberTimeMagnitude : '';
     }
    
    constructor(private sharedConditionService:SharedConditionService,private elRef:ElementRef){
        super();
    }

    Init(){
        this.InitObservable()
        
    }

    InitObservable() {
        this.operators$ = this.sharedConditionService.Operators$;
        this.MultiValueData$ = this.sharedConditionService.MultiValueData$;
        this.sharedConditionService.setEditFormData(this.FormGroup);
        this.sharedConditionService.OnFormValueChange(this.FormGroup);
    }
    ngOnChanges(data){
        if(data?.conditionsNameList){
            this.sharedConditionService.conditionNameList = this.conditionsNameList;
        }
    }

    DeleteConditionFromArray(){
        this.Delete.emit(this.Index);
    }

    DropdownData(){
        if(this.FormGroup?.value?.condition?.id == DynamicFieldIds.serviceNameId){
            return of(this.Services);
        }
        if(this.FormGroup?.value?.condition?.id == DynamicFieldIds.queueNameId){
            return of(this.Queues);
        }
        if(this.FormGroup?.value?.condition?.id == DynamicFieldIds.groupNameId){
            return of(this.Groups);
        }
        if(this.FormGroup?.value?.condition?.id == DynamicFieldIds.workflowNameId){
            return this.Workflows;
        }
        if(this.FormGroup?.value?.condition?.id == DynamicFieldIds.locationNameId){
            return this.Locations;
        }
    }

}