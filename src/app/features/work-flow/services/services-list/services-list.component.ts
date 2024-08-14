import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  Output,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { fromEvent, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { WorkflowMessages } from '../../message-constant';
import { Service } from '../../../../models/common/work-flow-detail.interface';
import { ServiceService } from '../service.service';
import { WorkFlowService } from '../../work-flow.service';
import { RoutingType } from 'src/app/models/enums/route-type.enum';

const tableRow = (node) => node.tagName.toLowerCase() === 'tr';
const closest = (node, predicate) => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }
  return node;
};
@Component({
  selector: 'lavi-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: [
    './services-list.component.scss',
    '../../work-flow-configuration/work-flow-configuration.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ServicesListComponent extends AbstractComponent {
  constructor(
    private serviceService: ServiceService,
    private renderer: Renderer2,
    private workflowservice:WorkFlowService,
    private zone: NgZone,
    private changeDetect: ChangeDetectorRef
  ) {
    super();
  }

  @Input() serviceList: Service[] = [];
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() copyService: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<string> = new EventEmitter();
  private currentSubscription: Subscription; 
  public state: State = {
    skip: 0,
    take: 100,
  };

  public gridData: any = process(this.serviceList?.filter(x=>!x.isDeleted), this.state);

  public ngAfterViewInit(): void {
    this.currentSubscription = this.handleDragAndDrop();
  }

  public ngOnDestroy(): void {
    this.currentSubscription?.unsubscribe();
  }

  ScheduleTypeText(service: Service) {
    if (!service) {
      return '';
    }
    if (service.acceptAppointments && service.acceptWalkins) {
      return WorkflowMessages.AppointmentAndWalkinsMessage;
    }
    if (service.acceptAppointments) {
      return WorkflowMessages.AppointmentOnlyMessage;
    }
    if (service.acceptWalkins) {
      return WorkflowMessages.WalkinsOnlyMessage;
    }
  }

  GetRoutingType(service: Service) {
    if (!service?.routing) {
      return WorkflowMessages.NoRoutingSpecifiedMessage;
    }
    if(service?.routing?.group == RoutingType.Queue){
      return this.workflowservice?.QueuesSubject?.value?.find(x=>x.id==service.routing.id)?.name
    }else{
    return this.workflowservice?.QuestionSetsSubject?.value?.find(x=>x.id==service?.routing?.id)?.questionSetName
    }
  }

  IsNoRoutingSpecifiedType(service: Service) {
    const routingType = this.GetRoutingType(service);
    return routingType === WorkflowMessages.NoRoutingSpecifiedMessage;
  }

  Edit(service) {
    this.edit.emit(service);
  }

  Copy(service) {
    this.copyService.emit(service);
  }

  Delete(id: string) {
      this.delete.emit(id);
  }

  public ngOnChanges(args) {
    this.gridData = process(this.serviceList?.filter(x=>!x.isDeleted), this.state);

    this.changeDetect.detectChanges();
    if (args.serviceList?.previousValue && args.serviceList?.currentValue) {
      if (
        args.serviceList.previousValue.length !=
        args.serviceList.currentValue.length
      ) {
        this.currentSubscription = this.handleDragAndDrop();
      } else if (
        this.serviceList?.length > 0 &&
        args.serviceList?.previousValue?.length == this.serviceList?.length
      ) {
        this.currentSubscription.unsubscribe();
        this.currentSubscription = this.handleDragAndDrop();
      }
    }
  }

  public rowCallback(context: RowClassArgs) {
    return {
      dragging: context.dataItem?.dragging,
    };
  }

  public dataStateChange(state: State): void {
    this.state = state;
    this.gridData = process(this.serviceList?.filter(x=>!x.isDeleted), this.state);
    this.currentSubscription.unsubscribe();
    this.zone.onStable
      .pipe(take(1))
      .subscribe(() => (this.currentSubscription = this.handleDragAndDrop()));
  }

  private handleDragAndDrop(): Subscription {
    const sub = new Subscription(() => {});
    let draggedItemIndex;

    const tableRows = Array.from(document.querySelectorAll('.k-grid tr'));
    tableRows.forEach((item) => {
      this.renderer.setAttribute(item, 'draggable', 'true');
      const dragStart = fromEvent<DragEvent>(item, 'dragstart');
      const dragOver = fromEvent(item, 'dragover');
      const drop = fromEvent(item, 'drop');
      const dragEnd = fromEvent(item, 'dragend');

      let element;
      sub.add(
        dragStart
          .pipe(
            tap(({ dataTransfer }) => {
              try {
                element?.setAttribute(
                  'style',
                  'position: absolute; display: block; top: 0; left: 0; width: 1000px; height: 100px;'
                );
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
          )
          .subscribe(({ target }) => {
            const row: HTMLTableRowElement = target as HTMLTableRowElement;
            draggedItemIndex = row.rowIndex;
            let dataItem = this.gridData.data[draggedItemIndex];
            if (!dataItem) {
              const newrow = row.parentNode.parentNode as HTMLTableRowElement;
              draggedItemIndex = newrow.rowIndex;
              dataItem = this.gridData.data[draggedItemIndex];
            }
            if (dataItem) {
              dataItem.dragging = true;
            }
          })
      );

      sub.add(
        dragOver.subscribe((e: any) => {
          element = e;
          e.preventDefault();
          const dataItem = this.gridData.data.splice(draggedItemIndex, 1)[0];
          const dropIndex = closest(e.target, tableRow).rowIndex;

          draggedItemIndex = dropIndex;

          this.zone.run(() => {
            if (dataItem) {
              this.gridData.data.splice(dropIndex, 0, dataItem);
              this.changeDetect.detectChanges();
            }
          });
        })
      );

      sub.add(
        dragEnd.subscribe((e: any) => {
          e.preventDefault();
          const dataItem = this.gridData.data[draggedItemIndex];
          if (dataItem) {
            dataItem.dragging = false;
          }
          this.serviceService.changeListData(this.gridData.data);
          this.changeDetect.detectChanges();
        })
      );
      sub.add(
        drop.subscribe((e: any) => {
          e.preventDefault();
        })
      );
    });

    return sub;
  }
}
