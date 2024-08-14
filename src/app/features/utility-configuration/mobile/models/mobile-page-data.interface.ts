import { DesignerPanelControl } from './controls/designer-panel.control';
import { FooterControl } from './controls/footer.control';
import { HeaderControl } from './controls/header.control';
import { PageProperties } from './controls/page-properties';
import { IGlobalQuestionPageData } from './mobile-global-question-page-data.interface';
import { ILanguagePageData } from './mobile-language-page-data.interface';
import { IMarketingPageData } from './mobile-marketing-page-data.interface';
import { INoQueuePageData } from './mobile-no-queue-page-data.interface';
import { IServicePageData } from './mobile-service-page-data.interface';
import { IServiceQuestionPageData } from './mobile-service-question-page-data.interface';
import { ISurveyPageData } from './mobile-survey-page-data.interface';
import { IThankYouPageData } from './mobile-thank-you-page-data.interface';
import { ITicketPageData } from './mobile-ticket-page-data.interface';
import { IWelcomePageData } from './mobile-welcome-page-data.interface';
import { IOffLinePage } from './off-line-page.interface';

export interface IMobileData {
  headerData: HeaderControl;
  footerData: FooterControl;
  designerScreen: DesignerPanelControl;
  pageProperties: PageProperties;
  servicePageData: IServicePageData;
  welcomePageData: IWelcomePageData;
  languagePageData: ILanguagePageData;
  globalQuestionPageData: IGlobalQuestionPageData;
  serviceQuestionPageData: IServiceQuestionPageData;
  marketingPageData: IMarketingPageData;
  ticketPageData: ITicketPageData;
  thankYouPageData: IThankYouPageData;
  noQueuePageData: INoQueuePageData;
  surveyPageData: ISurveyPageData;
  offLinePageData: IOffLinePage
}
