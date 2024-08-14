import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { DesignerPanelControl } from '../../../models/controls/designer-panel.control';
import { FooterControl } from '../../../models/controls/footer.control';
import { HeaderControl } from '../../../models/controls/header.control';
import { IMobilePageDetails } from '../../../models/pages.interface';
import { GlobalQuestionService } from './mobile-default-controls/global-question/global-question.service';
import { LanguageService } from './mobile-default-controls/language/language.service';
import { NoQueueService } from './mobile-default-controls/no-queue/no-queue.service';
import { ServiceQuestionService } from './mobile-default-controls/service-question/service-question.service';
import { ServicesService } from './mobile-default-controls/service/services.service';
import { TicketService } from './mobile-default-controls/ticket/ticket.service';
import { WelcomeService } from './mobile-default-controls/welcome/welcome.service';
import { TemplateLayoutService } from './template-layout.service';
import { SurveyQuestionService } from './mobile-default-controls/survey-question/survey-question.service';
import { IMobileOffLinePageService } from './mobile-default-controls/off-line/off-line.service'

@Component({
  selector: 'lavi-template-layout',
  templateUrl: 'template-layout.component.html',
  providers: [
    TemplateLayoutService,
    ServicesService,
    GlobalQuestionService,
    ServiceQuestionService,
    WelcomeService,
    TicketService,
    LanguageService,
    NoQueueService,
    SurveyQuestionService,
    IMobileOffLinePageService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateLayoutComponent extends AbstractComponent {
  DesignerPanel$: Observable<DesignerPanelControl>;
  CurrentPage$: Observable<IMobilePageDetails>;
  HeaderControl$: Observable<HeaderControl>;
  FooterControl$: Observable<FooterControl>;
  constructor(private templateLayoutService: TemplateLayoutService) {
    super();
    this.InitializeObservables();
  }
  InitializeObservables() {
    this.DesignerPanel$ = this.templateLayoutService.DesignerPanel$;
    this.CurrentPage$ = this.templateLayoutService.CurrentPage$;
    this.HeaderControl$ = this.templateLayoutService.HeaderControl$;
    this.FooterControl$ = this.templateLayoutService.FooterControl$;
  }
  test() {
    alert()
  }
}
