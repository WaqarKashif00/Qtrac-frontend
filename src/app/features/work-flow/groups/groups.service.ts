import { ChangeDetectorRef, Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import { Group } from 'src/app/models/common/work-flow-detail.interface';
import { WorkflowMessages } from '../message-constant';
import { IGroupFormGroup } from '../models/group-form-group';
import { Group as GroupRequest } from '../models/work-flow-request.interface';
import { WorkFlowService } from '../work-flow.service';

@Injectable()
export class GroupsService extends AbstractComponentService {
  PushQueueAndQuestionSetInRoutingSubject() {
    this.workFlowService.PushQueueAndQuestionSetInRoutingSubject();
  }

  groupList$: Observable<Group[]>;
  OpenGroupModal$: Observable<boolean>;
  private OpenGroupModalSubject: BehaviorSubject<boolean>;

  AddEditGroupForm: FormGroup;
  IsEditMode = false;
  count = 0;
  GroupCopyCount: number;

  constructor(
    private workFlowService: WorkFlowService,
    private ref: ChangeDetectorRef
  ) {
    super();
    this.InitSubjectAndObservables();
  }

  private InitSubjectAndObservables() {
    this.groupList$ = this.workFlowService.Groups$;

    this.OpenGroupModalSubject = new BehaviorSubject<boolean>(false);
    this.OpenGroupModal$ = this.OpenGroupModalSubject.asObservable();
  }

  OpenModalAndInitAddConfigurations() {
    this.InitRequiredAddConfigurations();
    this.AddEditGroupForm.get('groupName').clearValidators();
    this.AddEditGroupForm.get('groupName').updateValueAndValidity();
    this.OpenModal();
  }

  OpenModalAndInitEditConfigurations() {
    this.InitRequiredEditConfigurations();
    this.OpenModal();
  }

  private InitRequiredAddConfigurations() {
    this.SetDefaultFormGroup();
  }

  private InitRequiredEditConfigurations() {
  }

  public InitRequiredAddEditConfigurations() {
    this.SetGroupForm(this.SetDefaultGroupValues());
    this.PushQueueAndQuestionSetInRoutingSubject();
  }

  private SetDefaultFormGroup() {
    this.AddEditGroupForm.patchValue({
      id: null,
      groupName: '',
      groupColor: '#000000'
    });
  }

  public SetGroupForm(data: IGroupFormGroup) {
    this.AddEditGroupForm = this.formBuilder.group({
      id: [data.id],
      groupName: [data.groupName, Validators.required],
      groupColor: [data.groupColor],
    });
  }

  public SetDefaultGroupValues() {
    const data: IGroupFormGroup = {
      id: null,
      groupName: '',
      groupColor: ''
    };
    return data;
  }

  SetEditData(group) {
    this.SetEditFormGroupData(group);
  }

  SetEditFormGroupData(group: Group) {
    this.IsEditMode = true;
    this.count = 0;

    this.AddEditGroupForm.patchValue({
      id: group.id,
      groupName: group.groupName,
      groupColor: group.groupColor
    });
  }

  CopyGroup(group: GroupRequest) {
    this.GroupCopyCount = 0;
    const cloneGroup = cloneObject(group);
    cloneGroup.id = this.uuid;

    this.IsGroupExist(cloneGroup.groupName);
    for (let i = 1; i < this.GroupCopyCount; i++) {
      cloneGroup.groupName += WorkflowMessages.CopyPostFixMessage
    }

    this.workFlowService.AddGroup(cloneGroup);
  }

  private IsGroupExist(Name: any) {

    this.GroupCopyCount = this.GroupCopyCount + 1;
    const isCopyExist = this.workFlowService.GroupsSubject.value.find(x => x.groupName == Name);
    if (isCopyExist) {
      this.IsGroupExist(Name + WorkflowMessages.CopyPostFixMessage);
    }
  }

  Add(request: FormGroup): void {
    this.SetAndUpdateValidators(request);
    this.formService.CallFormMethod<IGroupFormGroup>(request).then((response): void => {
      let groupName = this.AddEditGroupForm.get('groupName').value;
      groupName = groupName ? groupName.toLowerCase().trim() : "";
      const groupNameAlreadyExist = this.workFlowService.GetGroups()
        .some(group => group.groupName.toLowerCase().trim() === groupName && !group.isDeleted);

      if (groupNameAlreadyExist) {
        this.AddEditGroupForm.get('groupName').setErrors({ isExists: true });
        this.AppNotificationService.NotifyError('Visitor Tag with same name already exists.');
        return;
      }

      const groupRequest = this.GetGroupRequest(response, this.uuid);
      this.workFlowService.AddGroup(groupRequest);
      this.CloseModalAndResetForm();
      this.ref.detectChanges();
    });
  }

  private SetAndUpdateValidators(request: FormGroup) {
    request.get('groupName').setValidators(Validators.required);
    request.get('groupName').updateValueAndValidity();
  }

  Edit(request: FormGroup): void {
    this.SetAndUpdateValidators(request);
    const id = request.get('id').value;
    let groupName = this.AddEditGroupForm.get('groupName').value;
    groupName = groupName ? groupName.toLowerCase().trim() : "";
    const groupNameAlreadyExist = this.workFlowService.GetGroups()
      .some(group => group.id !== id && group.groupName.toLowerCase().trim() === groupName && !group.isDeleted);

    if (groupNameAlreadyExist) {
      this.AddEditGroupForm.get('groupName').setErrors({ isExists: true });
      this.AppNotificationService.NotifyError('Visitor Tag with same name already exists.');
      return;
    }

    this.formService.CallFormMethod<IGroupFormGroup>(request).then((response) => {
      const groupRequest = this.GetGroupRequest(response, response.id);
      this.workFlowService.EditGroup(groupRequest);
      this.CloseModalAndResetForm();
    });
  }

  Delete(id: string): void {
    this.workFlowService.DeleteGroup(id);
  }

  private GetGroupRequest(response: IGroupFormGroup, id: string): GroupRequest {
    return {
      id: id,
      groupName: response.groupName,
      groupColor: response.groupColor
    };
  }

  OpenModal() {
    this.OpenGroupModalSubject.next(true);
  }

  CloseModal() {
    this.OpenGroupModalSubject.next(false);
  }

  CloseModalAndResetForm() {
    this.OpenGroupModalSubject.next(false);
    this.AddEditGroupForm.reset();
  }
}
