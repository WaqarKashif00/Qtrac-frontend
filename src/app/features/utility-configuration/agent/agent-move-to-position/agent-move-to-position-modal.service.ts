import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AgentAPIService } from 'src/app/shared/api-services/agent-api.service';
import { ClassicAgentService } from '../classic-agent-template/classic-agent.service';
import { IAgentCustomersListItem } from '../models/agent-models';
import { MoveToPositionDirection } from '../models/move-to-position/move-to-position-direction.enum';
import { PostMoveToPosition } from '../models/move-to-position/move-to-position-post.model';
import { QueueSignalRService } from '../utility-services/services/agent-signalR/queue-signalr.service';
import { AgentStationDataService } from '../utility-services/services/agent-station-data-service/agent-station-data.service';

@Injectable()
export class AgentAgentMoveToPositionModalService extends AbstractComponentService {
  CurrentCustomer: IAgentCustomersListItem;
  CustomerDisplayField: string;

  IsDialogShowSubject: BehaviorSubject<boolean>;
  IsDialogShow$: Observable<boolean>;

  CustomerNameSubject: BehaviorSubject<string>;
  CustomerName$: Observable<string>;

  MoveForm: FormGroup;

  get ApiBaseUrl() {
    return this.appConfigService.config.AzureFunctionBaseAPIUrl;
  }

  private ShowUnread: boolean;

  /**
   *
   */
  constructor(
    private agentAPIService: AgentAPIService,
    private queueSignalRService: QueueSignalRService,
    private classicService: ClassicAgentService,
    private stationDetails: AgentStationDataService
  ) {
    super();
    this.SetObservables();
    this.InitializeForm();
    this.ShowUnread = false;
  }

  SetObservables(): void {
    this.IsDialogShowSubject = new BehaviorSubject<boolean>(false);
    this.IsDialogShow$ = this.IsDialogShowSubject.asObservable();

    this.CustomerNameSubject = new BehaviorSubject<string>('');
    this.CustomerName$ = this.CustomerNameSubject.asObservable();
  }

  InitializeForm(): void {
    this.MoveForm = this.formBuilder.group({
      numberOfPlacesToMove: [null, [Validators.required]],
    });
    this.MoveForm.reset();

    this.subs.sink = this.IsDialogShow$.subscribe((x) => {
      this.MoveForm.reset();
    });
  }

  ShowMoveToPositionDialog(customer: IAgentCustomersListItem) {
    this.CurrentCustomer = customer;
    this.CustomerNameSubject.next(this.GetCustomerName());
    this.IsDialogShowSubject.next(true);
  }

  GetCustomerName(): string {
    if (this.CurrentCustomer) {
      const displayFields = this.CurrentCustomer?.displayFields[0]?.answer;
      return displayFields ? displayFields : this.CurrentCustomer?.ticketNumber;
    }
    return '';
  }

  CloseDialog(): void {
    this.IsDialogShowSubject.next(false);
  }

  MoveToBack(): void {
    const postModel: PostMoveToPosition = {
      branchId: this.stationDetails.BranchId,
      companyId: this.authService.CompanyId,
      workflowId: this.stationDetails.WorkflowId,
      requestId: this.CurrentCustomer.id,
      direction: MoveToPositionDirection.END,
      numberOfPlacesToMove: 0,
    };

    this.agentAPIService
      .ChangeCustomerPosition<PostMoveToPosition>(
        postModel.companyId,
        this.authService.UserId,
        postModel.branchId,
        this.stationDetails.TemplateId,
        postModel
      )
      .subscribe((response) => {
        this.queueSignalRService.UpdateQueue(response.Queue);
        if (response.Customer) {
          this.classicService.OnRequestAdded([response.Customer]);
        }
        this.AppNotificationService.Notify(
          'Visitor moved to back successfully.'
        );
        this.CloseDialog();
      });
  }
  MoveToFront(): void {
    const postModel: PostMoveToPosition = {
      branchId: this.stationDetails.BranchId,
      companyId: this.authService.CompanyId,
      workflowId: this.stationDetails.WorkflowId,
      requestId: this.CurrentCustomer.id,
      direction: MoveToPositionDirection.START,
      numberOfPlacesToMove: 0,
    };

    this.agentAPIService
      .ChangeCustomerPosition<PostMoveToPosition>(
        postModel.companyId,
        this.authService.UserId,
        postModel.branchId,
        this.stationDetails.TemplateId,
        postModel
      )
      .subscribe((response) => {
        this.queueSignalRService.UpdateQueue(response.Queue);
        if (response.Customer) {
          this.classicService.OnRequestAdded([response.Customer]);
        }
        this.AppNotificationService.Notify(
          'Visitor moved to front successfully.'
        );
        this.CloseDialog();
      });
  }
  MoveDown(): void {
    this.formService.CallFormMethod(this.MoveForm).then((response) => {
      const postModel: PostMoveToPosition = {
        branchId: this.stationDetails.BranchId,
        companyId: this.authService.CompanyId,
        workflowId: this.stationDetails.WorkflowId,
        requestId: this.CurrentCustomer.id,
        direction: MoveToPositionDirection.DOWN,
        numberOfPlacesToMove: this.GetNumberOfPlaces(),
      };

      this.agentAPIService
        .ChangeCustomerPosition<PostMoveToPosition>(
          postModel.companyId,
          this.authService.UserId,
          postModel.branchId,
          this.stationDetails.TemplateId,
          postModel
        )
        .subscribe((response) => {
          this.queueSignalRService.UpdateQueue(response.Queue);
          if (response.Customer) {
            this.classicService.OnRequestAdded([response.Customer]);
          }
          this.AppNotificationService.Notify(
            'Visitor moved down successfully.'
          );
          this.CloseDialog();
        });
    });
  }
  MoveUp(): void {
    this.formService.CallFormMethod(this.MoveForm).then((response) => {
      const postModel: PostMoveToPosition = {
        branchId: this.stationDetails.BranchId,
        companyId: this.authService.CompanyId,
        workflowId: this.stationDetails.WorkflowId,
        requestId: this.CurrentCustomer.id,
        direction: MoveToPositionDirection.UP,
        numberOfPlacesToMove: this.GetNumberOfPlaces(),
      };

      this.agentAPIService
        .ChangeCustomerPosition<PostMoveToPosition>(
          postModel.companyId,
          this.authService.UserId,
          postModel.branchId,
          this.stationDetails.TemplateId,
          postModel
        )
        .subscribe((response) => {
          this.queueSignalRService.UpdateQueue(response.Queue);
          if (response.Customer) {
            this.classicService.OnRequestAdded([response.Customer]);
          }
          this.AppNotificationService.Notify('Visitor moved up successfully.');
          this.CloseDialog();
        });
    });
  }

  private GetNumberOfPlaces(): number {
    if (this.MoveForm) {
      const Places = this.MoveForm.get('numberOfPlacesToMove').value;
      return Number(Places || 0);
    }
    return 0;
  }
}
