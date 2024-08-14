import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input,  Output, ViewEncapsulation } from '@angular/core';
import { State, process } from '@progress/kendo-data-query';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Queue } from '../../../../models/common/work-flow-detail.interface';

@Component({
  selector: 'lavi-queues-list',
  templateUrl: './queues-list.component.html',
  styleUrls: ['./queues-list.component.scss', '../../work-flow-configuration/work-flow-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class QueuesListComponent extends AbstractComponent {

  constructor(private changeDetect: ChangeDetectorRef){
    super();
  }

  @Input() Queues: Queue[] = [];
  @Input() HideNumberingFormat: boolean;
  @Output() Edit: EventEmitter<Queue> = new EventEmitter();
  @Output() Delete: EventEmitter<string> = new EventEmitter();
  public state: State = {
    skip: 0,
    take: 100
  };
  public gridData: any = process(this.Queues?.filter(x => !x.isDeleted), this.state);

  public ngOnChanges(args){
    this.gridData = process(this.Queues?.filter(x => !x.isDeleted), this.state);

    this.changeDetect.detectChanges();

  }

  DeleteQueue(id: string) {
      this.Delete.emit(id);
  }

  EditQueue(queue: Queue) {
    this.Edit.emit(queue);
  }

}
