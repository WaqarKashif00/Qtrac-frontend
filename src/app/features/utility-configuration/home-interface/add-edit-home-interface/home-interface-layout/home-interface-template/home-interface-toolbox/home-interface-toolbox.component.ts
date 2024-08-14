import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from '../../../../../../../base/abstract-component';
import { HomeInterfaceTemplateService } from '../home-interface-template.service';

@Component({
  selector: 'lavi-home-interface-toolbox',
  templateUrl: './home-interface-toolbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeInterfaceToolBoxComponent extends AbstractComponent {
  @Input() DivLayoutDesignContainer;

  constructor(private templateService: HomeInterfaceTemplateService) {
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
