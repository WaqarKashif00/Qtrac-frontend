import { ChangeDetectorRef, Injectable } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { GroupResult } from "@progress/kendo-data-query";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AbstractComponentService } from "src/app/base/abstract-component-service";
import { cloneObject } from "src/app/core/utilities/core-utilities";
import { Validations } from "src/app/models/constants/validation.constant";
import { QuestionType } from "src/app/models/enums/question-type.enum";
import { isArray } from "util";
import { ConditionVariable, Operator, variable_type } from "../models/conditional-events";
import { Service } from "../models/work-flow-request.interface";
import { Operators, operatorsValue, TypeOfBoolean, TypesAndOperations } from "../operators-on-type-selection";
import { WorkFlowService } from "../work-flow.service";

@Injectable()
export class SharedConditionService extends AbstractComponentService {
    Operators$: Observable<Operator[]>;
    OperationsSubject$: BehaviorSubject<Operator[]>;
    MultiValueData$: Observable<string[]>;
    MultiValueDataSubject$: BehaviorSubject<string[]>;
    conditionNameList: GroupResult[];

    get Services(){
        return this.workflowService?.WorkFlow?.services?.filter((x: any) => !x.isDeleted)?.map((x: Service) => {
            return  x?.serviceNames?.find(name => name.isDefault)?.serviceName;
        });
    }

    get Queues(){
        return this.workflowService?.WorkFlow?.queues?.filter((x: any) => !x.isDeleted)?.map(x => x?.name);
    }

    get Groups(){
        return this.workflowService?.WorkFlow?.groups?.filter((x: any) => !x.isDeleted)?.map(x => x?.groupName);
    }

    get workflows(){
        return this.workflowService.workflowList$.pipe(map(x => {
            return x.map(wf => wf.generalSetting.name);
        }));
    }

    get Branches(){
        return this.workflowService.BranchesName$;
    }

    constructor(private ref: ChangeDetectorRef, private workflowService: WorkFlowService){
        super();
        this.InitObservables();
    }

    InitObservables() {
        this.OperationsSubject$ = new BehaviorSubject<Operator[]>([]);
        this.Operators$ = this.OperationsSubject$.asObservable();

        this.MultiValueDataSubject$ = new BehaviorSubject<string[]>([]);
        this.MultiValueData$ = this.MultiValueDataSubject$.asObservable();
    }

    OnOperatorChange(conditionFormGroup: FormGroup){
        this.subs.sink = conditionFormGroup.controls.operator.valueChanges.subscribe((x) => {
            if (x && x.text){
                conditionFormGroup.controls.value.clearValidators();
                conditionFormGroup.controls.value.reset();
                if (x.value == operatorsValue.IsEmpty || conditionFormGroup.controls?.condition?.value?.type == variable_type.event || conditionFormGroup.controls?.condition?.value?.data_type == TypeOfBoolean){
                    conditionFormGroup.controls.value.clearValidators();
                    conditionFormGroup.controls.value.updateValueAndValidity();
                }else{
                    conditionFormGroup.controls.value.setValidators(Validators.required);
                    if (conditionFormGroup.controls.condition.value.data_type == QuestionType.PhoneNumber.value || conditionFormGroup.controls.condition.value.data_type == QuestionType.SMSPhoneNumber.value){
                        conditionFormGroup.controls.value.setValidators([Validators.pattern(Validations.PhoneNoRegx), Validators.required]);
                    }
                    if (conditionFormGroup.controls.condition.value.data_type == QuestionType.Email.value){
                        conditionFormGroup.controls.value.setValidators([Validators.pattern(Validations.EmailRegX), Validators.required]);
                    }
                    if (conditionFormGroup.controls.condition.value.data_type == QuestionType.Number.value){
                        conditionFormGroup.controls.value.setValidators([Validators.pattern(Validations.NumberOnlyRegx), Validators.required]);
                    }
                    conditionFormGroup.controls.value.updateValueAndValidity();
                }
            }
        });
    }

    OnTypeChange(conditionFormGroup: FormGroup) {
        this.subs.sink = conditionFormGroup.controls.condition.valueChanges.subscribe((x) => {
            if (x && x.id){
                if (x.type == variable_type.event){
                    conditionFormGroup.controls.operator.clearValidators();
                    conditionFormGroup.controls.value.clearValidators();
                }else{
                    conditionFormGroup.controls.operator.setValidators(Validators.required);
                    const operations = TypesAndOperations.get(x.data_type);
                    this.OperationsSubject$.next(cloneObject(operations));
                    if (x.data && x.data[0]){
                        this.MultiValueDataSubject$.next(x.data);
                    }
                }
                this.ResetOperatorAndValue(conditionFormGroup);
            }
        });
    }

