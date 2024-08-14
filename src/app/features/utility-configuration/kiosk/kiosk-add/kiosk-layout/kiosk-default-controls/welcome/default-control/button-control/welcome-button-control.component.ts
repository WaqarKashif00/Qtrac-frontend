import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMoveEvent } from 'src/app/features/utility-configuration/monitor/add-monitor/monitor-layout/Models/move-event.interface';
import { ButtonControl } from '../../../../Models/controls/button.control';

@Component({
  selector: 'lavi-welcome-button-control',
  templateUrl: './welcome-button-control.component.html',
})
export class WelcomeButtonControlComponent extends AbstractComponent {
  @Input() Buttons: ButtonControl[];
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Input() GridSize = 50;
  @Input() IsOnlyGrid: boolean = false;
  @Input() DivLayoutDesignContainer: Component;
  @Output() ButtonResizeStop = new EventEmitter<[IResizeEvent, string]>();
  @Output() ButtonMoveEnd = new EventEmitter<[IMoveEvent, string]>();
  @Output() ButtonClick = new EventEmitter<void>();

  OnButtonMoveEnd(event: IMoveEvent, name: string) {
    event = {
      x: event.x < 0 ? 0 : Math.round(event.x),
      y: event.y < 0 ? 0 : Math.round(event.y),
    };
    this.ButtonMoveEnd.emit([event, name]);
  }
  OnButtonResizeStop(event: IResizeEvent, name: string) {
    this.ButtonResizeStop.emit([event, name]);
  }
  
  GetUrl(src) {
    return (
      src?.find((x) => x.languageCode === this.SelectedLanguage)?.url || ''
    );
  }
}
