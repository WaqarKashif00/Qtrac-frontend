import { IService } from './service.interface';
import { IServiceQuestion } from './service-questions.interface';
import { IPreServiceQuestion } from './pre-service-question.interface';
import { IThankYouPage } from './thank-you-page.interface';
import { IWelcomePage } from './welcome-page.interface';
import { DesignerPanelControl } from './controls/designer-panel.control';
import { ILanguagePage } from './language-page.interface';
import { PageProperties } from './controls/page-properties';
import { INoQueuePage } from './no-queue-page.interface';
import { IOffLinePage } from './off-line-page.interface';

export interface IKioskPageData {
  DesignerScreen: DesignerPanelControl;
  PageProperties: PageProperties;
  ServiceData: IService;
  ServiceQuestionData: IServiceQuestion;
  PreServiceQuestionData: IPreServiceQuestion;
  ThankYouPageData: IThankYouPage;
  WelcomePageData: IWelcomePage;
  LanguagePageData: ILanguagePage;
  NoQueuePageData: INoQueuePage;
  OffLinePageData: IOffLinePage;
}
