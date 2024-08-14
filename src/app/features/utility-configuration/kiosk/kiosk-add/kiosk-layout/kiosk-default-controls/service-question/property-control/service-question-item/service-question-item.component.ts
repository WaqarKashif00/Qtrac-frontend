import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ServiceBoxControl } from '../../../../Models/controls/service-box.control';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { ServiceQuestionService } from '../../service-question.service';

@Component({
  selector: 'lavi-service-question-item',
  templateUrl: './service-question-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceQuestionItemComponent extends AbstractComponent {
  @Input() Control: ServiceBoxControl;
  constructor(private service: ServiceQuestionService) {
    super();
  }
  Init() {
    this.subs.sink = this.Control.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.Control, this.Control.form);
      this.service.UpdateData();
    });
  }
}
