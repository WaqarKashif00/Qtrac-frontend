import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { GroupResult } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ServiceValidationMessage, WorkflowConstants } from 'src/app/models/constants/basic-workflow-rules-constants';
import { SurveyQuestionSet } from 'src/app/models/common/work-flow-detail.interface';
import { OperationalOccurs } from 'src/app/models/enums/week-days.enum';
import { WorkflowValidationMessage } from 'src/app/models/validation-message/workflow-message';
import { HoursOfOperation } from '../../models/hours-of-operation.interface';
import { SurveyTemplate } from '../../models/survey-template.interface';
import { TicketTemplate } from '../../models/ticket-template.interface';
import { AppointmentTemplate } from '../../models/work-flow-request.interface';
import { DefaultWorkflowDropdownValues, Days, ServiceOccurs } from '../../workflow.constant';
import { ServiceService } from '../service.service';


@Component({
  selector: 'lavi-services-add',
  templateUrl: './services-add.component.html',
  styleUrls: ['./services-add.component.scss', '../../work-flow-configuration/work-flow-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesAddComponent extends AbstractComponent implements OnChanges {

  @Input() isServiceDialogOpen: boolean;
  @Input() Routings: GroupResult[];
  @Input() Appointments: AppointmentTemplate[];
  @Input() HoursOfOperations: any[];
  @Input() SurveyTemplates: SurveyTemplate[];
  @Input() TicketTemplates: TicketTemplate[];
  @Input() Mode: string;
  @Output() Close: EventEmitter<void> = new EventEmitter();
  @Output() SaveForm: EventEmitter<FormGroup> = new EventEmitter();

  workflowConstant = WorkflowConstants;
  WorkflowMessage = WorkflowValidationMessage;
  FileName: any;
  Item: any;
  AppointmentList: AppointmentTemplate[];
  DefaultWorkflowDropdownValues = DefaultWorkflowDropdownValues;
  Days = Days;
  OperationalOccurs = OperationalOccurs;
  count:number;

  get ServiceOccurs(){
    if(this.HoursOfOperations.length !== 1){
     return ServiceOccurs.filter((x)=>x.text !== 'Default')
    }else{
      return ServiceOccurs
    }
  }

  get IsServiceNameDialogOpen(){
    return this.serviceService.IsServiceNameDialogOpen;
  }

  get IsServiceDescriptionDialogOpen(){
    return this.serviceService.IsServiceDescriptionDialogOpen;
  }

  get IsServiceIconDialogOpen(){
    return this.serviceService.IsServiceIconDialogOpen;
  }
  get isEditingHooOffset(){
    return this.serviceService.isEditingHooOffset;
  }

  get AddServiceForm() {
    return this.serviceService.AddEditServiceForm;
  }

  get OperationalWorkingHoursFormGroup() {
    return this.AddServiceForm.get('operationalWorkingHours') as FormGroup;
  }
  

  get OnCustomDateFormArray() {
    return this.serviceService.OnCustomDateFormArray;
  }

  get DuringDateRangeFormArray() {
    return this.serviceService.DuringDateRangeFormArray;
  }

  get DailyFormGroup() {
    return this.serviceService.DailyFormGroup;
  }

  get WeeklyFormGroup() {
    return this.serviceService.WeeklyFormGroup;
  }

  get ServiceNamesFormArray() {
    return this.serviceService.ServiceNamesFormArray;
  }

  get ServiceDescriptionsFormArray() {
    return this.serviceService.ServiceDescriptionsFormArray;
  }

  get ServiceIconsFormArray(){
    return this.serviceService.ServiceIconFormArray;
  }

  get SurveyQuestions$():Observable<SurveyQuestionSet[]>{
    return  this.serviceService.SurveyQuestions$;
  }

  constructor(private serviceService: ServiceService) {
    super();
  }

  Init() {
    this.serviceService.InitRequiredAddEditConfigurations();
  }

  ngOnChanges(){
    this.AppointmentList = this.Appointments.filter( x => !x.isDeleted);
  }

  get supportedLanguages(){
    return this.serviceService.supportedLanguages;
  }

  ModalClose() {
    this.Close.emit();
    this.serviceService.PushQueueAndQuestionSetInRoutingSubject();
  }

  Save() {
    if(this.ValidateDateList() && this.ValidateAvailableTimeframeList()){
    this.SaveForm.emit(this.AddServiceForm);
    }
  }

  ValidateDateList(){
    let Validate = true;
    if(this.AddServiceForm.controls.serviceOccur.value?.value === OperationalOccurs.Custom_Date && this.OnCustomDateFormArray.length < 1){
      Validate = false;
      this.serviceService.AppNotificationService.NotifyError(ServiceValidationMessage.ReqiuredCustomDate);
    }
    if(this.AddServiceForm.controls.serviceOccur.value?.value === OperationalOccurs.During_Date_Range && this.DuringDateRangeFormArray.length < 1){
      Validate = false;
      this.serviceService.AppNotificationService.NotifyError(ServiceValidationMessage.ReqiuredDuringDateRange);
    }
    return Validate;
  }

  ValidateAvailableTimeframeList(){
    let Validate = true;
    if(this.AddServiceForm.controls.serviceOccur.value?.value === OperationalOccurs.Daily && this.CheckAvilableTimeFrmaeForDaily(this.DailyFormGroup)){
      Validate = false;
      if(this.count == 0){
        this.serviceService.AppNotificationService.NotifyError(ServiceValidationMessage.ReqiuredDay);
      }else{
      this.serviceService.AppNotificationService.NotifyError(ServiceValidationMessage.ReqiuredAvailableTimeFrame);
      }
    } else{
      this.ClearValidatorAvilableTimeFrmaeForDailyDay(this.DailyFormGroup)
    }
    if(this.AddServiceForm.controls.serviceOccur.value?.value === OperationalOccurs.Weekly && this.CheckAvilableTimeFrmaeForWeekly(this.WeeklyFormGroup)){
      Validate = false;
      
    if(this.count == 0){
      this.serviceService.AppNotificationService.NotifyError(ServiceValidationMessage.ReqiuredDay);
      }else{
        this.serviceService.AppNotificationService.NotifyError(ServiceValidationMessage.ReqiuredAvailableTimeFrame);
      }
    } else{
      this.ClearValidatorAvilableTimeFrmaeForWeeklyDay(this.WeeklyFormGroup)
    }
    if(this.AddServiceForm.controls.serviceOccur.value?.value === OperationalOccurs.Custom_Date && this.CheckAvilableTimeFrmaeForDate(this.OnCustomDateFormArray)){
      Validate = false;
      this.serviceService.AppNotificationService.NotifyError(ServiceValidationMessage.ReqiuredAvailableTimeFrame);
    } else{
        this.ClearValidatorAvilableTimeFrmaeForDate(this.OnCustomDateFormArray);
    }
    if(this.AddServiceForm.controls.serviceOccur.value?.value === OperationalOccurs.During_Date_Range && this.CheckAvilableTimeFrmaeForDate(this.DuringDateRangeFormArray)){
      Validate = false;
      this.serviceService.AppNotificationService.NotifyError(ServiceValidationMessage.ReqiuredAvailableTimeFrame);
    } 
    else {
      this.ClearValidatorAvilableTimeFrmaeForDate(this.DuringDateRangeFormArray);
    }
    return Validate;
  }
  
  CheckAvilableTimeFrmaeForDate(formArray:FormArray):boolean{
    let Validate = false;
    formArray.controls.forEach((Date) => {
      if(Date.value?.availableTimeFrames.length < 1){
        Validate = true; 
      }
    });
    return Validate
  }

  ClearValidatorAvilableTimeFrmaeForDate(formArray:FormArray){
    formArray.controls.forEach((Date) => {
      this.ClearAndUpdateValidator(Date.get('availableTimeFrameFormGroup') as FormGroup);
    });
  }

  ClearValidatorAvilableTimeFrmaeForWeeklyDay(formGroup:FormGroup){
    this.ClearAndUpdateValidator(formGroup.controls.sunday.get('availableTimeFrameFormGroup') as FormGroup);
    this.ClearAndUpdateValidator(formGroup.controls.monday.get('availableTimeFrameFormGroup') as FormGroup);
    this.ClearAndUpdateValidator(formGroup.controls.tuesday.get('availableTimeFrameFormGroup') as FormGroup);
    this.ClearAndUpdateValidator(formGroup.controls.wednesday.get('availableTimeFrameFormGroup') as FormGroup);
    this.ClearAndUpdateValidator(formGroup.controls.thursday.get('availableTimeFrameFormGroup') as FormGroup);
    this.ClearAndUpdateValidator(formGroup.controls.friday.get('availableTimeFrameFormGroup') as FormGroup);
    this.ClearAndUpdateValidator(formGroup.controls.saturday.get('availableTimeFrameFormGroup') as FormGroup);
  }
  ClearValidatorAvilableTimeFrmaeForDailyDay(formGroup:FormGroup){
    this.ClearAndUpdateValidator(formGroup.controls.sunday.get('availableTimeFrameFormGroup') as FormGroup);
    this.ClearAndUpdateValidator(formGroup.controls.mondayToFriday.get('availableTimeFrameFormGroup') as FormGroup);
    this.ClearAndUpdateValidator(formGroup.controls.saturday.get('availableTimeFrameFormGroup') as FormGroup);
}
ClearAndUpdateValidator(formGroup:FormGroup){
  formGroup.get('fromTime').clearValidators();
  formGroup.get('toTime').clearValidators();
  formGroup.get('fromTime').updateValueAndValidity();
  formGroup.get('toTime').updateValueAndValidity();
}

  CheckAvilableTimeFrmaeForWeekly(formGroup:FormGroup):boolean{
    this.count = 0;
    if(formGroup.controls.sunday.get('isOpen')?.value){
      this.count++;
    if(formGroup.controls.sunday.get('availableTimeFrames')?.value.length < 1){
      return true;
    }
    }
    if(formGroup.controls.monday.get('isOpen')?.value){
      this.count++;
    if(formGroup.controls.monday.get('availableTimeFrames')?.value.length < 1){
      return true;
    }
    }
    if(formGroup.controls.tuesday.get('isOpen')?.value){
      this.count++;
    if(formGroup.controls.tuesday.get('availableTimeFrames')?.value.length < 1){
      return true;
    }
    }
    if(formGroup.controls.wednesday.get('isOpen')?.value){
      this.count++;
    if(formGroup.controls.wednesday.get('availableTimeFrames')?.value.length < 1){
      return true;
    }
    }
    if(formGroup.controls.thursday.get('isOpen')?.value){
      this.count++;
    if(formGroup.controls.thursday.get('availableTimeFrames')?.value.length < 1){
      return true;
    }
    }
    if(formGroup.controls.friday.get('isOpen')?.value){
      this.count++;
    if(formGroup.controls.friday.get('availableTimeFrames')?.value.length < 1){
      return true;
    }
    }
    if(formGroup.controls.saturday.get('isOpen')?.value){
      this.count++;
    if(formGroup.controls.saturday.get('availableTimeFrames')?.value.length < 1){
      return true;
    }
    }
    if(this.count == 0){
      return true;
    }
    return false;
  }

  CheckAvilableTimeFrmaeForDaily(formGroup:FormGroup):boolean{
    this.count = 0
    if(formGroup.controls.sunday.get('isOpen')?.value){
      this.count++;
    if(formGroup.controls.sunday.get('availableTimeFrames')?.value.length < 1){
      return true;
    }
    }
    if(formGroup.controls.mondayToFriday.get('isOpen')?.value){
      this.count++;
    if(formGroup.controls.mondayToFriday.get('availableTimeFrames')?.value.length < 1){
      return true;
    }
    }
    if(formGroup.controls.saturday.get('isOpen')?.value){
      this.count++;
    if(formGroup.controls.saturday.get('availableTimeFrames')?.value.length < 1){
      return true;
    }
    }
    if(this.count == 0){
      return true;
    }
    return false;
  }



  SaveNameForm(){
    this.serviceService.SaveNameForm()
  }

  SaveDescriptionForm(){
    this.serviceService.SaveDescriptionForm()
  }

  SaveIconForm(data){
    this.serviceService.SaveIconForm()
  }

  NameModalOpen(){
    this.serviceService.createNameTempData()
  }

  DescriptionModalOpen(){
    this.serviceService.createDescriptionTempData()
  }

  IconsModalOpen(){
    this.serviceService.createIconTempData();
  }

  NameModalClose(){
    this.serviceService.setNameTempDataOnCancel()
  }

  DescriptionModalClose(){
    this.serviceService.setDescriptionTempDataOnCancel()
  }

  IconsModalClose(){
    this.serviceService.setIconTempDataOnCancel();
  }

  translate(serviceName:string,formArray:FormArray, property:string){
    this.serviceService.translate(serviceName,formArray,property);
  }

  AddHours([timeFormArray,avaliabletimeForm]){
    this.serviceService.AddFormArray(timeFormArray,avaliabletimeForm);
  }

  RemoveHours([timeFormArray, index]){
    this.serviceService.RemoveItemFromArray(timeFormArray, index);
   }
   AddDateArray([fromDate,toDate, dateFormArray]){
    this.serviceService.AddDateArray(fromDate,toDate, dateFormArray);
   }
   RemoveWorkingDate([dateFormArray, index]){
    dateFormArray.removeAt(index);
   }
   OnChangeServiceOccursDropDown(){
    this.OnCustomDateFormArray.clear();
    this.DuringDateRangeFormArray.clear();
    this.AddServiceForm.controls.hoursOfOperationId.setValue((this.AddServiceForm.controls.serviceOccur.value.id === 1)?this.HoursOfOperations[0].id:null);
   }
  }
