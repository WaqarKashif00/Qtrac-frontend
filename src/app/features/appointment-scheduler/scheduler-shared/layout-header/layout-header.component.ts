import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { CompanyAPIService } from 'src/app/shared/api-services/company-api.service';
import { AppointmentSchedulerExecutionsService } from '../../scheduler-execution/scheduler-execution.service';
const translatedLanguageName = require('../../../../../assets/own-language-translator/own-language-translator.json');


@Component({
  selector: 'lavi-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHeaderComponent extends AbstractComponent {
  @Input() Color: string;
  @Input() BackgroundColor: string;
  @Input() LogoURL: string;
  DefaultLanguage$: Observable<any>;
  LanguageList: any;
  LanguageList$: Observable<any>;
  @Input() comingFrom: string;

  SelectedLanguage$: Observable<any>;
  SelectedLanguageSubject: BehaviorSubject<any>
  translatedLanguageName = translatedLanguageName;
  languageArray = Object.values(this.translatedLanguageName);
  defaultLanguage: String;

  constructor(private readonly companyAPIService: CompanyAPIService, private service: AppointmentSchedulerExecutionsService) {

    super();
    this.initializeBehaviorSubject()
    this.getLanguages();

  }

  initializeBehaviorSubject() {
    this.SelectedLanguageSubject = new BehaviorSubject<any>(
      { language: 'English', languageCode: 'en', isDefault: true }
    );
    this.SelectedLanguage$ = this.SelectedLanguageSubject.asObservable();
  }

  getLanguages() {
    this.service.LanguageList$.subscribe((data) => {
      data.forEach((x) => {
        if (x.isDefault === true) {
          return this.SelectedLanguageSubject?.next(x)
        }
      })

      this.LanguageList = data.filter((x) => !x.isDefault === true)

    });


  }
  updateLanguage(e) {
    this.service.UpdateLanguage(e.languageCode)
  }
  Init(): void {
  }


}
