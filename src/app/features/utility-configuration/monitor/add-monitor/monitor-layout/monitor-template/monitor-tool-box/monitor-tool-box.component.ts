import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { MonitorTemplateService } from '../monitor-template-service';

@Component({
  selector: 'lavi-monitor-tool-box',
  templateUrl: './monitor-tool-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorToolBoxComponent extends AbstractComponent {
  @Input() DivLayoutDesignContainer: Component;

  constructor(private template: MonitorTemplateService) {
    super();
  }

  OnImageDrop(event) {
    this.template.AddNewImageControl(event);
  }
  OnLabelDrop(event) {
    this.template.AddNewLabelControl(event);
  }
  OnSliderDrop(event) {
    this.template.AddNewSliderControl(event);
  }
  OnVideoDrop(event) {
    this.template.AddNewVideoControl(event);
  }
}
