import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Mode } from 'src/app/models/enums/mode.enum';
import { Queue } from '../../../models/common/work-flow-detail.interface';
import { QueuesService } from './queues.service';

@Component({
  selector: 'lavi-queues',
  templateUrl: './queues.component.html',
  providers: [QueuesService],
  styleUrls: ['../work-flow-configuration/work-flow-configuration.component.scss']
})
export class QueuesComponent extends AbstractComponent {

  OpenQueueDialog: boolean;
  get Mode() {
    return this.queueService.Mode;
  }
  queuesList$: Observable<Queue[]>;
  OpenQueueDialog$: Observable<boolean>;
  SingleNumberingFormatEnabled$: Observable<boolean>;

  constructor(private queueService: QueuesService) {
    super();
    this.queuesList$ = queueService.queuesList$;
    this.OpenQueueDialog$ = queueService.OpenQueueDialog$;
    this.SingleNumberingFormatEnabled$ = queueService.SingleNumberingFormatEnabled$;
  }

  get QueuesSubject(){
    return this.queueService.QueuesSubject;
  }
  OpenAddQueue() {
    this.queueService.Mode = Mode.Add;
    this.queueService.OpenModal();
  }

  closeModal() {
    this.queueService.CloseModalAndResetForm();
  }

  Edit(queue: Queue) {
    this.queueService.Mode = Mode.Edit;
    this.queueService.SetEditData(queue);
    this.queueService.OpenModal();
  }

  Save(form: FormGroup) {
    if (this.Mode === Mode.Add) {
      this.queueService.Add(form);
    }
    if (this.Mode === Mode.Edit) {
      this.queueService.Edit(form);
    }
  }

  Delete(id: string) {
    this.queueService.Delete(id);
  }

}
