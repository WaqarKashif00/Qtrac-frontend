import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { State, process } from '@progress/kendo-data-query';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { QuestionSet } from '../../../../models/common/work-flow-detail.interface';
import { QuestionSetService } from '../question-set.service';

@Component({
  selector: 'lavi-service-question-list',
  templateUrl: './service-question-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./service-question-list.component.scss', '../../work-flow-configuration/work-flow-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ServiceQuestionListComponent extends AbstractComponent {
  constructor(private changeDetect: ChangeDetectorRef, private questionSetService: QuestionSetService) {
    super();
  }

  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<string> = new EventEmitter();
  @Input() QuestionSets: QuestionSet[] = [];
  public state: State = {
    skip: 0,
    take: 100
  };

  public gridData: any = process(this.QuestionSets?.filter(x=>!x.isDeleted), this.state);


  public ngOnChanges(args){
    this.gridData = process(this.QuestionSets?.filter(x=>!x.isDeleted), this.state);

    this.changeDetect.detectChanges();
  }

  Edit(questionSet: any) {
    this.edit.emit(questionSet);
  }

  Delete(id: string) {
    this.delete.emit(id);
  }


  GetRoutingCountAndNames(id:string){
    return this.questionSetService.GetRoutingCountAndNames(id);
  }

}
