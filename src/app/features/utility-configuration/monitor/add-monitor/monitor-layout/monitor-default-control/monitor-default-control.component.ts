import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IControlSelection } from '../Models/controls-selection.interface';
import { DesignerPanelControl } from '../Models/controls/designer-panel.control';
import { MonitorPropertyService } from '../monitor-template/monitor-property/monitor-property.service';

@Component({
  selector: 'lavi-monitor-default-control',
  templateUrl: './monitor-default-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MonitorPropertyService],
})
export class MonitorDefaultControlComponent extends AbstractComponent {

  @Input() DesignerPanel: DesignerPanelControl;
  @Input() ControlSelection: IControlSelection
}
