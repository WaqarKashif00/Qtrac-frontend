import { Component, Input } from '@angular/core';
import { ServiceBoxControl } from '../../../../Models/controls/service-box.control';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { PreServiceQuestionService } from '../../pre-service-question.service';

@Component({
  selector: 'lavi-pre-service-question-item',
  templateUrl: './pre-service-question-item.component.html',
})
export class PreServiceQuestionItemComponent extends AbstractComponent {
  @Input() Control: ServiceBoxControl;
  constructor(private service: PreServiceQuestionService) {
    super();
  }
  Init() {
    this.subs.sink = this.Control.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.Control, this.Control.form);
      this.service.UpdateData();
    });
  }
}
