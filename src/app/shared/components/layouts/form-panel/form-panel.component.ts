import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-form-panel',
  templateUrl: './form-panel.component.html',
})
export class FormPanelComponent extends AbstractComponent {
  @Input() PanelHeader: string;
  @Input() PanelExpand: boolean;

  @Output() PanelExpandChange: EventEmitter<boolean>=new EventEmitter<boolean>();
  IsPanelClicked: boolean;

  constructor() {
    super();
    this.IsPanelClicked = true;
  }

  ShowPanel1() {
    if (!this.PanelExpand && this.IsPanelClicked) {
      this.PanelExpand = true;
      this.PanelExpandChange.emit(this.PanelExpand)
    }
    this.IsPanelClicked = true;
  }

  StateChange() {
    this.PanelExpand = !this.PanelExpand;
    this.IsPanelClicked = false;
    this.PanelExpandChange.emit(this.PanelExpand)
  }
}
