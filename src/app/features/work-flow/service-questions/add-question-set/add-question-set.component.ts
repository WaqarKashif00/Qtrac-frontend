import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { GroupResult, process, State } from '@progress/kendo-data-query';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ActionType } from 'src/app/models/enums/action-type.enum';
import { Mode } from 'src/app/models/enums/mode.enum';
import { WorkflowValidationMessage } from 'src/app/models/validation-message/workflow-message';
import { ConditionRouting, PreServiceQuestion } from '../../../../models/common/work-flow-detail.interface';
import { WorkflowMessages } from '../../message-constant';
import { SupportedLanguage } from '../../models/supported-language';
import { QuestionSetService } from '../question-set.service';

const tableRow = node => node.tagName.toLowerCase() === 'tr';
const closest = (node, predicate) => {
    while (node && !predicate(node)) {
        node = node.parentNode;
    }
    return node;
};
@Component({
  selector: 'lavi-add-question-set',
  templateUrl: './add-question-set.component.html',
  styleUrls: ['./add-question-set.component.scss', '../../work-flow-configuration/work-flow-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class AddQuestionSetComponent extends AbstractComponent {
  get QuestionMode() {
    return this.questionSetService.QuestionMode;
  }
  get ConditionalRoutingMode() {
    return this.questionSetService.ConditionalRoutingMode;
  }
  get ActionMode() {
    return this.questionSetService.ActionMode;
  }
  get AddEditQuestionSetForm() {
    return this.questionSetService.AddEditQuestionSetForm;
  }

  get ActionsFormArray() {
    return this.questionSetService.ActionsFormArray;
  }
  get ConditionFormControl() {
    return this.questionSetService.AddEditQuestionSetForm.get('conditionRouting.condition');
  }
  get IsQueryBuilderVisible() {
    return this.questionSetService.AddEditQuestionSetForm.get('conditionRouting.isConditionalRouting').value;
  }
  get IsAddQuestionErrorMessageVisible() {
    return this.questionSetService.IsQuestionsEmpty();
  }
  get IsColorPickerControlVisible() {
    return this.ActionTypeFormControlValue === ActionType.Flag;
  }
  get IsRoutingControlVisible() {
    return this.ActionTypeFormControlValue === ActionType.Routing;
  }
  get ActionTypeFormControlValue() {
    const actionType = this.questionSetService.ActionTypeFormControl.value;
    return actionType ? actionType.value : '';
  }
  get ActionErrorMessage() {
    return this.questionSetService.ActionErrorMessage;
  }
  get QueryBuilderError() {
    return this.ConditionFormControl?.errors?.empty;
  }

  constructor(private questionSetService: QuestionSetService,
              private renderer: Renderer2,  private zone: NgZone, private ref: ChangeDetectorRef) {
    super();
    this.Actions = this.questionSetService.GetActions();
    this.IsSaveClicked = false;
    this.IsAddQuestionsVisibe$ = this.questionSetService.IsAddQuestionsVisibe$;
    this.subs.sink = this.IsAddQuestionsVisibe$.subscribe(
      x => {
        this.IsAddQuestionsVisibe = x;
      }
    );

    this.questionSetService.IsSaveClicked$.subscribe(
      x => {
        this.IsSaveClicked = false;
      }
    );
  }

  @Input() isSQuestionSetDialogOpen: boolean;
  @Input() SupportedLanguages: SupportedLanguage[];
  @Input() Questions: PreServiceQuestion[] = [];
  @Input() ConditionRoutings: ConditionRouting[];
  @Input() Mode: string;
  @Output() Save: EventEmitter<void> = new EventEmitter();
  @Output() Close: EventEmitter<void> = new EventEmitter();
  @Input() Routings: GroupResult[];
  @Input() QuestionTabSelected: boolean;

  private currentSubscription: Subscription;
  IsAddQuestionsVisibe$: Observable<boolean>;
  IsAddQuestionsVisibe= false;
  Actions = [];
  DefaultAction = { text: WorkflowMessages.DefaultSelectActionMessage, value: null };
  WorkFlowMessage = WorkflowValidationMessage;
  IsSaveClicked= false;
  QuestionSetName: string;

  public state: State = {
    skip: 0,
    take: 100
  };
  public questionData: any = process(this.Questions, this.state);

  public ngAfterViewInit(): void {
    this.currentSubscription = this.handleDragAndDrop();
  }

  public ngOnDestroy(): void {
    this.currentSubscription?.unsubscribe();
  }

  public ngOnChanges(args){
    this.questionData = process(this.Questions, this.state);

    this.ref.detectChanges();
    if (args.Questions?.previousValue && args.Questions?.currentValue){
      if (args.Questions.previousValue.length != args.Questions.currentValue.length){
        this.currentSubscription = this.handleDragAndDrop();
      }else
      if ( this.Questions?.length > 0 &&
          (args.Questions?.previousValue?.length == this.Questions?.length)
          ){
            this.currentSubscription.unsubscribe();
            this.currentSubscription = this.handleDragAndDrop();
      }
    }
  }

  ApplyChanges() {
    this.Save.emit();
  }

  AddQuestionInList(){
    this.IsSaveClicked = true;
  }

  ModalClose(){
    this.AddEditQuestionSetForm.controls.id.reset();
    this.Close.emit();
  }

  AddQuestion() {
    this.IsSaveClicked = false;
    this.questionSetService.InitRequiredAddQuestionConfigurations();
    this.IsAddQuestionsVisibe = true;
  }

  EditQuestion(preServiceQuestion: PreServiceQuestion) {
    this.IsSaveClicked = false;
    this.questionSetService.InitAndSetEditQuestionData(preServiceQuestion);
    this.IsAddQuestionsVisibe = true;
  }

  CLoseAddQuestion(){
    this.IsAddQuestionsVisibe = false;
  }

  DeleteQuestion(id: string,setId:string) {
      this.questionSetService.DeleteQuestion(id,setId);
      this.questionSetService.InitRequiredAddQuestionConfigurations();
      this.IsAddQuestionsVisibe = false;
  }

  SaveQuestion(form: FormGroup) {
    if (this.QuestionMode === Mode.Add) {
      this.questionSetService.AddQuestion(form);
    }
    if (this.QuestionMode === Mode.Edit) {
      this.questionSetService.EditQuestion(form);
    }
  }

  CancelQuestion() {
    this.questionSetService.InitRequiredAddQuestionConfigurations();
  }

  AddConditionRouting() {
    this.questionSetService.ResetConditionRoutingFormGroupAndMode();
  }

  EditConditionRouting(conditionRouting: ConditionRouting) {
    this.questionSetService.SetEditConditionRoutingFormGroupAndMode(conditionRouting);
  }

  DeleteConditionRouting(index: number) {
    if (confirm(WorkflowMessages.ConfirmDeleteMessage)) {
      this.questionSetService.DeleteConditionRouting(index);
      this.questionSetService.ResetConditionRoutingFormGroupAndMode();
    }
  }

  SaveConditionalRouting() {
    if (this.ConditionalRoutingMode === Mode.Add) {
      this.questionSetService.AddConditionalRouting();
    }
    if (this.ConditionalRoutingMode === Mode.Edit) {
      this.questionSetService.EditConditionalRouting();
    }
  }

  CancelConditionRouting() {
    this.questionSetService.ResetConditionRoutingFormGroupAndMode();
  }

  AddAction() {
    this.questionSetService.ValidateThenAddAction();
  }

  EditAction(index: number) {
    this.questionSetService.EditAction(index);
  }

  UpdateAction() {
    this.questionSetService.UpdateAction();
  }

  DeleteAction(index: number) {
    if (confirm(WorkflowMessages.ConfirmDeleteMessage)) {
      this.questionSetService.DeleteAction(index);
    }
  }

  IsRoutingActionType(actionType: string) {
    return this.questionSetService.IsRoutingActionType(actionType);
  }

  IsAlertActionType(actionType: string) {
    return this.questionSetService.IsAlertActionType(actionType);
  }

  IsFlagActionType(actionType: string) {
    return this.questionSetService.IsFlagActionType(actionType);
  }

  public onChange(color: string): void {
    this.ref.detectChanges();
  }

public rowCallback(context: RowClassArgs) {

  return {
      dragging: context.dataItem?.dragging
  };
}

public dataStateChange(state: State): void {

  this.state = state;
  this.questionData = process(this.Questions, this.state);
  this.currentSubscription.unsubscribe();
  this.zone.onStable.pipe(take(1))
      .subscribe(() => this.currentSubscription = this.handleDragAndDrop());
}

private handleDragAndDrop(): Subscription {

  const sub = new Subscription(() => {});
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
          const row: HTMLTableRowElement =  target as HTMLTableRowElement;
          draggedItemIndex = row.rowIndex;
          let dataItem = this.questionData.data[draggedItemIndex];
          if (!dataItem){
            const newrow  = row.parentNode.parentNode as HTMLTableRowElement;
            draggedItemIndex = newrow.rowIndex;
            dataItem = this.questionData.data[draggedItemIndex];
          }
          if (dataItem){
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
            if (dataItem){
              this.questionData.data.splice(dropIndex, 0, dataItem);
              this.ref.detectChanges();
            }
          });
      }));

      sub.add(dragEnd.subscribe((e: any) => {
          e.preventDefault();
          const dataItem = this.questionData.data[draggedItemIndex];
          if (dataItem){
            dataItem.dragging = false;
          }
          this.questionSetService.changeListData(this.questionData.data);
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
