import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { CountryCodes } from 'src/app/models/constants/general-properties.constant';
import { IQuestionItem } from '../../../models/scheduler-execution-data.interface';
import { ICurrentLanguage } from '../../../models/current-language.interface';
import { AppointmentTextInterface } from '../../../models/appointment-text.interface';

@Component({
  selector: 'lavi-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentFormComponent extends AbstractComponent {
  @Input() ServiceQuestions: IQuestionItem[];
  @Input() GlobalQuestions: IQuestionItem[];
  @Input() branchCountryCode: String;
  @Input() IsServiceQuestionShow: boolean;
  @Input() IsGlobalQuestionShow: boolean;
  @Input() SelectedLanguage: ICurrentLanguage;
  @Input() headerText: string;
  @Input() AppointmentTexts: AppointmentTextInterface;
  @Input() customerAppointmentId: String;

  @Output() ControlDataChange: EventEmitter<string> = new EventEmitter();

  constructor() {
    super();
  }

  countryCode: Array<number> = CountryCodes;

  replaceURLs(message) {
    if (!message) return;

    var urlRegex = /(((http(s?):\/\/)|(www\.))[^\s]+)/g;
    return message.replace(urlRegex, function (url) {
      var hyperlink = url;
      if (!hyperlink.match('^https?://')) {
        hyperlink = 'https://' + hyperlink;
      }
      return (
        '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
      );
    });
  }

  ControlChange(id: string) {
    this.ControlDataChange.emit(id);
  }
}
