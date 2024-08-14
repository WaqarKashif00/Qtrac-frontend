import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { ServicePanelControl } from '../../../../Models/controls/service-panel.control';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { PreServiceQuestionService } from '../../pre-service-question.service';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';

@Component({
  selector: 'lavi-pre-service-question-panel',
  templateUrl: './pre-service-question-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreServiceQuestionPanelComponent extends AbstractComponent {
  @Input() Panel: ServicePanelControl;
  @OnChange('OnIsPanelExpandPropertyChange')
  @Input() IsPanelExpand: boolean;

  @Output() IsPanelExpandChange = new EventEmitter<boolean>();

    constructor(private service: PreServiceQuestionService, private changeDetector: ChangeDetectorRef) {
    super();
  }

  Init() {
    this.subs.sink = this.Panel.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.Panel, this.Panel.form);
      this.service.UpdatePanelData();
    });
  }

  OnChangeMode(event) {
    this.service.ChangeMode(event.target.value);
  }
  OnIsPanelExpandPropertyChange() {
    this.IsPanelExpandChange.emit(this.IsPanelExpand);
  }

  ChangeColorPicker() {
    this.changeDetector.detectChanges();
  }
}
