import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AgentAgentMoveToPositionModalService } from './agent-move-to-position-modal.service';

@Component({
  selector: 'lavi-move-to-position-modal',
  templateUrl: './agent-move-to-position-modal.component.html',
  styleUrls: ['./agent-move-to-position-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentMoveToPositionModalComponent extends AbstractComponent {
  IsDialogShow$: Observable<boolean>;
  CustomerName$: Observable<string>;
  MoveForm: FormGroup;

  constructor(private service: AgentAgentMoveToPositionModalService) {
    super();
    this.SetObservables();
    this.MoveForm = this.service.MoveForm;
  }

  SetObservables() {
    this.IsDialogShow$ = this.service.IsDialogShow$;
    this.CustomerName$ = this.service.CustomerName$;
  }



  Close(): void {
    this.service.CloseDialog();
  }

  MoveUp(): void {
    this.service.MoveUp();
  }

  MoveDown(): void {
    this.service.MoveDown();
  }

  MoveToFront(): void {
    this.service.MoveToFront();
  }

  MoveToBack(): void {
    this.service.MoveToBack();
  }
}