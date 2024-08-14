import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { fromEvent, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { PreServiceQuestion } from '../../../../models/common/work-flow-detail.interface';
import { QuestionType } from '../../../../models/enums/question-type.enum';
import { PreServiceQuestionService } from '../pre-service-question.service';

const tableRow = node => node.tagName.toLowerCase() === 'tr';
const closest = (node, predicate) => {
    while (node && !predicate(node)) {
        node = node.parentNode;
    }
    return node;
};
@Component({
  selector: 'lavi-pre-service-questions-list',
  templateUrl: './pre-service-questions-list.component.html',
  styleUrls: ['./pre-service-questions-list.component.scss', '../../work-flow-configuration/work-flow-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class PreServiceQuestionsListComponent extends AbstractComponent {

  constructor(private preServiceQuestionService: PreServiceQuestionService ,
              private renderer: Renderer2,  private zone: NgZone, private changeDetect: ChangeDetectorRef) {
    super();
  }

  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<string> = new EventEmitter();
  @Input() preServiceQuestionList: PreServiceQuestion[] = [];
  private currentSubscription: Subscription;


  public state: State = {
    skip: 0,
    take: 100
  };

  public gridData: any = process(this.preServiceQuestionList?.filter(x => !x.isDeleted), this.state);

  public ngAfterViewInit(): void {
    this.currentSubscription = this.handleDragAndDrop();
  }

  public ngOnDestroy(): void {
    this.currentSubscription?.unsubscribe();
  }

  public ngOnChanges(args){
    this.gridData = process(this.preServiceQuestionList?.filter(x => !x.isDeleted), this.state);
    this.changeDetect.detectChanges();

    if (args.preServiceQuestionList?.previousValue && args.preServiceQuestionList?.currentValue){
      if (args.preServiceQuestionList.previousValue.length != this.preServiceQuestionList?.length){
        this.currentSubscription = this.handleDragAndDrop();
      }else
      if ( this.preServiceQuestionList?.length > 0 &&
          (args.preServiceQuestionList?.previousValue?.length == this.preServiceQuestionList?.length)
          ){
            this.currentSubscription.unsubscribe();
            this.currentSubscription = this.handleDragAndDrop();
      }
    }
  }

  Edit(preServiceQuestion) {
    this.edit.emit(preServiceQuestion);
  }

  Delete(id: string) {
      this.delete.emit(id);
  }

  GetQuestionTypeEnumText(typeValue: string) {
    const type = this.preServiceQuestionService.GetQuestionTypes()
      .find(questionType => questionType.value === typeValue);
    return type ? type.text : '';
  }

  public rowCallback(context: RowClassArgs) {
    return {
        dragging: context.dataItem?.dragging
    };
  }

  public GetDisplayType(type: string) {
    if (type === QuestionType.SMSPhoneNumber.value){
      return 'SMSENABLEDPHONE';
    }
    if (type === QuestionType.PhoneNumber.value){
      return 'NONSMSPHONE';
    }
    return type;
  }

  public dataStateChange(state: State): void {

    this.state = state;
    this.gridData = process(this.preServiceQuestionList?.filter(x => !x.isDeleted), this.state);
    this.currentSubscription.unsubscribe();
    this.zone.onStable.pipe(take(1))
        .subscribe(() => this.currentSubscription = this.handleDragAndDrop());
  }

  private handleDragAndDrop(): Subscription {

    const sub = new Subscription(() => {});
    let draggedItemIndex;

    const tableRows = Array.from(document.querySelectorAll('.k-grid tr'));
    tableRows.forEach(item => {
        this.renderer.setAttribute(item, 'draggable', 'true');
        const dragStart = fromEvent<DragEvent>(item, 'dragstart');
        const dragOver = fromEvent(item, 'dragover');
        const drop = fromEvent(item, 'drop');
        const dragEnd = fromEvent(item, 'dragend');

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
            let dataItem = this.gridData.data[draggedItemIndex];
            if (!dataItem){
              const newrow  = row.parentNode.parentNode as HTMLTableRowElement;
              draggedItemIndex = newrow.rowIndex;
              dataItem = this.gridData.data[draggedItemIndex];
            }
            if (dataItem){
              dataItem.dragging = true;
            }
        }));

        sub.add(dragOver.subscribe((e: any) => {
            element = e;
            e.preventDefault();
            const dataItem = this.gridData.data.splice(draggedItemIndex, 1)[0];
            const dropIndex = closest(e.target, tableRow).rowIndex;

            draggedItemIndex = dropIndex;

            this.zone.run(() => {
              if (dataItem){
                this.gridData.data.splice(dropIndex, 0, dataItem);
                this.changeDetect.detectChanges();
              }
            });
        }));

        sub.add(dragEnd.subscribe((e: any) => {
            e.preventDefault();
            const dataItem = this.gridData.data[draggedItemIndex];
            if (dataItem){
              dataItem.dragging = false;
            }
            this.preServiceQuestionService.changeListData(this.gridData.data);
            this.changeDetect.detectChanges();
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
