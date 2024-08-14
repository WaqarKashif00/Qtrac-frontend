import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { Display } from 'src/app/models/enums/display.enum';
import { WorkflowMessages } from '../message-constant';
import { Setting } from '../models/work-flow-request.interface';
import { WorkFlowService } from '../work-flow.service';

@Injectable()
export class SettingsService extends AbstractComponentService {
  get SettingForm() {
    return this.workFlowService.SettingForm;
  }
  get StartTicketNumberFormControl() {
    return this.SettingForm.get('ticketStart');
  }
  get EndTicketNumberFormControl() {
    return this.SettingForm.get('ticketEnd');
  }

  OpenSettingModal$: Observable<boolean>;
  private OpenSettingModalSubject: BehaviorSubject<boolean>;

  constructor(private workFlowService: WorkFlowService) {
    super();
    this.InitializeObservableAndSubject();
  }

  private InitializeObservableAndSubject() {
    this.OpenSettingModalSubject = new BehaviorSubject<boolean>(false);
    this.OpenSettingModal$ = this.OpenSettingModalSubject.asObservable();
  }

  OpenModal() {
    this.OpenSettingModalSubject.next(true);
  }

  CloseModal() {
    this.OpenSettingModalSubject.next(false);
  }

  Cancel() {
    this.workFlowService.SetPreviousSettingStateOncancel();
    this.CloseModal();
  }
  
  Save() {
    if (this.IsEndTicketNumberValid()) {
      this.AppNotificationService.NotifyError(
        WorkflowMessages.StartTicketNumberIsGreaterErrorMessage
      );
      return;
    }
    this.formService
      .CallFormMethod<Setting>(this.SettingForm)
      .then((response) => {
        this.workFlowService.SaveSetting(response);
        this.CloseModal();
      });
  }

  private IsEndTicketNumberValid() {
    const startTicketNumber = this.StartTicketNumberFormControl.value;
    const endTicketNumber = this.EndTicketNumberFormControl.value;
    return startTicketNumber > endTicketNumber;
  }

  GetDisplays() {
    const displays = [];
    for (const [propertyValue] of Object.entries(Display)) {
      displays.push(propertyValue);
    }
    return displays;
  }
}
