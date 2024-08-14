import {
  Component,
  Input,
  Output,
  ChangeDetectionStrategy,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { ServicePanelControl } from '../../../../Models/controls/service-panel.control';
import { ServiceQuestionService } from '../../service-question.service';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';

@Component({
  selector: 'lavi-service-question-panel',
  templateUrl: './service-question-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceQuestionPanelComponent extends AbstractComponent {
  @Input() Panel: ServicePanelControl;
  @Output() OnChangeMode = new EventEmitter<string>();
    constructor(private service: ServiceQuestionService, private changeDetector: ChangeDetectorRef) {
    super();
  }

  Init() {
    this.subs.sink = this.Panel.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.Panel, this.Panel.form);
      this.service.UpdatePanelData();
    });
  }

  ChangeMode(event) {
    this.service.ChangeMode(event.target.value);
  }

  ChangeColorPicker() {
    this.changeDetector.detectChanges();
  }
}
