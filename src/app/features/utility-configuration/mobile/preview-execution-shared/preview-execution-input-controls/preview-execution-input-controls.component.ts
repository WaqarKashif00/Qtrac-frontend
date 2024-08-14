import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Validations } from 'src/app/models/constants/validation.constant';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import {
  IMobilePreviewPanelData,
  IMobilePreviewPanelItemsData,
  IMobilePreviewPanelQItemsData,
} from '../../models/mobile-preview-data.interface';
import { AppointmentTextEnum, AppointmentTextTypeEnum } from 'src/app/features/appointment-scheduler/models/enum/appointment-text.enum';
import { AppointmentTextInterface } from 'src/app/features/appointment-scheduler/models/appointment-text.interface';
import { TranslateService } from 'src/app/core/services/translate.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'lavi-preview-execution-input-controls',
  templateUrl: './preview-execution-input-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./preview-execution-input-controls.component.scss'],
})
export class PreviewExecutionInputControlsComponent extends AbstractComponent {
  constructor(

    private readonly translateApiService: TranslateService,
  ) {
    super();
    // this.SetTheQueryParamValues();
    this.InitializeSubjects();
  }
  @Input() Item: IMobilePreviewPanelQItemsData;
  @Input() Panel: IMobilePreviewPanelData;
  @Input() IsNextButtonClick: boolean;
  @Input() DefaultCountry: string;
  @Input() SelectedLanguage: string;
  @Input() companyId: string

  public AppointmentTextsSubject: BehaviorSubject<AppointmentTextInterface>;

  autoComplete = false;
  InitializeSubjects() {
    this.AppointmentTextsSubject = new BehaviorSubject<AppointmentTextInterface>(this.getDefaultTexts());
  }
  Init(): void {

    this.Item.isValid = true;
    if (this.SelectedLanguage && this.companyId && this.SelectedLanguage !== "en") {
      this.getTranslatedMultipleTexts(this.SelectedLanguage);
    } else {
      this.AppointmentTextsSubject.next(this.getDefaultTexts());
    }

  }
  ValidationPatterns = Validations;
  ValidationMessage: string;
  QuestionType = QuestionType;


  PhoneNumberChanged(phoneNumber: string) {
    this.Item.answer = phoneNumber;
    this.Item.isValid = true;
  }
  InvalidPhoneNumberChanged(phoneNumber: string) {
    this.ValidationMessage = (phoneNumber)
      ? ValidationMessages.PhoneNumber.Invalid
      : (this.Item.required)
        ? ValidationMessages.PhoneNumber.Required
        : '';
    this.Item.answer = phoneNumber;
    this.Item.isValid = false;

  }

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


  keyPressLength(event) {
    if (this.Item.itemTypeSetting == 1) {
      const maxLength = 1; // set your desired max length here
      const input = event.target.value;

      if (input.length >= maxLength) {
        this.autoComplete = false;
        event.target.value = input.slice(0, maxLength);
        this.Item.answer = this.Item.answer.slice(0, 1);
      }
      else {
        this.autoComplete = true;
      }

    }
  }

  getTranslatedMultipleTexts(languageId: string): any {
    this.translateApiService.TranslateMultipleTexts(this.getMultipleTextTranslateBody(), languageId, this.companyId, true).subscribe((response: AppointmentTextInterface) => {
      this.AppointmentTextsSubject.next(response);
    });
  }

  getDefaultTexts(): AppointmentTextInterface {
    return {
      [AppointmentTextTypeEnum.appointmentRequiredSpecificFieldErrorMessageType]: AppointmentTextEnum.appointmentRequiredSpecificFieldErrorMessageText,
      [AppointmentTextTypeEnum.appointmentWrongPhoneType]: AppointmentTextEnum.appointmentWrongPhoneText,
      [AppointmentTextTypeEnum.appointmentWrongEmailType]: AppointmentTextEnum.appointmentWrongEmailText,
    };
  }

  getMultipleTextTranslateBody(): Array<object> {
    const translatedTextBody = [

      {
        text: AppointmentTextEnum.appointmentRequiredSpecificFieldErrorMessageText,
        type: AppointmentTextTypeEnum.appointmentRequiredSpecificFieldErrorMessageType,
      },
      {
        text: AppointmentTextEnum.appointmentWrongPhoneText,
        type: AppointmentTextTypeEnum.appointmentWrongPhoneType,
      },
      {
        text: AppointmentTextEnum.appointmentWrongEmailText,
        type: AppointmentTextTypeEnum.appointmentWrongEmailType,
      },

    ];
    return translatedTextBody;

  }


}
export const ValidationMessages = {
  Email: {
    Required: 'Email Required.',
    Invalid: 'Invalid Email.'
  },
  PhoneNumber: {
    Required: 'Phone Number Required.',
    Invalid: 'Invalid Phone Number.'
  }
};
