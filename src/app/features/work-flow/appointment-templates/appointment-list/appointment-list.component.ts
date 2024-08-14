import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output,  ViewEncapsulation } from '@angular/core';
import { State, process } from '@progress/kendo-data-query';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { WorkflowMessages } from '../../message-constant';
import { AppointmentTemplate } from '../../models/work-flow-request.interface';


@Component({
    selector: 'lavi-appointment-template-list',
    templateUrl: './appointment-list.component.html',
    styleUrls: ['./appointment-list.component.scss', '../../work-flow-configuration/work-flow-configuration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default
  })
export class AppointTemplateListComponent extends AbstractComponent {

    constructor(private changeDetect: ChangeDetectorRef){
        super();
    }
  @Input() AppointmentTemplates: AppointmentTemplate[] = [];
  @Output() Edit: EventEmitter<AppointmentTemplate> = new EventEmitter();
  @Output() Delete: EventEmitter<string> = new EventEmitter();
    public state: State = {
      skip: 0,
      take: 100
    };
    gridData = process(this.AppointmentTemplates?.filter(x=>!x.isDeleted), this.state);


    public ngOnChanges(args){
      this.gridData = process(this.AppointmentTemplates?.filter(x=>!x.isDeleted), this.state);

      this.changeDetect.detectChanges();

    }

    DeleteAppointmentTemplate(id: string) {
          this.Delete.emit(id);
      }

    EditAppointmentTemplate(queue: AppointmentTemplate) {
      this.Edit.emit(queue);
    }

}
