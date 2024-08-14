import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IMobileMoveEvent } from '../../../../models/mobile-move-event.interface';
import { TemplateLayoutService } from '../template-layout.service';

@Injectable()
export class ToolBoxService extends AbstractComponentService {
  constructor(private templateService: TemplateLayoutService) {
    super();
  }
  AddNewImageControl(event: IMobileMoveEvent) {
    this.templateService.AddNewImageControl(event);
  }
  AddNewLabelControl(event: IMobileMoveEvent) {
    this.templateService.AddNewLabelControl(event);
  }
  AddNewSliderControl(event: IMobileMoveEvent) {
    this.templateService.AddNewSliderControl(event);
  }
  AddNewVideoControl(event: IMobileMoveEvent) {
    this.templateService.AddNewVideoControl(event);
  }
}
