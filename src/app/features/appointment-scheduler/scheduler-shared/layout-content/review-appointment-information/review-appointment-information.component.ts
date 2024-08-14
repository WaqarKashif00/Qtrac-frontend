import { ChangeDetectionStrategy, Component, OnInit,   Input, } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ICurrentLanguage } from '../../../models/current-language.interface';

@Component({
  selector: 'lavi-review-appointment-information',
  templateUrl: './review-appointment-information.component.html',
  styleUrls: ['./review-appointment-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewAppointmentInformationComponent extends AbstractComponent {

  @Input() SelectedLanguage: ICurrentLanguage;
  @Input() headerText: string;
  constructor() {
    super();
  }
}