    setEditFormData(conditionFormGroup: FormGroup) {
        const ConditionValue = this.SetConditionListAnValue(conditionFormGroup);
        if (ConditionValue && ConditionValue.id) {
            this.SetOperatorListAndValue(ConditionValue, conditionFormGroup);
            if ((this.IsConditionMultiSelector(ConditionValue?.data_type)) && ConditionValue?.data) {
                this.MultiValueDataSubject$.next(cloneObject(ConditionValue?.data));
            }
            if (ConditionValue.data_type == QuestionType.Date.value || ConditionValue.data_type == QuestionType.Time.value){
                conditionFormGroup.controls.value.setValue(new Date(conditionFormGroup.controls.value.value));
            }
            if(ConditionValue.data_type==QuestionType.DropDown.value || ConditionValue.data_type==QuestionType.Options.value || ConditionValue.data_type==QuestionType.MultiSelect.value){
                if(conditionFormGroup.controls.operator.value.text == Operators.In || conditionFormGroup.controls.operator.value.text == Operators.NotIn){
                    if(!conditionFormGroup.controls.value.value || !conditionFormGroup.controls.value.value[0]){
                        conditionFormGroup.controls.value.setValue([]);
                    }
                }
            }
        }
    }

    OnFormValueChange(conditionFormGroup: FormGroup) {
        this.OnTypeChange(conditionFormGroup);
        this.OnOperatorChange(conditionFormGroup);
    }

    ResetOperatorAndValue(conditionFormGroup?: FormGroup){
        if (conditionFormGroup){
            conditionFormGroup.get('operator').reset();
            conditionFormGroup.get('value').reset();
        }
    }

    IsConditionMultiSelector(ConditionType: string){
        return ConditionType == 'DROPDOWN' || ConditionType == 'OPTIONS' || ConditionType == 'MULTISELECT';
    }

    private SetOperatorListAndValue(ConditionValue: ConditionVariable, conditionFormGroup: FormGroup) {
        if (ConditionValue.type != variable_type.event){
            this.OperationsSubject$.next(cloneObject(TypesAndOperations.get(ConditionValue?.data_type)));
            const operatorValue = this.OperationsSubject$.value.find(x => x.text == conditionFormGroup.controls?.operator?.value?.text);
            if (operatorValue && operatorValue.text){
                conditionFormGroup.controls.value.clearValidators();
                if (operatorValue.value == operatorsValue.IsEmpty || conditionFormGroup.controls?.condition?.value?.type == variable_type.event || conditionFormGroup.controls?.condition?.value?.data_type == TypeOfBoolean){
                    conditionFormGroup.controls.value.clearValidators();
                    conditionFormGroup.controls.value.updateValueAndValidity();
                }else{
                    conditionFormGroup.controls.value.setValidators(Validators.required);
                    if (conditionFormGroup.controls.condition.value.data_type == QuestionType.PhoneNumber.value || conditionFormGroup.controls.condition.value.data_type == QuestionType.SMSPhoneNumber.value){
                        conditionFormGroup.controls.value.setValidators([Validators.pattern(Validations.PhoneNoRegx), Validators.required]);
                    }
                    if (conditionFormGroup.controls.condition.value.data_type == QuestionType.Email.value){
                        conditionFormGroup.controls.value.setValidators([Validators.pattern(Validations.EmailRegX), Validators.required]);
                    }
                    if (conditionFormGroup.controls.condition.value.data_type == QuestionType.Number.value){
                        conditionFormGroup.controls.value.setValidators([Validators.pattern(Validations.NumberOnlyRegx), Validators.required]);
                    }
                }
            }else{
                conditionFormGroup.controls.operator.setValue(null);
                conditionFormGroup.controls.value.clearValidators();
                conditionFormGroup.controls.value.reset();
            }


        }
    }

    private SetConditionListAnValue(conditionFormGroup: FormGroup) {
        const ConditionValue = conditionFormGroup.controls.condition?.value;
        const newValue: any = this.conditionNameList.find(x => x.value == ConditionValue?.type)?.
            items.find((x: ConditionVariable) => x.id == ConditionValue?.id);
        conditionFormGroup.controls.condition?.setValue(ConditionValue);
        if (newValue){
            newValue.data = ConditionValue?.data;
            return newValue;
        }
        return ConditionValue;
    }


}
