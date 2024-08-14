import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { process, State } from '@progress/kendo-data-query';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { SurveyQuestionSet } from '../../../../models/common/work-flow-detail.interface';
import { SurveyQuestionSetService } from '../survey-question-set.service';

@Component({
  selector: 'lavi-survey-question-list',
  templateUrl: './survey-question-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./survey-question-list.component.scss', '../../work-flow-configuration/work-flow-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SurveyQuestionListComponent extends AbstractComponent {
  
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<string> = new EventEmitter();
  @Input() QuestionSets: SurveyQuestionSet[] = [];
  public state: State = {
    skip: 0,
    take: 100
  };

  public gridData: any = process(this.QuestionSets?.filter(x=>!x.isDeleted), this.state);
  
  constructor(private changeDetect: ChangeDetectorRef, private surveyQuestionSetService: SurveyQuestionSetService) {
    super();
  }

  ngOnChanges(args){
    this.gridData = process(this.QuestionSets?.filter(x=>!x.isDeleted), this.state);

    this.changeDetect.detectChanges();
  }

  Edit(questionSet: any) {
    this.edit.emit(questionSet);
  }

  Delete(id: string) {
    this.delete.emit(id);
  }
}
