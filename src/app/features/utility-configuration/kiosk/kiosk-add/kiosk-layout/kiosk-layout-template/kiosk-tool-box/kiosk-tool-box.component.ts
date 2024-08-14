import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { KioskTemplateService } from '../kiosk-template.service';

@Component({
  selector: 'lavi-kiosk-tool-box',
  templateUrl: './kiosk-tool-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskToolBoxComponent extends AbstractComponent {
  @Input() DivLayoutDesignContainer: Component;

  constructor(private kioskTemplate: KioskTemplateService) {
    super();
  }

  OnImageDrop(event) {
    this.kioskTemplate.AddNewImageControl(event);
  }
  OnLabelDrop(event) {
    this.kioskTemplate.AddNewLabelControl(event);
  }
  OnSliderDrop(event) {
    this.kioskTemplate.AddNewSliderControl(event);
  }
  OnVideoDrop(event) {
    this.kioskTemplate.AddNewVideoControl(event);
  }
}
