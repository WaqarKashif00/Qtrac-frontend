import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ToolBoxService } from './toolbox.service';

@Component({
  selector: 'lavi-mobile-toolbox',
  templateUrl: 'toolbox.component.html',
  providers: [ToolBoxService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolBoxComponent extends AbstractComponent {
  @Input() DivLayoutDesignContainer: Component;

  constructor(private templateService: ToolBoxService) {
    super();
  }
  OnImageDrop(event) {
    this.templateService.AddNewImageControl(event);
  }
  OnLabelDrop(event) {
    this.templateService.AddNewLabelControl(event);
  }
  OnSliderDrop(event) {
    this.templateService.AddNewSliderControl(event);
  }
  OnVideoDrop(event) {
    this.templateService.AddNewVideoControl(event);
  }
}
