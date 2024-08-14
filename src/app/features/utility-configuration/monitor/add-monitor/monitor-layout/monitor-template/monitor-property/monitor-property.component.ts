import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { DDLControl } from '../../Models/drop-down-control.interface';
import { Observable } from 'rxjs';
import { DesignerPanelControl } from '../../Models/controls/designer-panel.control';
import { MonitorPropertyService } from './monitor-property.service';
import { IControlSelection } from '../../Models/controls-selection.interface';

@Component({
  selector: 'lavi-monitor-property',
  templateUrl: './monitor-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MonitorPropertyService],
})
export class MonitorPropertyComponent extends AbstractComponent {
  Controls$: Observable<Array<DDLControl>>;
  DesignerPanel$: Observable<DesignerPanelControl>;
  IsEditMode$: Observable<boolean>;
  ControlSelection$: Observable<IControlSelection>;
  QueueData$:Observable<any>;

  constructor(private propertyService: MonitorPropertyService) {
    super();
    this.Controls$ = this.propertyService.AllControls$;
    this.DesignerPanel$ = this.propertyService.DesignerPanel$;
    this.IsEditMode$ = this.propertyService.IsEditMode$;
    this.ControlSelection$=this.propertyService.ControlSelection$;
    this.QueueData$ = this.propertyService.QueueData$

  }

  OnControlDropdownChange(event) {
    this.propertyService.ShowCurrentSelectOtherControlPropertyWindow(
      event.target.value
    );
  }
}
