import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Mode } from 'src/app/models/enums/mode.enum';
import { WorkflowValidationMessage } from 'src/app/models/validation-message/workflow-message';
import { closest, tableRow } from 'src/app/shared/utility-functions/grid-utility-functions';
import { PreServiceQuestion } from '../../../../models/common/work-flow-detail.interface';
import { WorkflowMessages } from '../../message-constant';
import { SupportedLanguage } from '../../models/supported-language';
import { SurveyQuestionSetService } from '../survey-question-set.service';


@Component({
  selector: 'lavi-add-survey-question-set',
  templateUrl: './add-survey-question-set.component.html',
  styleUrls: ['./add-survey-question-set.component.scss', '../../work-flow-configuration/work-flow-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class AddSurveyQuestionSetComponent extends AbstractComponent {

  private currentSubscription: Subscription;

  @Input() IsSurveyQuestionSetDialogOpen: boolean;
  @Input() SupportedLanguages: SupportedLanguage[];
  @Input() Questions: PreServiceQuestion[] = [];
  @Input() Mode: string;
  @Output() Save: EventEmitter<void> = new EventEmitter();
  @Output() Close: EventEmitter<void> = new EventEmitter();
  @Input() QuestionTabSelected: boolean;

  IsAddQuestionsVisibe$: Observable<boolean>;
  IsAddQuestionsVisible = false;
  Actions = [];
  DefaultAction = { text: WorkflowMessages.DefaultSelectActionMessage, value: null };
  WorkFlowMessage = WorkflowValidationMessage;
  IsSaveClicked = false;
  QuestionSetName: string;
  state: State = {
    skip: 0,
    take: 100
  };
  questionData: any = process(this.Questions, this.state);

  get QuestionMode() {
    return this.surveyQuestionSetService.QuestionMode;
  }

  get AddEditQuestionSetForm() {
    return this.surveyQuestionSetService.AddEditQuestionSetForm;
  }

  get IsAddQuestionErrorMessageVisible() {
    return this.surveyQuestionSetService.IsQuestionsEmpty();
  }

  constructor(private surveyQuestionSetService: SurveyQuestionSetService,
    private renderer: Renderer2, private zone: NgZone, private ref: ChangeDetectorRef) {
    super();
    this.IsSaveClicked = false;
    this.IsAddQuestionsVisibe$ = this.surveyQuestionSetService.IsAddQuestionsVisibe$;
    this.subs.sink = this.IsAddQuestionsVisibe$.subscribe(
      x => {
        this.IsAddQuestionsVisible = x;
      }
    );

    this.surveyQuestionSetService.IsSaveClicked$.subscribe(
      x => {
        this.IsSaveClicked = false;
      }
    );
  }

  onChange(color: string): void {
    this.ref.detectChanges();
  }

  ngAfterViewInit(): void {
    this.currentSubscription = this.handleDragAndDrop();
  }

  ngOnDestroy(): void {
    this.currentSubscription?.unsubscribe();
  }

  ngOnChanges(args) {
    this.questionData = process(this.Questions, this.state);

    this.ref.detectChanges();
    if (args.Questions?.previousValue && args.Questions?.currentValue) {
      if (args.Questions.previousValue.length != args.Questions.currentValue.length) {
        this.currentSubscription = this.handleDragAndDrop();
      } else
        if (this.Questions?.length > 0 &&
          (args.Questions?.previousValue?.length == this.Questions?.length)
        ) {
          this.currentSubscription.unsubscribe();
          this.currentSubscription = this.handleDragAndDrop();
        }
    }
  }

  ApplyChanges() {
    this.Save.emit();
  }

  AddQuestionInList() {
    this.IsSaveClicked = true;
  }

  ModalClose() {
    this.AddEditQuestionSetForm.controls.id.reset();
    this.Close.emit();
  }

  AddQuestion() {
    this.IsSaveClicked = false;
    this.surveyQuestionSetService.InitRequiredAddQuestionConfigurations();
    this.IsAddQuestionsVisible = true;
  }

  EditQuestion(preServiceQuestion: PreServiceQuestion) {
    this.IsSaveClicked = false;
    this.surveyQuestionSetService.InitAndSetEditQuestionData(preServiceQuestion);
    this.IsAddQuestionsVisible = true;
  }

  CLoseAddQuestion() {
    this.IsAddQuestionsVisible = false;
  }

  DeleteQuestion(id: string, setId: string) {
    this.surveyQuestionSetService.DeleteQuestion(id, setId);
    this.surveyQuestionSetService.InitRequiredAddQuestionConfigurations();
    this.IsAddQuestionsVisible = false;
  }

  SaveQuestion(form: FormGroup) {
    if (this.QuestionMode === Mode.Add) {
      this.surveyQuestionSetService.AddQuestion(form);
    }
    if (this.QuestionMode === Mode.Edit) {
      this.surveyQuestionSetService.EditQuestion(form);
    }
  }

  CancelQuestion() {
    this.surveyQuestionSetService.InitRequiredAddQuestionConfigurations();
  }

  rowCallback(context: RowClassArgs) {

    return {
      dragging: context.dataItem?.dragging
    };
  }

  dataStateChange(state: State): void {

    this.state = state;
    this.questionData = process(this.Questions, this.state);
    this.currentSubscription.unsubscribe();
    this.zone.onStable.pipe(take(1))
      .subscribe(() => this.currentSubscription = this.handleDragAndDrop());
  }

  private handleDragAndDrop(): Subscription {

    const sub = new Subscription(() => { });
    let draggedItemIndex;

    const tableRows = Array.from(document.querySelectorAll('#question-grid tr'));

    tableRows.forEach(item => {
      this.renderer.setAttribute(item, 'draggable', 'true');
      const dragStart = fromEvent<DragEvent>(item, 'dragstart');
      const dragOver = fromEvent(item, 'dragover');
      const dragEnd = fromEvent(item, 'dragend');
      const drop = fromEvent(item, 'drop');


      let element;
      sub.add(dragStart.pipe(
        tap(({ dataTransfer }) => {
          try {
            element?.setAttribute('style', 'position: absolute; display: block; top: 0; left: 0; width: 1000px; height: 100px;');
            document.body.appendChild(element);
            dataTransfer.setDragImage(element, 0, 0);

          } catch (err) {
            // IE doesn't support setDragImage
          }
          try {
            // Firefox won't drag without setting data
            dataTransfer.setData('application/json', '{}');
          } catch (err) {
            // IE doesn't support MIME types in setData
          }
        })
      ).subscribe(({ target }) => {
        const row: HTMLTableRowElement = target as HTMLTableRowElement;
        draggedItemIndex = row.rowIndex;
        let dataItem = this.questionData.data[draggedItemIndex];
        if (!dataItem) {
          const newrow = row.parentNode.parentNode as HTMLTableRowElement;
          draggedItemIndex = newrow.rowIndex;
          dataItem = this.questionData.data[draggedItemIndex];
        }
        if (dataItem) {
          dataItem.dragging = true;
        }
      }));

      sub.add(dragOver.subscribe((e: any) => {
        element = e;
        e.preventDefault();
        const dataItem = this.questionData.data.splice(draggedItemIndex, 1)[0];
        const dropIndex = closest(e.target, tableRow).rowIndex;

        draggedItemIndex = dropIndex;

        this.zone.run(() => {
          if (dataItem) {
            this.questionData.data.splice(dropIndex, 0, dataItem);
            this.ref.detectChanges();
          }
        });
      }));

      sub.add(dragEnd.subscribe((e: any) => {
        e.preventDefault();
        const dataItem = this.questionData.data[draggedItemIndex];
        if (dataItem) {
          dataItem.dragging = false;
        }
        this.surveyQuestionSetService.changeListData(this.questionData.data);
        this.ref.detectChanges();
      }));
      sub.add(
        drop.subscribe((e: any) => {
          e.preventDefault();
        })
      );
    });

    return sub;
  }

}
