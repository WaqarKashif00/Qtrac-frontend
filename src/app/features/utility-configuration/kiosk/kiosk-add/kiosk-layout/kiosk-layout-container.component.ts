import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { LanguageService } from './kiosk-default-controls/language/language.service';
import { NoQueueService } from './kiosk-default-controls/no-queue/no-queue.service';
import { OffLineService } from './kiosk-default-controls/off-line/off-line.service';
import { PreServiceQuestionService } from './kiosk-default-controls/pre-service-question/pre-service-question.service';
import { ServiceQuestionService } from './kiosk-default-controls/service-question/service-question.service';
import { ServicesService } from './kiosk-default-controls/service/services.service';
import { ThankYouService } from './kiosk-default-controls/thank-you/thank-you.service';
import { WelcomeService } from './kiosk-default-controls/welcome/welcome.service';
import { KioskLayoutService } from './kiosk-layout.service';
import { IPage } from './Models/pages.interface';

@Component({
  selector: 'lavi-kiosk-layout-container',
  templateUrl: './kiosk-layout-container.component.html',
  styleUrls: ['./kiosk-layout-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    KioskLayoutService,
    WelcomeService,
    PreServiceQuestionService,
    ServiceQuestionService,
    ServicesService,
    ThankYouService,
    LanguageService,
    NoQueueService,
    OffLineService,
  ],
})
export class KioskContainerComponent extends AbstractComponent {
  Page$: Observable<IPage>;
  SelectedLanguage$: Observable<string>;
  IsOnlyGrid$: Observable<boolean>;
  GridSize$: Observable<number>;

  constructor(private kioskLayoutService: KioskLayoutService) {
    super();
    this.Page$ = this.kioskLayoutService.CurrentPage$;
    this.SelectedLanguage$ = this.kioskLayoutService.SelectedLanguage$;
    this.IsOnlyGrid$ = this.kioskLayoutService.IsOnlyGrid$;
    this.GridSize$ = this.kioskLayoutService.GridSize$;
  }
  Init() {
  }
  Destroy() {
  }
}
