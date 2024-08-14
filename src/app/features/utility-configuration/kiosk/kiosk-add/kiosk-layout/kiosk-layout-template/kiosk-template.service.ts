import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { RoundOffProperty } from 'src/app/core/utilities/core-utilities';
import { ILanguageControl } from '../../../../../../models/common/language-control.interface';
import {
  SupportedImageFileSize,
  SupportedImageFileTypes
} from '../../../../../../models/constants/valid-file-types-and-sizes.constant';
import { requiredFileType } from '../../../../../../shared/validators/common.validator';
import { DynamicVariable } from '../../../../../work-flow/models/conditional-events';
import { KioskLayoutService } from '../kiosk-layout.service';
import { ButtonControl } from '../Models/controls/button.control';
import { Control } from '../Models/controls/control';
import { DesignerPanelControl } from '../Models/controls/designer-panel.control';
import { ImageControl } from '../Models/controls/image.control';
import { LabelControl } from '../Models/controls/label.control';
import { PageProperties } from '../Models/controls/page-properties';
import { SliderControl } from '../Models/controls/slider.control';
import { VideoControl } from '../Models/controls/video.control';
import { DDLControl } from '../Models/drop-down-control.interface';
import { IKioskPageData } from '../Models/kiosk-page-data.interface';
import { ILanguagePage } from '../Models/language-page.interface';
import { IMoveEvent } from '../Models/move-event.interface';
import { INoQueuePage } from '../Models/no-queue-page.interface';
import { IOffLinePage } from '../Models/off-line-page.interface';
import { IPage } from '../Models/pages.interface';
import { IPreServiceQuestion } from '../Models/pre-service-question.interface';
import { IServiceQuestion } from '../Models/service-questions.interface';
import { IService } from '../Models/service.interface';
import { ISupportedLanguage } from '../Models/supported-language.interface';
import { IThankYouPage } from '../Models/thank-you-page.interface';
import { IWelcomePage } from '../Models/welcome-page.interface';

@Injectable()
export class KioskTemplateService extends AbstractComponentService {
  /* #region  Subject Declaration */
  private DesignerPanelSubject: BehaviorSubject<DesignerPanelControl>;
  DesignerPanel$: Observable<DesignerPanelControl>;
  private PagePropertiesSubject: BehaviorSubject<PageProperties>;
  PageProperties$: Observable<PageProperties>;
  private ServicePageDataSubject: BehaviorSubject<IService>;
  ServicePageData$: Observable<IService>;
  private WelcomePageDataSubject: BehaviorSubject<IWelcomePage>;
  WelcomePgeData$: Observable<IWelcomePage>;
  private ThankYouPageDataSubject: BehaviorSubject<IThankYouPage>;
  ThankYouData$: Observable<IThankYouPage>;
  private ServiceQuestionDataSubject: BehaviorSubject<IServiceQuestion>;
  ServiceQuestionData$: Observable<IServiceQuestion>;
  private PreServiceQuestionDataSubject: BehaviorSubject<IPreServiceQuestion>;
  PreServiceQuestionData$: Observable<IPreServiceQuestion>;
  LanguageList$: Observable<ISupportedLanguage[]>;
  private LanguagePageDataSubject: BehaviorSubject<ILanguagePage>;
  LanguagePageData$: Observable<ILanguagePage>;
  private ImageFormArraySubject: BehaviorSubject<FormArray>;
  ImageFormArray$: Observable<FormArray>;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;
  IsEditMode$: Observable<boolean>;
  DynamicVariables$: Observable<DynamicVariable[]>;
  Page$: Observable<IPage>;
  private NoQueuePageDataSubject: BehaviorSubject<INoQueuePage>;
  NoQueuePageData$: Observable<INoQueuePage>;
  private OffLinePageDataSubject: BehaviorSubject<IOffLinePage>;
  OffLinePageData$: Observable<IOffLinePage>;
  /* #endregion */

  /* #region  Service Property Declarations*/
  KioskData: IKioskPageData;
  Page: IPage;
  FontStyles = {
    fontSize: 13,
    fontStyle: 'Normal',
    font: 'Arial',
    fontWeight: 'normal',
  };

  ButtonStyles = {
    color: '#fee060',
    BGColor: '#435d92',
    width: '100',
    height: '50',
    fontSize: this.FontStyles.fontSize,
    fontStyle: this.FontStyles.fontStyle,
    font: this.FontStyles.font,
    fontWeight: this.FontStyles.fontWeight,
  };

  Button1 = 'Button 1';
  NextButtonText = { en: 'Next' };
  Languages = [];

  IsOnlyGrid: boolean = false;
  GridSize: number = 50;
  Alignment = 'center';
  BackgoundColor='rgba(0, 0, 0, 0)';

  get Workflow() {
    return this.kioskLayoutService.WorkFlow;
  }
  /* #endregion */

  /* #region  Start Life Cycle */

  constructor(private kioskLayoutService: KioskLayoutService) {
    super();
    this.InitializeProperties();
  }

  private InitializeProperties() {
    this.InitializeSubjects();
    this.SubscribeTheLayoutDesignerObservable();
  }

  private InitializeSubjects() {
    this.DesignerPanelSubject = new BehaviorSubject<DesignerPanelControl>(null);
    this.DesignerPanel$ = this.DesignerPanelSubject.asObservable();
    this.PagePropertiesSubject = new BehaviorSubject<PageProperties>(null);
    this.PageProperties$ = this.PagePropertiesSubject.asObservable();
    this.ServicePageDataSubject = new BehaviorSubject<IService>(null);
    this.ServicePageData$ = this.ServicePageDataSubject.asObservable();
    this.WelcomePageDataSubject = new BehaviorSubject<IWelcomePage>(
      this.GetWelcomePageData()
    );
    this.WelcomePgeData$ = this.WelcomePageDataSubject.asObservable();
    this.ThankYouPageDataSubject = new BehaviorSubject<IThankYouPage>(
      this.GetThankYouPageData()
    );
    this.ThankYouData$ = this.ThankYouPageDataSubject.asObservable();
    this.PreServiceQuestionDataSubject =
      new BehaviorSubject<IPreServiceQuestion>(null);
    this.PreServiceQuestionData$ =
      this.PreServiceQuestionDataSubject.asObservable();
    this.ServiceQuestionDataSubject = new BehaviorSubject<IServiceQuestion>(
      null
    );
    this.ServiceQuestionData$ = this.ServiceQuestionDataSubject.asObservable();
    this.LanguagePageDataSubject = new BehaviorSubject<ILanguagePage>(
      this.GetLanguagePageData()
    );
    this.LanguagePageData$ = this.LanguagePageDataSubject.asObservable();
    this.NoQueuePageDataSubject = new BehaviorSubject<INoQueuePage>(
      this.GetNoQueuePageData()
    );
    this.NoQueuePageData$ = this.NoQueuePageDataSubject.asObservable();
    this.OffLinePageDataSubject = new BehaviorSubject<IOffLinePage>(
      this.GetOffLinePageData()
    );
    this.OffLinePageData$ = this.OffLinePageDataSubject.asObservable();
    this.ImageFormArraySubject = new BehaviorSubject<FormArray>(
      this.formBuilder.array([])
    );
    this.ImageFormArray$ = this.ImageFormArraySubject.asObservable();
    this.LanguageList$ = this.kioskLayoutService.LanguageList$.pipe(
      tap((lang) => {
        this.Languages = lang;
      })
    );
    this.SelectedLanguage$ = this.kioskLayoutService.SelectedLanguage$;
    this.DefaultLanguage$ = this.kioskLayoutService.DefaultLanguage$;
    this.IsEditMode$ = this.kioskLayoutService.IsEditMode$;
    this.DynamicVariables$ = this.kioskLayoutService.DynamicVariables$;

    this.subs.sink = this.kioskLayoutService.IsOnlyGrid$.subscribe((data) => {
      this.IsOnlyGrid = data;
    });
    this.subs.sink = this.kioskLayoutService.GridSize$.subscribe((data) => {
      this.GridSize = data;
    });

    this.Page$ = this.kioskLayoutService.CurrentPage$;
  }

  private SubscribeTheLayoutDesignerObservable() {
    this.subs.sink = this.kioskLayoutService.KioskData$.subscribe(
      (x: IKioskPageData) => {
        this.KioskData = x;
      }
    );
    this.kioskLayoutService.CurrentPage$.subscribe((x) => {
      this.Page = x;
      if (this.Page?.IsServicePage) {
        this.AddServicePageDataToSubject();
      } else if (this.Page?.IsWelcomePage) {
        this.AddWelcomePageDataToSubject();
      } else if (this.Page?.IsThankYouPage) {
        this.AddThankYouPageDataToSubject();
      } else if (this.Page?.IsServiceQuestionPage) {
        this.AddServiceQuestionPageDataToSubject();
      } else if (this.Page?.IsPreServiceQuestionPage) {
        this.AddPreServiceQuestionPageDataToSubject();
      } else if (this.Page?.IsLanguagePage) {
        this.AddLanguagePageDataToSubject();
      } else if (this.Page?.IsNoQueuePage) {
        this.AddNoQueuePageDataToSubject();
      } else if (this.Page?.IsOffLinePage) {
        this.AddOffLinePageDataToSubject();
      }
    });
    this.subs.sink = this.kioskLayoutService.DesignerPanel$.subscribe((x) => {
      this.DesignerPanelSubject.next(x);
    });
    this.subs.sink = this.kioskLayoutService.PageProperties$.subscribe((x) => {
      this.PagePropertiesSubject.next(x);
    });
    this.subs.sink = this.kioskLayoutService.KioskPreServiceQuestion$.subscribe(
      (x) => {
        this.KioskData.PreServiceQuestionData = x;
        this.UpdatePreServiceQuestionPageControlsCount(x);
        x.labelDivs.forEach((m) => {
          this.AddLabelToThePreServiceQuestionPage(m);
        });
        x.imageDivs.forEach((m) => {
          this.AddImageToPreServiceQuestionPage(m);
        });
        x.videoDivs.forEach((m) => {
          this.AddVideoToPreServiceQuestionPage(m);
        });
        x.slidersDivs.forEach((m) => {
          this.AddSliderToPreServiceQuestionPage(m);
        });
        this.AddPreServiceQuestionPageDataToSubject();
      }
    );
    this.subs.sink = this.kioskLayoutService.KioskService$.subscribe((x) => {
      this.KioskData.ServiceData = x;
      this.UpdateServicePageControlsCount(x);
      x.labelDivs.forEach((m) => {
        this.AddLabelToTheServicePage(m);
      });
      x.imageDivs.forEach((m) => {
        this.AddImageToTheServicePage(m);
      });
      x.videoDivs.forEach((m) => {
        this.AddVideoToTheServicePage(m);
      });
      x.slidersDivs.forEach((m) => {
        this.AddSliderToServicePage(m);
      });
      this.AddServicePageDataToSubject();
    });
    this.subs.sink = this.kioskLayoutService.KioskServiceQuestion$.subscribe(
      (x) => {
        this.KioskData.ServiceQuestionData = x;
        this.UpdateServiceQuestionPageControlsCount(x);
        x.labelDivs.forEach((m) => {
          this.AddLabelToTheServiceQuestionPage(m);
        });
        x.imageDivs.forEach((m) => {
          this.AddImageToTheServiceQuestionPage(m);
        });
        x.videoDivs.forEach((m) => {
          this.AddVideoToTheServiceQuestionPage(m);
        });
        x.slidersDivs.forEach((m) => {
          this.AddSliderToServiceQuestionPage(m);
        });
        this.AddServiceQuestionPageDataToSubject();
      }
    );
    this.subs.sink = this.kioskLayoutService.ThankYou$.subscribe((x) => {
      this.KioskData.ThankYouPageData = x;
      this.UpdateThankYouPageControlsCount(x);
      x.labelDivs.forEach((m) => {
        this.AddLabelToTheThankYouPage(m);
      });
      x.imageDivs.forEach((m) => {
        this.AddImageToThankYouPage(m);
      });
      x.videoDivs.forEach((m) => {
        this.AddVideoToThankYouPage(m);
      });
      x.slidersDivs.forEach((m) => {
        this.AddSliderToThankYouPage(m);
      });
      this.AddThankYouPageDataToSubject();
    });
    this.subs.sink = this.kioskLayoutService.WelcomePage$.subscribe((x) => {
      this.KioskData.WelcomePageData = x;
      this.UpdateWelcomePageControlsCount(x);
      x.labelDivs.forEach((m) => {
        this.AddLabelToTheWelcomePage(m);
      });
      x.imageDivs.forEach((m) => {
        this.AddImageToWelcomePage(m);
      });
      x.videoDivs.forEach((m) => {
        this.AddVideoToWelcomePage(m);
      });
      x.slidersDivs.forEach((m) => {
        this.AddSliderToWelcomePage(m);
      });
      this.AddWelcomePageDataToSubject();
    });
    this.subs.sink = this.kioskLayoutService.LanguagePage$.subscribe((x) => {
      this.KioskData.LanguagePageData = x;
      this.UpdateLanguagePageControlsCount(x);
      x.labelDivs.forEach((m) => {
        this.AddLabelToTheLanguagePage(m);
      });
      x.imageDivs.forEach((m) => {
        this.AddImageToTheLanguagePage(m);
      });
      x.videoDivs.forEach((m) => {
        this.AddVideoToTheLanguagePage(m);
      });
      x.slidersDivs.forEach((m) => {
        this.AddSliderToLanguagePage(m);
      });
      this.AddLanguagePageDataToSubject();
    });
    this.subs.sink = this.kioskLayoutService.NoQueuePage$.subscribe((x) => {
      this.KioskData.NoQueuePageData = x;
      this.UpdateNoQueuePageControlsCount(x);
      x.labelDivs.forEach((m) => {
        this.AddLabelToTheNoQueuePage(m);
      });
      x.imageDivs.forEach((m) => {
        this.AddImageToNoQueuePage(m);
      });
      x.videoDivs.forEach((m) => {
        this.AddVideoToNoQueuePage(m);
      });
      x.slidersDivs.forEach((m) => {
        this.AddSliderToNoQueuePage(m);
      });
      this.AddNoQueuePageDataToSubject();
    });
    this.subs.sink = this.kioskLayoutService.OffLinePage$.subscribe((x) => {
      this.KioskData.OffLinePageData = x;
      this.UpdateOffLinePageControlsCount(x);
      x.labelDivs.forEach((m) => {
        this.AddLabelToTheOffLinePage(m);
      });
      x.imageDivs.forEach((m) => {
        this.AddImageToOffLinePage(m);
      });
      x.videoDivs.forEach((m) => {
        this.AddVideoToOffLinePage(m);
      });
      x.slidersDivs.forEach((m) => {
        this.AddSliderToOffLinePage(m);
      });
      this.AddOffLinePageDataToSubject();
    });
  }

  IncreaseZIndex(){
    this.kioskLayoutService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.kioskLayoutService.DecreaseZIndex();
  }

  private UpdatePreServiceQuestionPageControlsCount(x: IPreServiceQuestion) {
    this.KioskData.PreServiceQuestionData.otherControlCountData.totalImageCount =
      x.otherControlCountData.totalImageCount;
    this.KioskData.PreServiceQuestionData.otherControlCountData.totalLabelCount =
      x.otherControlCountData.totalLabelCount;
    this.KioskData.PreServiceQuestionData.otherControlCountData.totalVideoCount =
      x.otherControlCountData.totalVideoCount;
    this.KioskData.PreServiceQuestionData.otherControlCountData.totalSliderCount =
      x.otherControlCountData.totalSliderCount;
  }

  private UpdateServicePageControlsCount(x: IService) {
    this.KioskData.ServiceData.otherControlCountData.totalImageCount =
      x.otherControlCountData.totalImageCount;
    this.KioskData.ServiceData.otherControlCountData.totalLabelCount =
      x.otherControlCountData.totalLabelCount;
    this.KioskData.ServiceData.otherControlCountData.totalVideoCount =
      x.otherControlCountData.totalVideoCount;
    this.KioskData.ServiceData.otherControlCountData.totalSliderCount =
      x.otherControlCountData.totalSliderCount;
  }

  private UpdateServiceQuestionPageControlsCount(x: IServiceQuestion) {
    this.KioskData.ServiceQuestionData.otherControlCountData.totalImageCount =
      x.otherControlCountData.totalImageCount;
    this.KioskData.ServiceQuestionData.otherControlCountData.totalLabelCount =
      x.otherControlCountData.totalLabelCount;
    this.KioskData.ServiceQuestionData.otherControlCountData.totalVideoCount =
      x.otherControlCountData.totalVideoCount;
    this.KioskData.ServiceQuestionData.otherControlCountData.totalSliderCount =
      x.otherControlCountData.totalSliderCount;
  }

  private UpdateThankYouPageControlsCount(x: IThankYouPage) {
    this.KioskData.ThankYouPageData.otherControlCountData.totalImageCount =
      x.otherControlCountData.totalImageCount;
    this.KioskData.ThankYouPageData.otherControlCountData.totalLabelCount =
      x.otherControlCountData.totalLabelCount;
    this.KioskData.ThankYouPageData.otherControlCountData.totalVideoCount =
      x.otherControlCountData.totalVideoCount;
    this.KioskData.ThankYouPageData.otherControlCountData.totalSliderCount =
      x.otherControlCountData.totalSliderCount;
  }

  private UpdateWelcomePageControlsCount(x: IWelcomePage) {
    this.KioskData.WelcomePageData.otherControlCountData.totalImageCount =
      x.otherControlCountData.totalImageCount;
    this.KioskData.WelcomePageData.otherControlCountData.totalLabelCount =
      x.otherControlCountData.totalLabelCount;
    this.KioskData.WelcomePageData.otherControlCountData.totalVideoCount =
      x.otherControlCountData.totalVideoCount;
    this.KioskData.WelcomePageData.otherControlCountData.totalSliderCount =
      x.otherControlCountData.totalSliderCount;
  }

  private UpdateNoQueuePageControlsCount(x: INoQueuePage) {
    this.KioskData.NoQueuePageData.otherControlCountData.totalImageCount =
      x.otherControlCountData.totalImageCount;
    this.KioskData.NoQueuePageData.otherControlCountData.totalLabelCount =
      x.otherControlCountData.totalLabelCount;
    this.KioskData.NoQueuePageData.otherControlCountData.totalVideoCount =
      x.otherControlCountData.totalVideoCount;
    this.KioskData.NoQueuePageData.otherControlCountData.totalSliderCount =
      x.otherControlCountData.totalSliderCount;
  }

  private UpdateOffLinePageControlsCount(x: IOffLinePage) {
    this.KioskData.OffLinePageData.otherControlCountData.totalImageCount =
      x.otherControlCountData.totalImageCount;
    this.KioskData.OffLinePageData.otherControlCountData.totalLabelCount =
      x.otherControlCountData.totalLabelCount;
    this.KioskData.OffLinePageData.otherControlCountData.totalVideoCount =
      x.otherControlCountData.totalVideoCount;
    this.KioskData.OffLinePageData.otherControlCountData.totalSliderCount =
      x.otherControlCountData.totalSliderCount;
  }

  private UpdateLanguagePageControlsCount(x: ILanguagePage) {
    this.KioskData.LanguagePageData.otherControlCountData.totalImageCount =
      x.otherControlCountData.totalImageCount;
    this.KioskData.LanguagePageData.otherControlCountData.totalLabelCount =
      x.otherControlCountData.totalLabelCount;
    this.KioskData.LanguagePageData.otherControlCountData.totalVideoCount =
      x.otherControlCountData.totalVideoCount;
    this.KioskData.LanguagePageData.otherControlCountData.totalSliderCount =
      x.otherControlCountData.totalSliderCount;
  }

  private AddPreServiceQuestionPageDataToSubject() {
    this.PreServiceQuestionDataSubject.next(
      this.KioskData.PreServiceQuestionData
    );
  }

  private AddServiceQuestionPageDataToSubject() {
    this.ServiceQuestionDataSubject.next(this.KioskData.ServiceQuestionData);
  }

  private AddThankYouPageDataToSubject() {
    this.ThankYouPageDataSubject.next(this.KioskData.ThankYouPageData);
  }

  private AddWelcomePageDataToSubject() {
    this.WelcomePageDataSubject.next(this.KioskData.WelcomePageData);
  }

  private AddServicePageDataToSubject() {
    this.ServicePageDataSubject.next(this.KioskData.ServiceData);
  }

  private AddLanguagePageDataToSubject() {
    this.LanguagePageDataSubject.next(this.KioskData.LanguagePageData);
  }

  private AddNoQueuePageDataToSubject() {
    this.NoQueuePageDataSubject.next(this.KioskData.NoQueuePageData);
  }

  private AddOffLinePageDataToSubject() {
    this.OffLinePageDataSubject.next(this.KioskData.OffLinePageData);
  }

  private GetThankYouPageData(): IThankYouPage {
    return {
      imageDivs: [],
      labelDivs: [],
      otherControls: [],
      videoDivs: [],
      slidersDivs: [],
      thankYouPanel: null,
      buttons: [],
      otherControlCountData: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsOtherControlsSelected: false,
        IsPanelSelected: false,
      },
    };
  }

  private GetWelcomePageData(): IWelcomePage {
    return {
      imageDivs: [],
      labelDivs: [],
      otherControls: [],
      videoDivs: [],
      slidersDivs: [],
      buttons: [],
      otherControlCountData: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsOtherControlsSelected: false,
        IsPanelSelected: false,
      },
    };
  }

  private GetNoQueuePageData(): INoQueuePage {
    return {
      imageDivs: [],
      labelDivs: [],
      otherControls: [],
      videoDivs: [],
      slidersDivs: [],
      buttons: [],
      otherControlCountData: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsOtherControlsSelected: false,
        IsPanelSelected: false,
      },
    };
  }

  private GetOffLinePageData(): IOffLinePage {
    return {
      imageDivs: [],
      labelDivs: [],
      otherControls: [],
      videoDivs: [],
      slidersDivs: [],
      buttons: [],
      otherControlCountData: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsOtherControlsSelected: false,
        IsPanelSelected: false,
      },
    };
  }

  private GetLanguagePageData(): ILanguagePage {
    return {
      imageDivs: [],
      labelDivs: [],
      otherControls: [],
      videoDivs: [],
      slidersDivs: [],
      panel: null,
      otherControlCountData: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsOtherControlsSelected: false,
        IsPanelSelected: false,
      },
    };
  }

  /* #endregion */

  AddNewLabelControl(event: IMoveEvent) {
    const name = 'Label';
    const defaultText = { en: name };
    const defaultColor = 'black';
    const defaultHeight = 50;
    const defaultWidth = 50;
    const defaultZindex = 50;
    const defaultBackgroundColor='rgba(0, 0, 0, 0)';
    if (this.Page?.IsServicePage) {
      this.kioskLayoutService.OnServicePageOtherControlsSelection();
      this.AddLabelToServicePage(
        name,
        defaultText,
        defaultColor,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex,
        defaultBackgroundColor
      );
    } else if (this.Page?.IsServiceQuestionPage) {
      this.kioskLayoutService.OnServiceQuestionPageOtherControlsSelection();
      this.AddLabelToServiceQuestionPage(
        name,
        defaultText,
        defaultColor,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex,
        defaultBackgroundColor
      );
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.kioskLayoutService.OnGlobalQuestionPageOtherControlsSelection();
      this.AddLabelToPreServiceQuestionPage(
        name,
        defaultText,
        defaultColor,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex,
        defaultBackgroundColor
      );
    } else if (this.Page?.IsWelcomePage) {
      this.kioskLayoutService.OnWelcomePageOtherControlsSelection();
      this.AddLabelToWelcomePage(
        name,
        defaultText,
        defaultColor,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex,
        defaultBackgroundColor
      );
    } else if (this.Page?.IsThankYouPage) {
      this.kioskLayoutService.OnThankYouPageOtherControlsSelection();
      this.AddLabelToThankYouPage(
        name,
        defaultText,
        defaultColor,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex,
        defaultBackgroundColor
      );
    } else if (this.Page?.IsOffLinePage) {
      this.kioskLayoutService.OnOffLinePageOtherControlsSelection();
      this.AddLabelToOffLinePage(
        name,
        defaultText,
        defaultColor,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex,
        defaultBackgroundColor
      );
    } else if (this.Page?.IsLanguagePage) {
      this.kioskLayoutService.OnLanguagePageOtherControlsSelection();
      this.AddLabelToLanguagePage(
        name,
        defaultText,
        defaultColor,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex,
        defaultBackgroundColor
      );
    } else if (this.Page?.IsNoQueuePage) {
      this.kioskLayoutService.OnNoQueuePageOtherControlsSelection();
      this.AddLabelToNoQueuePage(
        name,
        defaultText,
        defaultColor,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex,
        defaultBackgroundColor
      );
    }
  }

  private AddLabelToServiceQuestionPage(
    name: string,
    defaultText: { en: string },
    defaultColor: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number,
    defaultBackgorunColor: string,
  ) {
    this.KioskData.ServiceQuestionData.otherControlCountData.totalLabelCount++;

    name =
      name +
      this.KioskData.ServiceQuestionData.otherControlCountData.totalLabelCount;
    const labelControl = this.CreateLabelControl(
      name,
      defaultText,
      defaultColor,
      defaultWidth,
      defaultHeight,
      Math.round(event.y),
      event.x,
      defaultZindex,
      this.FontStyles.font,
      this.FontStyles.fontStyle,
      this.FontStyles.fontSize,
      this.FontStyles.fontWeight,
      this.Alignment,
      this.BackgoundColor
    );
    this.AddLabelToTheServiceQuestionPage(labelControl);
    this.AddServiceQuestionPageDataToSubject();
  }

  private AddLabelToPreServiceQuestionPage(
    name: string,
    defaultText: { en: string },
    defaultColor: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number,
    defaultBackgroundColor: string,
  ) {
    this.KioskData.PreServiceQuestionData.otherControlCountData
      .totalLabelCount++;
    name =
      name +
      this.KioskData.PreServiceQuestionData.otherControlCountData
        .totalLabelCount;
    const labelControl = this.CreateLabelControl(
      name,
      defaultText,
      defaultColor,
      defaultWidth,
      defaultHeight,
      Math.round(event.y),
      event.x,
      defaultZindex,
      this.FontStyles.font,
      this.FontStyles.fontStyle,
      this.FontStyles.fontSize,
      this.FontStyles.fontWeight,
      this.Alignment,
      this.BackgoundColor
    );
    this.AddLabelToThePreServiceQuestionPage(labelControl);
    this.AddPreServiceQuestionPageDataToSubject();
  }

  private AddLabelToWelcomePage(
    name: string,
    defaultText: { en: string },
    defaultColor: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number,
    defaultBackgroundColor:string
  ) {
    this.KioskData.WelcomePageData.otherControlCountData.totalLabelCount++;
    name =
      name +
      this.KioskData.WelcomePageData.otherControlCountData.totalLabelCount;
    const labelControl = this.CreateLabelControl(
      name,
      defaultText,
      defaultColor,
      defaultWidth,
      defaultHeight,
      Math.round(event.y),
      event.x,
      defaultZindex,
      this.FontStyles.font,
      this.FontStyles.fontStyle,
      this.FontStyles.fontSize,
      this.FontStyles.fontWeight,
      this.Alignment,
      this.BackgoundColor
    );
    this.AddLabelToTheWelcomePage(labelControl);
    this.AddWelcomePageDataToSubject();
  }

  private AddLabelToThankYouPage(
    name: string,
    defaultText: { en: string },
    defaultColor: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number,
    defaultBackgroundColor:string
  ) {
    this.KioskData.ThankYouPageData.otherControlCountData.totalLabelCount++;
    name =
      name +
      this.KioskData.ThankYouPageData.otherControlCountData.totalLabelCount;
    const labelControl = this.CreateLabelControl(
      name,
      defaultText,
      defaultColor,
      defaultWidth,
      defaultHeight,
      Math.round(event.y),
      event.x,
      defaultZindex,
      this.FontStyles.font,
      this.FontStyles.fontStyle,
      this.FontStyles.fontSize,
      this.FontStyles.fontWeight,
      this.Alignment,
      this.BackgoundColor
    );
    this.AddLabelToTheThankYouPage(labelControl);
    this.AddThankYouPageDataToSubject();
  }

  private AddLabelToServicePage(
    name: string,
    defaultText: { en: string },
    defaultColor: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number,
    defaultBackgroundColor: string,
  ) {
    this.KioskData.ServiceData.otherControlCountData.totalLabelCount++;
    name =
      name + this.KioskData.ServiceData.otherControlCountData.totalLabelCount;
    const labelControl = this.CreateLabelControl(
      name,
      defaultText,
      defaultColor,
      defaultWidth,
      defaultHeight,
      Math.round(event.y),
      event.x,
      defaultZindex,
      this.FontStyles.font,
      this.FontStyles.fontStyle,
      this.FontStyles.fontSize,
      this.FontStyles.fontWeight,
      this.Alignment,
      this.BackgoundColor
    );
    this.AddLabelToTheServicePage(labelControl);
    this.AddServicePageDataToSubject();
  }

  private AddLabelToLanguagePage(
    name: string,
    defaultText: { en: string },
    defaultColor: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number,
    defaultBackgroundColor:string
  ) {
    this.KioskData.LanguagePageData.otherControlCountData.totalLabelCount++;
    name =
      name +
      this.KioskData.LanguagePageData.otherControlCountData.totalLabelCount;
    const labelControl = this.CreateLabelControl(
      name,
      defaultText,
      defaultColor,
      defaultWidth,
      defaultHeight,
      Math.round(event.y),
      event.x,
      defaultZindex,
      this.FontStyles.font,
      this.FontStyles.fontStyle,
      this.FontStyles.fontSize,
      this.FontStyles.fontWeight,
      this.Alignment,
      this.BackgoundColor
    );
    this.AddLabelToTheLanguagePage(labelControl);
    this.AddLanguagePageDataToSubject();
  }

  private AddLabelToNoQueuePage(
    name: string,
    defaultText: { en: string },
    defaultColor: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number,
    defaultBackgroundColor:string
  ) {
    this.KioskData.NoQueuePageData.otherControlCountData.totalLabelCount++;
    name =
      name +
      this.KioskData.NoQueuePageData.otherControlCountData.totalLabelCount;
    const labelControl = this.CreateLabelControl(
      name,
      defaultText,
      defaultColor,
      defaultWidth,
      defaultHeight,
      Math.round(event.y),
      event.x,
      defaultZindex,
      this.FontStyles.font,
      this.FontStyles.fontStyle,
      this.FontStyles.fontSize,
      this.FontStyles.fontWeight,
      this.Alignment,
      this.BackgoundColor
    );
    this.AddLabelToTheNoQueuePage(labelControl);
    this.AddNoQueuePageDataToSubject();
  }

  private AddLabelToOffLinePage(
    name: string,
    defaultText: { en: string },
    defaultColor: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number,
    defaultBackgroundColor:string
  ) {
    this.KioskData.OffLinePageData.otherControlCountData.totalLabelCount++;
    name =
      name +
      this.KioskData.OffLinePageData.otherControlCountData.totalLabelCount;
    const labelControl = this.CreateLabelControl(
      name,
      defaultText,
      defaultColor,
      defaultWidth,
      defaultHeight,
      Math.round(event.y),
      event.x,
      defaultZindex,
      this.FontStyles.font,
      this.FontStyles.fontStyle,
      this.FontStyles.fontSize,
      this.FontStyles.fontWeight,
      this.Alignment,
      this.BackgoundColor
    );
    this.AddLabelToTheOffLinePage(labelControl);
    this.AddOffLinePageDataToSubject();
  }

  private AddLabelToTheThankYouPage(labelControl: LabelControl) {
    if (
      !this.KioskData.ThankYouPageData.otherControls.some(
        (x) => x.Control.name == labelControl.name
      )
    ) {
      this.KioskData.ThankYouPageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.ThankYouPageData.otherControls,
          labelControl,
          labelControl.name,
          true,
          false,
          false
        )
      );
    }
    if (
      !this.KioskData.ThankYouPageData.labelDivs.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.KioskData.ThankYouPageData.labelDivs =
        this.KioskData.ThankYouPageData.labelDivs.concat(labelControl);
    }
  }

  private AddLabelToTheWelcomePage(labelControl: LabelControl) {
    if (
      !this.KioskData.WelcomePageData.otherControls.some(
        (x) => x.Control.name === labelControl.name
      )
    ) {
      this.KioskData.WelcomePageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.WelcomePageData.otherControls,
          labelControl,
          labelControl.name,
          true,
          false,
          false
        )
      );
    }
    if (
      !this.KioskData.WelcomePageData.labelDivs.some(
        (z) => z.name === labelControl.name
      )
    ) {
      this.KioskData.WelcomePageData.labelDivs =
        this.KioskData.WelcomePageData.labelDivs.concat(labelControl);
    }
  }

  private AddLabelToTheNoQueuePage(labelControl: LabelControl) {
    if (
      !this.KioskData.NoQueuePageData.otherControls.some(
        (x) => x.Control.name === labelControl.name
      )
    ) {
      this.KioskData.NoQueuePageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.NoQueuePageData.otherControls,
          labelControl,
          labelControl.name,
          true,
          false,
          false
        )
      );
    }
    if (
      !this.KioskData.NoQueuePageData.labelDivs.some(
        (z) => z.name === labelControl.name
      )
    ) {
      this.KioskData.NoQueuePageData.labelDivs =
        this.KioskData.NoQueuePageData.labelDivs.concat(labelControl);
    }
  }

  private AddLabelToTheOffLinePage(labelControl: LabelControl) {
    if (
      !this.KioskData.OffLinePageData.otherControls.some(
        (x) => x.Control.name === labelControl.name
      )
    ) {
      this.KioskData.OffLinePageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.OffLinePageData.otherControls,
          labelControl,
          labelControl.name,
          true,
          false,
          false
        )
      );
    }
    if (
      !this.KioskData.OffLinePageData.labelDivs.some(
        (z) => z.name === labelControl.name
      )
    ) {
      this.KioskData.OffLinePageData.labelDivs =
        this.KioskData.OffLinePageData.labelDivs.concat(labelControl);
    }
  }

  private AddLabelToThePreServiceQuestionPage(labelControl: LabelControl) {
    if (
      !this.KioskData.PreServiceQuestionData.otherControls.some(
        (x) => x.Control.name === labelControl.name
      )
    ) {
      this.KioskData.PreServiceQuestionData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.PreServiceQuestionData.otherControls,
          labelControl,
          labelControl.name,
          true,
          false,
          false
        )
      );
    }
    if (
      !this.KioskData.PreServiceQuestionData.labelDivs.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.KioskData.PreServiceQuestionData.labelDivs =
        this.KioskData.PreServiceQuestionData.labelDivs.concat(labelControl);
    }
  }

  private AddLabelToTheServiceQuestionPage(labelControl: LabelControl) {
    if (
      !this.KioskData.ServiceQuestionData.otherControls.some(
        (x) => x.Control.name == labelControl.name
      )
    ) {
      this.KioskData.ServiceQuestionData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.ServiceQuestionData.otherControls,
          labelControl,
          labelControl.name,
          true,
          false,
          false
        )
      );
    }
    if (
      !this.KioskData.ServiceQuestionData.labelDivs.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.KioskData.ServiceQuestionData.labelDivs =
        this.KioskData.ServiceQuestionData.labelDivs.concat(labelControl);
    }
  }

  private AddLabelToTheServicePage(labelControl: LabelControl) {
    if (
      !this.KioskData.ServiceData.otherControls.some(
        (x) => x.Control.name == labelControl.name
      )
    ) {
      this.KioskData.ServiceData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.ServiceData.otherControls,
          labelControl,
          labelControl.name,
          true,
          false,
          false
        )
      );
    }

    if (
      !this.KioskData.ServiceData.labelDivs.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.KioskData.ServiceData.labelDivs =
        this.KioskData.ServiceData.labelDivs.concat(labelControl);
    }
  }

  private AddLabelToTheLanguagePage(labelControl: LabelControl) {
    if (
      !this.KioskData.LanguagePageData.otherControls.some(
        (x) => x.Control.name == labelControl.name
      )
    ) {
      this.KioskData.LanguagePageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.LanguagePageData.otherControls,
          labelControl,
          labelControl.name,
          true,
          false,
          false
        )
      );
    }

    if (
      !this.KioskData.LanguagePageData.labelDivs.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.KioskData.LanguagePageData.labelDivs =
        this.KioskData.LanguagePageData.labelDivs.concat(labelControl);
    }
  }

  AddNewImageControl(event) {
    const name = 'Image';
    const src = [
      {
        language: 'English',
        languageCode: 'en',
        src: '/assets/img-icon.svg',
        url: '/assets/img-icon.svg',
      },
    ];
    const defaultHeight = 50;
    const defaultWidth = 50;
    const defaultZindex = 50;

    if (this.Page?.IsServicePage) {
      this.kioskLayoutService.OnServicePageOtherControlsSelection();
      this.AddNewImageControlToServicePage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsServiceQuestionPage) {
      this.kioskLayoutService.OnServiceQuestionPageOtherControlsSelection();
      this.AddNewImageControlToServiceQuestionPage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.kioskLayoutService.OnGlobalQuestionPageOtherControlsSelection();
      this.AddNewImageControlToPreserviceQuestionPage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsWelcomePage) {
      this.kioskLayoutService.OnWelcomePageOtherControlsSelection();
      this.AddNewImageControlToWelcomePage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsThankYouPage) {
      this.kioskLayoutService.OnThankYouPageOtherControlsSelection();
      this.AddNewImageControlToThankYouPage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsLanguagePage) {
      this.kioskLayoutService.OnLanguagePageOtherControlsSelection();
      this.AddNewImageControlToLanguagePage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsNoQueuePage) {
      this.kioskLayoutService.OnNoQueuePageOtherControlsSelection();
      this.AddNewImageControlToNoQueuePage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsOffLinePage) {
      this.kioskLayoutService.OnOffLinePageOtherControlsSelection();
      this.AddNewImageControlToOffLinePage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    }
  }

  private AddNewImageControlToServicePage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.ServiceData.otherControlCountData.totalImageCount++;

    name =
      name + this.KioskData.ServiceData.otherControlCountData.totalImageCount;
    const imageControl = this.CreateImageControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );

    this.AddImageToTheServicePage(imageControl);
    this.AddServicePageDataToSubject();
  }

  private AddNewImageControlToServiceQuestionPage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.ServiceQuestionData.otherControlCountData.totalImageCount++;

    name =
      name +
      this.KioskData.ServiceQuestionData.otherControlCountData.totalImageCount;
    const imageControl = this.CreateImageControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );

    this.AddImageToTheServiceQuestionPage(imageControl);
    this.AddServiceQuestionPageDataToSubject();
  }

  private AddNewImageControlToPreserviceQuestionPage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.PreServiceQuestionData.otherControlCountData
      .totalImageCount++;
    name =
      name +
      this.KioskData.PreServiceQuestionData.otherControlCountData
        .totalImageCount;
    const imageControl = this.CreateImageControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );

    this.AddImageToPreServiceQuestionPage(imageControl);
    this.AddPreServiceQuestionPageDataToSubject();
  }

  private AddNewImageControlToWelcomePage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.WelcomePageData.otherControlCountData.totalImageCount++;
    name =
      name +
      this.KioskData.WelcomePageData.otherControlCountData.totalImageCount;
    const imageControl = this.CreateImageControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );

    this.AddImageToWelcomePage(imageControl);
    this.AddWelcomePageDataToSubject();
  }

  private AddNewImageControlToNoQueuePage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.NoQueuePageData.otherControlCountData.totalImageCount++;
    name =
      name +
      this.KioskData.NoQueuePageData.otherControlCountData.totalImageCount;
    const imageControl = this.CreateImageControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );

    this.AddImageToNoQueuePage(imageControl);
    this.AddNoQueuePageDataToSubject();
  }

  private AddNewImageControlToOffLinePage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.OffLinePageData.otherControlCountData.totalImageCount++;
    name =
      name +
      this.KioskData.OffLinePageData.otherControlCountData.totalImageCount;
    const imageControl = this.CreateImageControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );

    this.AddImageToOffLinePage(imageControl);
    this.AddOffLinePageDataToSubject();
  }

  private AddNewImageControlToThankYouPage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.ThankYouPageData.otherControlCountData.totalImageCount++;

    name =
      name +
      this.KioskData.ThankYouPageData.otherControlCountData.totalImageCount;
    const imageControl = this.CreateImageControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );

    this.AddImageToThankYouPage(imageControl);
    this.AddThankYouPageDataToSubject();
  }

  private AddNewImageControlToLanguagePage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.LanguagePageData.otherControlCountData.totalImageCount++;

    name =
      name +
      this.KioskData.LanguagePageData.otherControlCountData.totalImageCount;
    const imageControl = this.CreateImageControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );

    this.AddImageToLanguagePage(imageControl);
    this.AddLanguagePageDataToSubject();
  }

  private AddImageToThankYouPage(imageControl: ImageControl) {
    if (
      !this.KioskData.ThankYouPageData.otherControls.some(
        (x) => x.Control.name === imageControl.name
      )
    ) {
      this.KioskData.ThankYouPageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.ThankYouPageData.otherControls,
          imageControl,
          imageControl.name,
          false,
          true,
          false
        )
      );
    }
    if (
      !this.KioskData.ThankYouPageData.imageDivs.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.KioskData.ThankYouPageData.imageDivs =
        this.KioskData.ThankYouPageData.imageDivs.concat(imageControl);
    }
  }

  private AddImageToLanguagePage(imageControl: ImageControl) {
    if (
      !this.KioskData.LanguagePageData.otherControls.some(
        (x) => x.Control.name === imageControl.name
      )
    ) {
      this.KioskData.LanguagePageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.LanguagePageData.otherControls,
          imageControl,
          imageControl.name,
          false,
          true,
          false
        )
      );
    }
    if (
      !this.KioskData.LanguagePageData.imageDivs.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.KioskData.LanguagePageData.imageDivs =
        this.KioskData.LanguagePageData.imageDivs.concat(imageControl);
    }
    this.SelectControlOnPage(imageControl, 'LanguagePageData');
    this.UpdateSelectedPropertyOfImageControl(imageControl, 'LanguagePageData');
  }

  private AddImageToWelcomePage(imageControl: ImageControl) {
    if (
      !this.KioskData.WelcomePageData.otherControls.some(
        (x) => x.Control.name === imageControl.name
      )
    ) {
      this.KioskData.WelcomePageData.otherControls =
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.WelcomePageData.otherControls,
          imageControl,
          imageControl.name,
          false,
          true,
          false
        );
    }
    if (
      !this.KioskData.WelcomePageData.imageDivs.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.KioskData.WelcomePageData.imageDivs =
        this.KioskData.WelcomePageData.imageDivs.concat(imageControl);
    }
  }

  private AddImageToNoQueuePage(imageControl: ImageControl) {
    if (
      !this.KioskData.NoQueuePageData.otherControls.some(
        (x) => x.Control.name === imageControl.name
      )
    ) {
      this.KioskData.NoQueuePageData.otherControls =
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.NoQueuePageData.otherControls,
          imageControl,
          imageControl.name,
          false,
          true,
          false
        );
    }
    if (
      !this.KioskData.NoQueuePageData.imageDivs.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.KioskData.NoQueuePageData.imageDivs =
        this.KioskData.NoQueuePageData.imageDivs.concat(imageControl);
    }
  }

  private AddImageToOffLinePage(imageControl: ImageControl) {
    if (
      !this.KioskData.OffLinePageData.otherControls.some(
        (x) => x.Control.name === imageControl.name
      )
    ) {
      this.KioskData.OffLinePageData.otherControls =
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.OffLinePageData.otherControls,
          imageControl,
          imageControl.name,
          false,
          true,
          false
        );
    }
    if (
      !this.KioskData.OffLinePageData.imageDivs.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.KioskData.OffLinePageData.imageDivs =
        this.KioskData.OffLinePageData.imageDivs.concat(imageControl);
    }
  }

  private AddImageToPreServiceQuestionPage(imageControl: ImageControl) {
    if (
      !this.KioskData.PreServiceQuestionData.otherControls.some(
        (x) => x.Control.name === imageControl.name
      )
    ) {
      this.KioskData.PreServiceQuestionData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.PreServiceQuestionData.otherControls,
          imageControl,
          imageControl.name,
          false,
          true,
          false
        )
      );
    }
    if (
      !this.KioskData.PreServiceQuestionData.imageDivs.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.KioskData.PreServiceQuestionData.imageDivs =
        this.KioskData.PreServiceQuestionData.imageDivs.concat(imageControl);
    }
  }

  private AddImageToTheServiceQuestionPage(imageControl: ImageControl) {
    if (
      !this.KioskData.ServiceQuestionData.otherControls.some(
        (x) => x.Control.name === imageControl.name
      )
    ) {
      this.KioskData.ServiceQuestionData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.ServiceQuestionData.otherControls,
          imageControl,
          imageControl.name,
          false,
          true,
          false
        )
      );
    }
    if (
      !this.KioskData.ServiceQuestionData.imageDivs.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.KioskData.ServiceQuestionData.imageDivs =
        this.KioskData.ServiceQuestionData.imageDivs.concat(imageControl);
    }
  }

  private AddImageToTheServicePage(imageControl: ImageControl) {
    if (
      !this.KioskData.ServiceData.otherControls.some(
        (x) => x.Control.name === imageControl.name
      )
    ) {
      this.KioskData.ServiceData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.ServiceData.otherControls,
          imageControl,
          imageControl.name,
          false,
          true,
          false
        )
      );
    }
    if (
      !this.KioskData.ServiceData.imageDivs.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.KioskData.ServiceData.imageDivs =
        this.KioskData.ServiceData.imageDivs.concat(imageControl);
    }
  }

  private AddImageToTheLanguagePage(imageControl: ImageControl) {
    if (
      !this.KioskData.LanguagePageData.otherControls.some(
        (x) => x.Control.name === imageControl.name
      )
    ) {
      this.KioskData.LanguagePageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.LanguagePageData.otherControls,
          imageControl,
          imageControl.name,
          false,
          true,
          false
        )
      );
    }
    if (
      !this.KioskData.LanguagePageData.imageDivs.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.KioskData.LanguagePageData.imageDivs =
        this.KioskData.LanguagePageData.imageDivs.concat(imageControl);
    }
  }

  AddNewSliderControl(event: IMoveEvent) {
    const name = 'Slider';
    const defaultHeight = 50;
    const defaultWidth = 100;
    const defaultZindex = 50;

    if (this.Page?.IsServicePage) {
      this.kioskLayoutService.OnServicePageOtherControlsSelection();
      this.AddNewSliderToServicePage(name, defaultWidth, defaultHeight, event,defaultZindex);
    } else if (this.Page?.IsServiceQuestionPage) {
      this.kioskLayoutService.OnServiceQuestionPageOtherControlsSelection();
      this.AddNewSliderToServiceQuestionPage(
        name,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.kioskLayoutService.OnGlobalQuestionPageOtherControlsSelection();
      this.AddNewSliderToPreServiceQuestionPage(
        name,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsWelcomePage) {
      this.kioskLayoutService.OnWelcomePageOtherControlsSelection();
      this.AddNewSliderToWelcomePage(name, defaultWidth, defaultHeight, event, defaultZindex);
    } else if (this.Page?.IsThankYouPage) {
      this.kioskLayoutService.OnThankYouPageOtherControlsSelection();
      this.AddNewSliderToThankYouPage(name, defaultWidth, defaultHeight, event, defaultZindex);
    } else if (this.Page?.IsLanguagePage) {
      this.kioskLayoutService.OnLanguagePageOtherControlsSelection();
      this.AddNewSliderToLanguagePage(name, defaultWidth, defaultHeight, event, defaultZindex);
    } else if (this.Page?.IsNoQueuePage) {
      this.kioskLayoutService.OnNoQueuePageOtherControlsSelection();
      this.AddNewSliderToNoQueuePage(name, defaultWidth, defaultHeight, event, defaultZindex);
    } else if (this.Page?.IsOffLinePage) {
      this.kioskLayoutService.OnOffLinePageOtherControlsSelection();
      this.AddNewSliderToOffLinePage(name, defaultWidth, defaultHeight, event, defaultZindex);
    }
  }

  private AddNewSliderToThankYouPage(
    name: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number
  ) {
    this.KioskData.ThankYouPageData.otherControlCountData.totalSliderCount++;
    name =
      name +
      this.KioskData.ThankYouPageData.otherControlCountData.totalSliderCount;
    const sliderControl = this.CreateSliderControl(
      name,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddSliderToThankYouPage(sliderControl);
    this.ThankYouPageDataSubject.next(this.KioskData.ThankYouPageData);
  }

  private AddNewSliderToLanguagePage(
    name: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number
  ) {
    this.KioskData.LanguagePageData.otherControlCountData.totalSliderCount++;
    name =
      name +
      this.KioskData.LanguagePageData.otherControlCountData.totalSliderCount;
    const sliderControl = this.CreateSliderControl(
      name,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddSliderToLanguagePage(sliderControl);
    this.AddLanguagePageDataToSubject();
  }

  private AddNewSliderToWelcomePage(
    name: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number
  ) {
    this.KioskData.WelcomePageData.otherControlCountData.totalSliderCount++;
    name =
      name +
      this.KioskData.WelcomePageData.otherControlCountData.totalSliderCount;
    const sliderControl = this.CreateSliderControl(
      name,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddSliderToWelcomePage(sliderControl);
    this.WelcomePageDataSubject.next(this.KioskData.WelcomePageData);
  }

  private AddNewSliderToNoQueuePage(
    name: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number
  ) {
    this.KioskData.NoQueuePageData.otherControlCountData.totalSliderCount++;
    name =
      name +
      this.KioskData.NoQueuePageData.otherControlCountData.totalSliderCount;
    const sliderControl = this.CreateSliderControl(
      name,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddSliderToNoQueuePage(sliderControl);
    this.NoQueuePageDataSubject.next(this.KioskData.NoQueuePageData);
  }

  private AddNewSliderToOffLinePage(
    name: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number
  ) {
    this.KioskData.OffLinePageData.otherControlCountData.totalSliderCount++;
    name =
      name +
      this.KioskData.OffLinePageData.otherControlCountData.totalSliderCount;
    const sliderControl = this.CreateSliderControl(
      name,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddSliderToOffLinePage(sliderControl);
    this.OffLinePageDataSubject.next(this.KioskData.OffLinePageData);
  }

  private AddNewSliderToPreServiceQuestionPage(
    name: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number
  ) {
    this.KioskData.PreServiceQuestionData.otherControlCountData
      .totalSliderCount++;
    name =
      name +
      this.KioskData.PreServiceQuestionData.otherControlCountData
        .totalSliderCount;
    const sliderControl = this.CreateSliderControl(
      name,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddSliderToPreServiceQuestionPage(sliderControl);
    this.PreServiceQuestionDataSubject.next(
      this.KioskData.PreServiceQuestionData
    );
  }

  private AddNewSliderToServiceQuestionPage(
    name: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number
  ) {
    this.KioskData.ServiceQuestionData.otherControlCountData.totalSliderCount++;
    name =
      name +
      this.KioskData.ServiceQuestionData.otherControlCountData.totalSliderCount;
    const sliderControl = this.CreateSliderControl(
      name,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddSliderToServiceQuestionPage(sliderControl);
    this.ServiceQuestionDataSubject.next(this.KioskData.ServiceQuestionData);
  }

  private AddNewSliderToServicePage(
    name: string,
    defaultWidth: number,
    defaultHeight: number,
    event: IMoveEvent,
    defaultZindex: number
  ) {
    this.KioskData.ServiceData.otherControlCountData.totalSliderCount++;

    name =
      name + this.KioskData.ServiceData.otherControlCountData.totalSliderCount;
    const sliderControl = this.CreateSliderControl(
      name,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddSliderToServicePage(sliderControl);
    this.ServicePageDataSubject.next(this.KioskData.ServiceData);
  }

  AddNewVideoControl(event: any) {
    const name = 'Video';
    const src = [{ language: 'English', languageCode: 'en', src: '', url: '' }];
    const defaultHeight = 100;
    const defaultWidth = 100;
    const defaultZindex = 50

    if (this.Page?.IsServicePage) {
      this.kioskLayoutService.OnServicePageOtherControlsSelection();
      this.AddNewVideoControlToTheServicePage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsServiceQuestionPage) {
      this.kioskLayoutService.OnServiceQuestionPageOtherControlsSelection();
      this.AddNewVideoControlToTheServiceQuestionPage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.kioskLayoutService.OnGlobalQuestionPageOtherControlsSelection();
      this.AddNewVideoControlToThePreServiceQuestionPage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsWelcomePage) {
      this.kioskLayoutService.OnWelcomePageOtherControlsSelection();
      this.AddNewVideoControlToWelcomePage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsThankYouPage) {
      this.kioskLayoutService.OnThankYouPageOtherControlsSelection();
      this.AddNewVideoControlToThankYouPage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsLanguagePage) {
      this.kioskLayoutService.OnLanguagePageOtherControlsSelection();
      this.AddNewVideoControlToLanguagePage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsNoQueuePage) {
      this.kioskLayoutService.OnNoQueuePageOtherControlsSelection();
      this.AddNewVideoControlToNoQueuePage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    } else if (this.Page?.IsOffLinePage) {
      this.kioskLayoutService.OnOffLinePageOtherControlsSelection();
      this.AddNewVideoControlToOffLinePage(
        name,
        src,
        defaultWidth,
        defaultHeight,
        event,
        defaultZindex
      );
    }
  }

  private AddNewVideoControlToThankYouPage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.ThankYouPageData.otherControlCountData.totalVideoCount++;
    name =
      name +
      this.KioskData.ThankYouPageData.otherControlCountData.totalVideoCount;
    const videoControl = this.CreateVideoControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddVideoToThankYouPage(videoControl);
    this.AddThankYouPageDataToSubject();
  }

  private AddNewVideoControlToWelcomePage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.WelcomePageData.otherControlCountData.totalVideoCount++;

    name =
      name +
      this.KioskData.WelcomePageData.otherControlCountData.totalVideoCount;
    const videoControl = this.CreateVideoControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddVideoToWelcomePage(videoControl);
    this.AddWelcomePageDataToSubject();
  }

  private AddNewVideoControlToNoQueuePage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.NoQueuePageData.otherControlCountData.totalVideoCount++;

    name =
      name +
      this.KioskData.NoQueuePageData.otherControlCountData.totalVideoCount;
    const videoControl = this.CreateVideoControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddVideoToNoQueuePage(videoControl);
    this.AddNoQueuePageDataToSubject();
  }

  private AddNewVideoControlToOffLinePage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.OffLinePageData.otherControlCountData.totalVideoCount++;

    name =
      name +
      this.KioskData.OffLinePageData.otherControlCountData.totalVideoCount;
    const videoControl = this.CreateVideoControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddVideoToOffLinePage(videoControl);
    this.AddOffLinePageDataToSubject();
  }

  private AddNewVideoControlToLanguagePage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.LanguagePageData.otherControlCountData.totalVideoCount++;

    name =
      name +
      this.KioskData.LanguagePageData.otherControlCountData.totalVideoCount;
    const videoControl = this.CreateVideoControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddVideoToTheLanguagePage(videoControl);
    this.AddLanguagePageDataToSubject();
  }

  private AddNewVideoControlToThePreServiceQuestionPage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.PreServiceQuestionData.otherControlCountData
      .totalVideoCount++;

    name =
      name +
      this.KioskData.PreServiceQuestionData.otherControlCountData
        .totalVideoCount;
    const videoControl = this.CreateVideoControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddVideoToPreServiceQuestionPage(videoControl);
    this.AddPreServiceQuestionPageDataToSubject();
  }

  private AddNewVideoControlToTheServiceQuestionPage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.ServiceQuestionData.otherControlCountData.totalVideoCount++;

    name =
      name +
      this.KioskData.ServiceQuestionData.otherControlCountData.totalVideoCount;
    const videoControl = this.CreateVideoControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddVideoToTheServiceQuestionPage(videoControl);
    this.AddServiceQuestionPageDataToSubject();
  }

  private AddNewVideoControlToTheServicePage(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    event: any,
    defaultZindex: number
  ) {
    this.KioskData.ServiceData.otherControlCountData.totalVideoCount++;

    name =
      name + this.KioskData.ServiceData.otherControlCountData.totalVideoCount;
    const videoControl = this.CreateVideoControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZindex
    );
    this.AddVideoToTheServicePage(videoControl);
    this.AddServicePageDataToSubject();
  }

  private AddVideoToThankYouPage(videoControl: VideoControl) {
    if (
      !this.KioskData.ThankYouPageData.otherControls.some(
        (x) => x.Control.name === videoControl.name
      )
    ) {
      this.KioskData.ThankYouPageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.ThankYouPageData.otherControls,
          videoControl,
          videoControl.name,
          false,
          false,
          true
        )
      );
    }
    if (
      !this.KioskData.ThankYouPageData.videoDivs.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.KioskData.ThankYouPageData.videoDivs =
        this.KioskData.ThankYouPageData.videoDivs.concat(videoControl);
    }
  }

  private AddVideoToWelcomePage(videoControl: VideoControl) {
    if (
      !this.KioskData.WelcomePageData.otherControls.some(
        (x) => x.Control.name === videoControl.name
      )
    ) {
      this.KioskData.WelcomePageData.otherControls =
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.WelcomePageData.otherControls,
          videoControl,
          videoControl.name,
          false,
          false,
          true
        );
    }
    if (
      !this.KioskData.WelcomePageData.videoDivs.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.KioskData.WelcomePageData.videoDivs =
        this.KioskData.WelcomePageData.videoDivs.concat(videoControl);
    }
  }

  private AddVideoToNoQueuePage(videoControl: VideoControl) {
    if (
      !this.KioskData.NoQueuePageData.otherControls.some(
        (x) => x.Control.name === videoControl.name
      )
    ) {
      this.KioskData.NoQueuePageData.otherControls =
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.NoQueuePageData.otherControls,
          videoControl,
          videoControl.name,
          false,
          false,
          true
        );
    }
    if (
      !this.KioskData.NoQueuePageData.videoDivs.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.KioskData.NoQueuePageData.videoDivs =
        this.KioskData.NoQueuePageData.videoDivs.concat(videoControl);
    }
  }

  private AddVideoToOffLinePage(videoControl: VideoControl) {
    if (
      !this.KioskData.OffLinePageData.otherControls.some(
        (x) => x.Control.name === videoControl.name
      )
    ) {
      this.KioskData.OffLinePageData.otherControls =
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.OffLinePageData.otherControls,
          videoControl,
          videoControl.name,
          false,
          false,
          true
        );
    }
    if (
      !this.KioskData.OffLinePageData.videoDivs.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.KioskData.OffLinePageData.videoDivs =
        this.KioskData.OffLinePageData.videoDivs.concat(videoControl);
    }
  }

  private AddVideoToPreServiceQuestionPage(videoControl: VideoControl) {
    if (
      !this.KioskData.PreServiceQuestionData.otherControls.some(
        (x) => x.Control.name === videoControl.name
      )
    ) {
      this.KioskData.PreServiceQuestionData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.PreServiceQuestionData.otherControls,
          videoControl,
          videoControl.name,
          false,
          false,
          true
        )
      );
    }
    if (
      !this.KioskData.PreServiceQuestionData.videoDivs.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.KioskData.PreServiceQuestionData.videoDivs =
        this.KioskData.PreServiceQuestionData.videoDivs.concat(videoControl);
    }
  }

  private AddVideoToTheServiceQuestionPage(videoControl: VideoControl) {
    if (
      !this.KioskData.ServiceQuestionData.otherControls.some(
        (x) => x.Control.name === videoControl.name
      )
    ) {
      this.KioskData.ServiceQuestionData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.ServiceQuestionData.otherControls,
          videoControl,
          videoControl.name,
          false,
          false,
          true
        )
      );
    }
    if (
      !this.KioskData.ServiceQuestionData.videoDivs.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.KioskData.ServiceQuestionData.videoDivs =
        this.KioskData.ServiceQuestionData.videoDivs.concat(videoControl);
    }
  }

  private AddVideoToTheServicePage(videoControl: VideoControl) {
    if (
      !this.KioskData.ServiceData.otherControls.some(
        (x) => x.Control.name === videoControl.name
      )
    ) {
      this.KioskData.ServiceData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.ServiceData.otherControls,
          videoControl,
          videoControl.name,
          false,
          false,
          true
        )
      );
    }
    if (
      !this.KioskData.ServiceData.videoDivs.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.KioskData.ServiceData.videoDivs =
        this.KioskData.ServiceData.videoDivs.concat(videoControl);
    }
  }

  private AddVideoToTheLanguagePage(videoControl: VideoControl) {
    if (
      !this.KioskData.LanguagePageData.otherControls.some(
        (x) => x.Control.name === videoControl.name
      )
    ) {
      this.KioskData.LanguagePageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.LanguagePageData.otherControls,
          videoControl,
          videoControl.name,
          false,
          false,
          true
        )
      );
    }
    if (
      !this.KioskData.LanguagePageData.videoDivs.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.KioskData.LanguagePageData.videoDivs =
        this.KioskData.LanguagePageData.videoDivs.concat(videoControl);
    }
  }

  private AddSliderToPreServiceQuestionPage(sliderControl: SliderControl) {
    if (
      !this.KioskData.PreServiceQuestionData.otherControls.some(
        (x) => x.Control.name === sliderControl.name
      )
    ) {
      this.KioskData.PreServiceQuestionData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.PreServiceQuestionData.otherControls,
          sliderControl,
          sliderControl.name,
          false,
          false,
          false,
          true
        )
      );
    }
    if (
      !this.KioskData.PreServiceQuestionData.slidersDivs.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.KioskData.PreServiceQuestionData.slidersDivs =
        this.KioskData.PreServiceQuestionData.slidersDivs.concat(sliderControl);
    }
  }

  private AddSliderToServiceQuestionPage(sliderControl: SliderControl) {
    if (
      !this.KioskData.ServiceQuestionData.otherControls.some(
        (x) => x.Control.name === sliderControl.name
      )
    ) {
      this.KioskData.ServiceQuestionData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.ServiceQuestionData.otherControls,
          sliderControl,
          sliderControl.name,
          false,
          false,
          false,
          true
        )
      );
    }
    if (
      !this.KioskData.ServiceQuestionData.slidersDivs.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.KioskData.ServiceQuestionData.slidersDivs =
        this.KioskData.ServiceQuestionData.slidersDivs.concat(sliderControl);
    }
  }

  private AddSliderToServicePage(sliderControl: SliderControl) {
    if (
      !this.KioskData.ServiceData.otherControls.some(
        (x) => x.Control.name === sliderControl.name
      )
    ) {
      this.KioskData.ServiceData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.ServiceData.otherControls,
          sliderControl,
          sliderControl.name,
          false,
          false,
          false,
          true
        )
      );
    }
    if (
      !this.KioskData.ServiceData.slidersDivs.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.KioskData.ServiceData.slidersDivs =
        this.KioskData.ServiceData.slidersDivs.concat(sliderControl);
    }
  }

  private AddSliderToThankYouPage(sliderControl: SliderControl) {
    if (
      !this.KioskData.ThankYouPageData.otherControls.some(
        (x) => x.Control.name === sliderControl.name
      )
    ) {
      this.KioskData.ThankYouPageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.ThankYouPageData.otherControls,
          sliderControl,
          sliderControl.name,
          false,
          false,
          false,
          true
        )
      );
    }
    if (
      !this.KioskData.ThankYouPageData.slidersDivs.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.KioskData.ThankYouPageData.slidersDivs =
        this.KioskData.ThankYouPageData.slidersDivs.concat(sliderControl);
    }
  }

  private AddSliderToLanguagePage(sliderControl: SliderControl) {
    if (
      !this.KioskData.LanguagePageData.otherControls.some(
        (x) => x.Control.name === sliderControl.name
      )
    ) {
      this.KioskData.LanguagePageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.LanguagePageData.otherControls,
          sliderControl,
          sliderControl.name,
          false,
          false,
          false,
          true
        )
      );
    }
    if (
      !this.KioskData.LanguagePageData.slidersDivs.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.KioskData.LanguagePageData.slidersDivs =
        this.KioskData.LanguagePageData.slidersDivs.concat(sliderControl);
    }
  }

  private AddSliderToWelcomePage(sliderControl: SliderControl) {
    if (
      !this.KioskData.WelcomePageData.otherControls.some(
        (x) => x.Control.name === sliderControl.name
      )
    ) {
      this.KioskData.WelcomePageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.WelcomePageData.otherControls,
          sliderControl,
          sliderControl.name,
          false,
          false,
          false,
          true
        )
      );
    }
    if (
      !this.KioskData.WelcomePageData.slidersDivs.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.KioskData.WelcomePageData.slidersDivs =
        this.KioskData.WelcomePageData.slidersDivs.concat(sliderControl);
    }
  }

  private AddSliderToNoQueuePage(sliderControl: SliderControl) {
    if (
      !this.KioskData.NoQueuePageData.otherControls.some(
        (x) => x.Control.name === sliderControl.name
      )
    ) {
      this.KioskData.NoQueuePageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.NoQueuePageData.otherControls,
          sliderControl,
          sliderControl.name,
          false,
          false,
          false,
          true
        )
      );
    }
    if (
      !this.KioskData.NoQueuePageData.slidersDivs.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.KioskData.NoQueuePageData.slidersDivs =
        this.KioskData.NoQueuePageData.slidersDivs.concat(sliderControl);
    }
  }

  private AddSliderToOffLinePage(sliderControl: SliderControl) {
    if (
      !this.KioskData.OffLinePageData.otherControls.some(
        (x) => x.Control.name === sliderControl.name
      )
    ) {
      this.KioskData.OffLinePageData.otherControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.KioskData.OffLinePageData.otherControls,
          sliderControl,
          sliderControl.name,
          false,
          false,
          false,
          true
        )
      );
    }
    if (
      !this.KioskData.OffLinePageData.slidersDivs.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.KioskData.OffLinePageData.slidersDivs =
        this.KioskData.OffLinePageData.slidersDivs.concat(sliderControl);
    }
  }
  /* #region  control click functions */

  LabelClick(control) {
    if (this.Page?.IsServicePage) {
      this.kioskLayoutService.OnServicePageOtherControlsSelection();
      const pageName = 'ServiceData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfLabelControl(control, pageName);
      this.AddServicePageDataToSubject();
    } else if (this.Page?.IsServiceQuestionPage) {
      this.kioskLayoutService.OnServiceQuestionPageOtherControlsSelection();
      const pageName = 'ServiceQuestionData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfLabelControl(control, pageName);
      this.AddServiceQuestionPageDataToSubject();
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.kioskLayoutService.OnGlobalQuestionPageOtherControlsSelection();
      const pageName = 'PreServiceQuestionData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfLabelControl(control, pageName);
      this.AddPreServiceQuestionPageDataToSubject();
    } else if (this.Page?.IsWelcomePage) {
      this.kioskLayoutService.OnWelcomePageOtherControlsSelection();
      const pageName = 'WelcomePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfLabelControl(control, pageName);
      this.AddWelcomePageDataToSubject();
    } else if (this.Page?.IsThankYouPage) {
      this.kioskLayoutService.OnThankYouPageOtherControlsSelection();
      const pageName = 'ThankYouPageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfLabelControl(control, pageName);
      this.AddThankYouPageDataToSubject();
    } else if (this.Page?.IsLanguagePage) {
      this.kioskLayoutService.OnLanguagePageOtherControlsSelection();
      const pageName = 'LanguagePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfLabelControl(control, pageName);
      this.AddLanguagePageDataToSubject();
    } else if (this.Page?.IsNoQueuePage) {
      this.kioskLayoutService.OnNoQueuePageOtherControlsSelection();
      const pageName = 'NoQueuePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfLabelControl(control, pageName);
      this.AddNoQueuePageDataToSubject();
    } else if (this.Page?.IsOffLinePage) {
      this.kioskLayoutService.OnOffLinePageOtherControlsSelection();
      const pageName = 'OffLinePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfLabelControl(control, pageName);
      this.AddOffLinePageDataToSubject();
    }
  }

  ImageClick(control) {
    if (this.Page?.IsServicePage) {
      this.kioskLayoutService.OnServicePageOtherControlsSelection();
      const pageName = 'ServiceData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfImageControl(control, pageName);
      this.AddServicePageDataToSubject();
    } else if (this.Page?.IsServiceQuestionPage) {
      this.kioskLayoutService.OnServiceQuestionPageOtherControlsSelection();
      const pageName = 'ServiceQuestionData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfImageControl(control, pageName);
      this.AddServiceQuestionPageDataToSubject();
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.kioskLayoutService.OnGlobalQuestionPageOtherControlsSelection();
      const pageName = 'PreServiceQuestionData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfImageControl(control, pageName);
      this.AddPreServiceQuestionPageDataToSubject();
    } else if (this.Page?.IsWelcomePage) {
      this.kioskLayoutService.OnWelcomePageOtherControlsSelection();
      const pageName = 'WelcomePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfImageControl(control, pageName);
      this.AddWelcomePageDataToSubject();
    } else if (this.Page?.IsThankYouPage) {
      this.kioskLayoutService.OnThankYouPageOtherControlsSelection();
      const pageName = 'ThankYouPageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfImageControl(control, pageName);
      this.AddThankYouPageDataToSubject();
    } else if (this.Page?.IsLanguagePage) {
      this.kioskLayoutService.OnLanguagePageOtherControlsSelection();
      const pageName = 'LanguagePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfImageControl(control, pageName);
      this.AddLanguagePageDataToSubject();
    } else if (this.Page?.IsNoQueuePage) {
      this.kioskLayoutService.OnNoQueuePageOtherControlsSelection();
      const pageName = 'NoQueuePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfImageControl(control, pageName);
      this.AddNoQueuePageDataToSubject();
    } else if (this.Page?.IsOffLinePage) {
      this.kioskLayoutService.OnOffLinePageOtherControlsSelection();
      const pageName = 'OffLinePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfImageControl(control, pageName);
      this.AddOffLinePageDataToSubject();
    }
  }

  VideoClick(control) {
    if (this.Page?.IsServicePage) {
      this.kioskLayoutService.OnServicePageOtherControlsSelection();
      const pageName = 'ServiceData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfVideoControl(control, pageName);
      this.AddServicePageDataToSubject();
    } else if (this.Page?.IsServiceQuestionPage) {
      this.kioskLayoutService.OnServiceQuestionPageOtherControlsSelection();
      const pageName = 'ServiceQuestionData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfVideoControl(control, pageName);
      this.AddServiceQuestionPageDataToSubject();
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.kioskLayoutService.OnGlobalQuestionPageOtherControlsSelection();
      const pageName = 'PreServiceQuestionData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfVideoControl(control, pageName);
      this.AddPreServiceQuestionPageDataToSubject();
    } else if (this.Page?.IsWelcomePage) {
      this.kioskLayoutService.OnWelcomePageOtherControlsSelection();
      const pageName = 'WelcomePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfVideoControl(control, pageName);
      this.AddWelcomePageDataToSubject();
    } else if (this.Page?.IsThankYouPage) {
      this.kioskLayoutService.OnThankYouPageOtherControlsSelection();
      const pageName = 'ThankYouPageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfVideoControl(control, pageName);
      this.AddThankYouPageDataToSubject();
    } else if (this.Page?.IsLanguagePage) {
      this.kioskLayoutService.OnLanguagePageOtherControlsSelection();
      const pageName = 'LanguagePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfVideoControl(control, pageName);
      this.AddLanguagePageDataToSubject();
    } else if (this.Page?.IsNoQueuePage) {
      this.kioskLayoutService.OnNoQueuePageOtherControlsSelection();
      const pageName = 'NoQueuePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfVideoControl(control, pageName);
      this.AddNoQueuePageDataToSubject();
    } else if (this.Page?.IsOffLinePage) {
      this.kioskLayoutService.OnOffLinePageOtherControlsSelection();
      const pageName = 'OffLinePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfVideoControl(control, pageName);
      this.AddOffLinePageDataToSubject();
    }
  }

  SliderClick(control) {
    if (this.Page?.IsServicePage) {
      this.kioskLayoutService.OnServicePageOtherControlsSelection();
      const pageName = 'ServiceData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfSliderControl(control, pageName);
      this.AddServicePageDataToSubject();
    } else if (this.Page?.IsServiceQuestionPage) {
      this.kioskLayoutService.OnServiceQuestionPageOtherControlsSelection();
      const pageName = 'ServiceQuestionData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfSliderControl(control, pageName);
      this.AddServiceQuestionPageDataToSubject();
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.kioskLayoutService.OnGlobalQuestionPageOtherControlsSelection();
      const pageName = 'PreServiceQuestionData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfSliderControl(control, pageName);
      this.AddPreServiceQuestionPageDataToSubject();
    } else if (this.Page?.IsWelcomePage) {
      this.kioskLayoutService.OnWelcomePageOtherControlsSelection();
      const pageName = 'WelcomePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfSliderControl(control, pageName);
      this.AddWelcomePageDataToSubject();
    } else if (this.Page?.IsThankYouPage) {
      this.kioskLayoutService.OnThankYouPageOtherControlsSelection();
      const pageName = 'ThankYouPageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfSliderControl(control, pageName);
      this.AddThankYouPageDataToSubject();
    } else if (this.Page?.IsLanguagePage) {
      this.kioskLayoutService.OnLanguagePageOtherControlsSelection();
      const pageName = 'LanguagePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfSliderControl(control, pageName);
      this.AddLanguagePageDataToSubject();
    } else if (this.Page?.IsNoQueuePage) {
      this.kioskLayoutService.OnNoQueuePageOtherControlsSelection();
      const pageName = 'NoQueuePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfSliderControl(control, pageName);
      this.AddNoQueuePageDataToSubject();
    } else if (this.Page?.IsOffLinePage) {
      this.kioskLayoutService.OnOffLinePageOtherControlsSelection();
      const pageName = 'OffLinePageData';
      this.SelectControlOnPage(control, pageName);
      this.UpdateSelectedPropertyOfSliderControl(control, pageName);
      this.AddOffLinePageDataToSubject();
    }
  }

  private SelectControlOnPage(control, pageName): void {
    this.KioskData[pageName].otherControls = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.KioskData[pageName].otherControls,
        control.name
      )
    );
  }

  private UpdateSelectedPropertyOfLabelControl(labelControl, pageName: string) {
    this.KioskData[pageName].imageDivs.map((x) => {
      x.selected = false;
    });

    this.KioskData[pageName].labelDivs.map((x) => {
      x.selected = false;
    });
    this.KioskData[pageName].labelDivs.find(
      (x) => x.name === labelControl.name
    ).selected = true;

    this.KioskData[pageName].videoDivs.map((x) => {
      x.selected = false;
    });

    this.KioskData[pageName].slidersDivs.map((x) => {
      x.selected = false;
    });
  }

  private UpdateSelectedPropertyOfImageControl(imageControl, pageName: string) {
    this.KioskData[pageName].imageDivs.map((x) => {
      x.selected = false;
    });
    this.KioskData[pageName].imageDivs.find(
      (x) => x.name === imageControl.name
    ).selected = true;

    this.KioskData[pageName].labelDivs.map((x) => {
      x.selected = false;
    });

    this.KioskData[pageName].videoDivs.map((x) => {
      x.selected = false;
    });

    this.KioskData[pageName].slidersDivs.map((x) => {
      x.selected = false;
    });
  }

  private UpdateSelectedPropertyOfVideoControl(videoControl, pageName: string) {
    this.KioskData[pageName].imageDivs.map((x) => {
      x.selected = false;
    });

    this.KioskData[pageName].labelDivs.map((x) => {
      x.selected = false;
    });

    this.KioskData[pageName].videoDivs.map((x) => {
      x.selected = false;
    });
    this.KioskData[pageName].videoDivs.find(
      (x) => x.name === videoControl.name
    ).selected = true;

    this.KioskData[pageName].slidersDivs.map((x) => {
      x.selected = false;
    });
  }

  private UpdateSelectedPropertyOfSliderControl(
    sliderControl,
    pageName: string
  ) {
    this.KioskData[pageName].imageDivs.map((x) => {
      x.selected = false;
    });

    this.KioskData[pageName].labelDivs.map((x) => {
      x.selected = false;
    });

    this.KioskData[pageName].videoDivs.map((x) => {
      x.selected = false;
    });

    this.KioskData[pageName].slidersDivs.map((x) => {
      x.selected = false;
    });
    this.KioskData[pageName].slidersDivs.find(
      (x) => x.name === sliderControl.name
    ).selected = true;
  }
  /* #endregion */

  /* #region  ServiceData function */

  ChangeServiceControlData(labelControl: Control) {
    if (this.Page?.IsServicePage) {
      this.KioskData.ServiceData = {
        otherControls: [].concat(
          this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
            this.KioskData.ServiceData.otherControls,
            labelControl.name
          )
        ),
        labelDivs: this.KioskData.ServiceData.labelDivs,
        imageDivs: this.KioskData.ServiceData.imageDivs,
        dropDownList: this.KioskData.ServiceData.dropDownList,
        panel: this.KioskData.ServiceData.panel,
        items: this.KioskData.ServiceData.items,
        videoDivs: this.KioskData.ServiceData.videoDivs,
        slidersDivs: this.KioskData.ServiceData.slidersDivs,
        buttons: [],
        otherControlCountData: this.KioskData.ServiceData.otherControlCountData,
        controlSelection: this.KioskData.ServiceData.controlSelection,
      };
      this.ServicePageDataSubject.next(this.KioskData.ServiceData);
    } else if (this.Page?.IsWelcomePage) {
      this.KioskData.WelcomePageData = {
        otherControls: [].concat(
          this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
            this.KioskData.WelcomePageData.otherControls,
            labelControl.name
          )
        ),
        labelDivs: [].concat(this.KioskData.WelcomePageData.labelDivs),
        imageDivs: this.KioskData.WelcomePageData.imageDivs,
        videoDivs: this.KioskData.WelcomePageData.videoDivs,
        slidersDivs: this.KioskData.WelcomePageData.slidersDivs,
        buttons: this.KioskData.WelcomePageData.buttons,
        otherControlCountData:
          this.KioskData.WelcomePageData.otherControlCountData,
        controlSelection: this.KioskData.WelcomePageData.controlSelection,
      };
      this.WelcomePageDataSubject.next(this.KioskData.WelcomePageData);
    } else if (this.Page?.IsThankYouPage) {
      this.KioskData.ThankYouPageData = {
        otherControls: [].concat(
          this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
            this.KioskData.ThankYouPageData.otherControls,
            labelControl.name
          )
        ),
        labelDivs: [].concat(this.KioskData.ThankYouPageData.labelDivs),
        imageDivs: this.KioskData.ThankYouPageData.imageDivs,
        videoDivs: this.KioskData.ThankYouPageData.videoDivs,
        slidersDivs: this.KioskData.ThankYouPageData.slidersDivs,
        thankYouPanel: this.KioskData.ThankYouPageData.thankYouPanel,
        otherControlCountData:
          this.KioskData.ThankYouPageData.otherControlCountData,
        buttons: [].concat(this.KioskData.ThankYouPageData.buttons),
        controlSelection: this.KioskData.ThankYouPageData.controlSelection,
      };
      this.ThankYouPageDataSubject.next(this.KioskData.ThankYouPageData);
    } else if (this.Page?.IsServiceQuestionPage) {
      this.KioskData.ServiceQuestionData = {
        otherControls: [].concat(
          this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
            this.KioskData.ServiceQuestionData.otherControls,
            labelControl.name
          )
        ),
        labelDivs: [].concat(this.KioskData.ServiceQuestionData.labelDivs),
        imageDivs: this.KioskData.ServiceQuestionData.imageDivs,
        dropDownList: this.KioskData.ServiceQuestionData.dropDownList,
        panel: this.KioskData.ServiceQuestionData.panel,
        items: this.KioskData.ServiceQuestionData.items,
        videoDivs: this.KioskData.ServiceQuestionData.videoDivs,
        questionSetList: this.KioskData.ServiceQuestionData.questionSetList,
        buttonList: this.KioskData.ServiceQuestionData.buttonList,
        slidersDivs: this.KioskData.ServiceQuestionData.slidersDivs,
        otherControlCountData:
          this.KioskData.ServiceQuestionData.otherControlCountData,
        controlSelection: this.KioskData.ServiceQuestionData.controlSelection,
      };
      this.ServiceQuestionDataSubject.next(this.KioskData.ServiceQuestionData);
    } else if (this.Page?.IsLanguagePage) {
      this.KioskData.LanguagePageData = {
        otherControls: [].concat(
          this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
            this.KioskData.LanguagePageData.otherControls,
            labelControl.name
          )
        ),
        labelDivs: [].concat(this.KioskData.LanguagePageData.labelDivs),
        imageDivs: this.KioskData.LanguagePageData.imageDivs,
        panel: this.KioskData.LanguagePageData.panel,
        videoDivs: this.KioskData.LanguagePageData.videoDivs,
        slidersDivs: this.KioskData.LanguagePageData.slidersDivs,
        otherControlCountData:
          this.KioskData.LanguagePageData.otherControlCountData,
        controlSelection: this.KioskData.LanguagePageData.controlSelection,
      };
      this.AddLanguagePageDataToSubject();
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.KioskData.PreServiceQuestionData = {
        otherControls: [].concat(
          this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
            this.KioskData.PreServiceQuestionData.otherControls,
            labelControl.name
          )
        ),
        labelDivs: [].concat(this.KioskData.PreServiceQuestionData.labelDivs),
        imageDivs: this.KioskData.PreServiceQuestionData.imageDivs,
        dropDownList: this.KioskData.PreServiceQuestionData.dropDownList,
        panel: this.KioskData.PreServiceQuestionData.panel,
        items: this.KioskData.PreServiceQuestionData.items,
        videoDivs: this.KioskData.PreServiceQuestionData.videoDivs,
        questionSetList: this.KioskData.PreServiceQuestionData.questionSetList,
        slidersDivs: this.KioskData.PreServiceQuestionData.slidersDivs,
        buttonList: this.KioskData.PreServiceQuestionData.buttonList,
        otherControlCountData:
          this.KioskData.PreServiceQuestionData.otherControlCountData,
        controlSelection:
          this.KioskData.PreServiceQuestionData.controlSelection,
      };
      this.PreServiceQuestionDataSubject.next(
        this.KioskData.PreServiceQuestionData
      );
    } else if (this.Page?.IsNoQueuePage) {
      this.KioskData.NoQueuePageData = {
        otherControls: [].concat(
          this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
            this.KioskData.NoQueuePageData.otherControls,
            labelControl.name
          )
        ),
        labelDivs: [].concat(this.KioskData.NoQueuePageData.labelDivs),
        imageDivs: this.KioskData.NoQueuePageData.imageDivs,
        videoDivs: this.KioskData.NoQueuePageData.videoDivs,
        slidersDivs: this.KioskData.NoQueuePageData.slidersDivs,
        buttons: this.KioskData.NoQueuePageData.buttons,
        otherControlCountData:
          this.KioskData.NoQueuePageData.otherControlCountData,
        controlSelection: this.KioskData.NoQueuePageData.controlSelection,
      };
      this.AddNoQueuePageDataToSubject();
    } else if (this.Page?.IsOffLinePage) {
      this.KioskData.OffLinePageData = {
        otherControls: [].concat(
          this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
            this.KioskData.OffLinePageData.otherControls,
            labelControl.name
          )
        ),
        labelDivs: [].concat(this.KioskData.OffLinePageData.labelDivs),
        imageDivs: this.KioskData.OffLinePageData.imageDivs,
        videoDivs: this.KioskData.OffLinePageData.videoDivs,
        slidersDivs: this.KioskData.OffLinePageData.slidersDivs,
        buttons: this.KioskData.OffLinePageData.buttons,
        otherControlCountData:
          this.KioskData.OffLinePageData.otherControlCountData,
        controlSelection: this.KioskData.OffLinePageData.controlSelection,
      };
      this.AddOffLinePageDataToSubject();
    }
  }

  ChangeDesignerPanel(control: DesignerPanelControl) {
    this.kioskLayoutService.ChangeDesignerPanel(control);
  }

  ControlMoveEnd(event) {
    if (this.Page?.IsServicePage) {
      this.kioskLayoutService.OnServicePageOtherControlsSelection();
      const control = this.KioskData.ServiceData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForMoveEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'ServiceData');
      this.ServicePageDataSubject.next(this.KioskData.ServiceData);
    } else if (this.Page?.IsWelcomePage) {
      this.kioskLayoutService.OnWelcomePageOtherControlsSelection();
      const control = this.KioskData.WelcomePageData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForMoveEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'WelcomePageData');
      this.WelcomePageDataSubject.next(this.KioskData.WelcomePageData);
    } else if (this.Page?.IsThankYouPage) {
      this.kioskLayoutService.OnThankYouPageOtherControlsSelection();
      const control = this.KioskData.ThankYouPageData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForMoveEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'ThankYouPageData');
      this.ThankYouPageDataSubject.next(this.KioskData.ThankYouPageData);
    } else if (this.Page?.IsServiceQuestionPage) {
      this.kioskLayoutService.OnServiceQuestionPageOtherControlsSelection();
      const control = this.KioskData.ServiceQuestionData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForMoveEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'ServiceQuestionData');
      this.ServiceQuestionDataSubject.next(this.KioskData.ServiceQuestionData);
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.kioskLayoutService.OnGlobalQuestionPageOtherControlsSelection();
      const control = this.KioskData.PreServiceQuestionData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForMoveEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'PreServiceQuestionData');
      this.PreServiceQuestionDataSubject.next(
        this.KioskData.PreServiceQuestionData
      );
    } else if (this.Page?.IsLanguagePage) {
      const control = this.KioskData.LanguagePageData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForMoveEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'LanguagePageData');
      this.kioskLayoutService.OnLanguagePageOtherControlsSelection();
      this.AddLanguagePageDataToSubject();
    } else if (this.Page?.IsNoQueuePage) {
      this.kioskLayoutService.OnNoQueuePageOtherControlsSelection();
      const control = this.KioskData.NoQueuePageData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForMoveEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'NoQueuePageData');
      this.NoQueuePageDataSubject.next(this.KioskData.NoQueuePageData);
    } else if (this.Page?.IsOffLinePage) {
      this.kioskLayoutService.OnOffLinePageOtherControlsSelection();
      const control = this.KioskData.OffLinePageData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForMoveEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'OffLinePageData');
      this.OffLinePageDataSubject.next(this.KioskData.OffLinePageData);
    }
  }

  ControlResizeEnd(event) {
    if (this.Page?.IsServicePage) {
      this.kioskLayoutService.OnServicePageOtherControlsSelection();
      const control = this.KioskData.ServiceData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForResizeEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'ServiceData');
      this.ServicePageDataSubject.next(this.KioskData.ServiceData);
    } else if (this.Page?.IsWelcomePage) {
      this.kioskLayoutService.OnWelcomePageOtherControlsSelection();
      const control = this.KioskData.WelcomePageData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForResizeEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'WelcomePageData');
      this.WelcomePageDataSubject.next(this.KioskData.WelcomePageData);
    } else if (this.Page?.IsServiceQuestionPage) {
      this.kioskLayoutService.OnServiceQuestionPageOtherControlsSelection();
      const control = this.KioskData.ServiceQuestionData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForResizeEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'ServiceQuestionData');
      this.ServiceQuestionDataSubject.next(this.KioskData.ServiceQuestionData);
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.kioskLayoutService.OnGlobalQuestionPageOtherControlsSelection();
      const control = this.KioskData.PreServiceQuestionData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForResizeEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'PreServiceQuestionData');
      this.PreServiceQuestionDataSubject.next(
        this.KioskData.PreServiceQuestionData
      );
    } else if (this.Page?.IsThankYouPage) {
      this.kioskLayoutService.OnThankYouPageOtherControlsSelection();
      const control = this.KioskData.ThankYouPageData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForResizeEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'ThankYouPageData');
      this.ThankYouPageDataSubject.next(this.KioskData.ThankYouPageData);
    } else if (this.Page?.IsLanguagePage) {
      this.kioskLayoutService.OnLanguagePageOtherControlsSelection();
      const control = this.KioskData.LanguagePageData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForResizeEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'LanguagePageData');
      this.AddLanguagePageDataToSubject();
    } else if (this.Page?.IsNoQueuePage) {
      this.kioskLayoutService.OnNoQueuePageOtherControlsSelection();
      const control = this.KioskData.NoQueuePageData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForResizeEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'NoQueuePageData');
      this.NoQueuePageDataSubject.next(this.KioskData.NoQueuePageData);
    } else if (this.Page?.IsOffLinePage) {
      this.kioskLayoutService.OnOffLinePageOtherControlsSelection();
      const control = this.KioskData.OffLinePageData.otherControls.find(
        (x) => x.Control === event.control
      );
      this.UpdateControlFormAndPropertiesForResizeEnd(control, event);
      this.SelectAndHighLightBasedOnControl(control, 'OffLinePageData');
      this.OffLinePageDataSubject.next(this.KioskData.OffLinePageData);
    }
  }

  private UpdateControlFormAndPropertiesForResizeEnd(control: DDLControl, event: any) {
    const width = this.IsOnlyGrid
      ? RoundOffProperty(event.event.size.width, this.GridSize)
      : event.event.size.width;
    const height = this.IsOnlyGrid
      ? RoundOffProperty(event.event.size.height, this.GridSize)
      : event.event.size.height;
    control.Control.form.controls.width.setValue(width);
    control.Control.form.controls.height.setValue(height);
    control.Control.styles.width = width;
    control.Control.styles.height = height;
  }

  private UpdateControlFormAndPropertiesForMoveEnd(control: DDLControl, event: any){
    control.Control.form.controls.top.setValue(event.event.y);
    control.Control.form.controls.left.setValue(event.event.x);
    control.Control.styles.left = event.event.x;
    control.Control.styles.top = event.event.y;
  }

  private SelectAndHighLightBasedOnControl(
    control: DDLControl,
    pageName: string
  ) {
    this.SelectControlOnPage(control.Control, pageName);
    if (control.IsImageControl) {
      this.UpdateSelectedPropertyOfImageControl(control.Control, pageName);
    } else if (control.IsVideoControl) {
      this.UpdateSelectedPropertyOfVideoControl(control.Control, pageName);
    } else if (control.IsSliderControl) {
      this.UpdateSelectedPropertyOfSliderControl(control.Control, pageName);
    } else if (control.IsLabelControl) {
      this.UpdateSelectedPropertyOfLabelControl(control.Control, pageName);
    }
  }

  ShowServicesOtherControlPropertyWindow(name: string) {
    if (this.Page?.IsServicePage) {
      this.KioskData.ServiceData.otherControls.map(
        (x) => (x.ShowPropertyWindow = false)
      );
      this.KioskData.ServiceData.otherControls.find(
        (x) => x.Control.name === name
      ).ShowPropertyWindow = true;
      this.ServicePageDataSubject.next(this.KioskData.ServiceData);
    } else if (this.Page?.IsWelcomePage) {
      this.KioskData.WelcomePageData.otherControls.map(
        (x) => (x.ShowPropertyWindow = false)
      );
      this.KioskData.WelcomePageData.otherControls.find(
        (x) => x.Control.name === name
      ).ShowPropertyWindow = true;
      this.WelcomePageDataSubject.next(this.KioskData.WelcomePageData);
    } else if (this.Page?.IsServiceQuestionPage) {
      this.KioskData.ServiceQuestionData.otherControls.map(
        (x) => (x.ShowPropertyWindow = false)
      );
      this.KioskData.ServiceQuestionData.otherControls.find(
        (x) => x.Control.name === name
      ).ShowPropertyWindow = true;
      this.ServiceQuestionDataSubject.next(this.KioskData.ServiceQuestionData);
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.KioskData.PreServiceQuestionData.otherControls.map(
        (x) => (x.ShowPropertyWindow = false)
      );
      this.KioskData.PreServiceQuestionData.otherControls.find(
        (x) => x.Control.name === name
      ).ShowPropertyWindow = true;
      this.PreServiceQuestionDataSubject.next(
        this.KioskData.PreServiceQuestionData
      );
    } else if (this.Page?.IsThankYouPage) {
      this.KioskData.ThankYouPageData.otherControls.map(
        (x) => (x.ShowPropertyWindow = false)
      );
      this.KioskData.ThankYouPageData.otherControls.find(
        (x) => x.Control.name === name
      ).ShowPropertyWindow = true;
      this.ThankYouPageDataSubject.next(this.KioskData.ThankYouPageData);
    } else if (this.Page?.IsLanguagePage) {
      this.KioskData.LanguagePageData.otherControls.map(
        (x) => (x.ShowPropertyWindow = false)
      );
      this.KioskData.LanguagePageData.otherControls.find(
        (x) => x.Control.name === name
      ).ShowPropertyWindow = true;
      this.AddLanguagePageDataToSubject();
    } else if (this.Page?.IsNoQueuePage) {
      this.KioskData.NoQueuePageData.otherControls.map(
        (x) => (x.ShowPropertyWindow = false)
      );
      this.KioskData.NoQueuePageData.otherControls.find(
        (x) => x.Control.name === name
      ).ShowPropertyWindow = true;
      this.AddNoQueuePageDataToSubject();
    } else if (this.Page?.IsOffLinePage) {
      this.KioskData.OffLinePageData.otherControls.map(
        (x) => (x.ShowPropertyWindow = false)
      );
      this.KioskData.OffLinePageData.otherControls.find(
        (x) => x.Control.name === name
      ).ShowPropertyWindow = true;
      this.AddOffLinePageDataToSubject();
    }
  }

  RemoveLabel(control: any) {
    if (this.Page?.IsServiceQuestionPage) {
      this.KioskData.ServiceQuestionData.labelDivs.splice(
        this.KioskData.ServiceQuestionData.labelDivs.indexOf(control),
        1
      );
      this.KioskData.ServiceQuestionData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.ServiceQuestionData.otherControls,
          control
        )
      );
      this.ServiceQuestionDataSubject.next(this.KioskData.ServiceQuestionData);
    } else if (this.Page?.IsServicePage) {
      this.KioskData.ServiceData.labelDivs.splice(
        this.KioskData.ServiceData.labelDivs.indexOf(control),
        1
      );
      this.KioskData.ServiceData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.ServiceData.otherControls,
          control
        )
      );
      this.ServicePageDataSubject.next(this.KioskData.ServiceData);
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.KioskData.PreServiceQuestionData.labelDivs.splice(
        this.KioskData.PreServiceQuestionData.labelDivs.indexOf(control),
        1
      );
      this.KioskData.PreServiceQuestionData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.PreServiceQuestionData.otherControls,
          control
        )
      );
      this.PreServiceQuestionDataSubject.next(
        this.KioskData.PreServiceQuestionData
      );
    } else if (this.Page?.IsWelcomePage) {
      this.KioskData.WelcomePageData.labelDivs.splice(
        this.KioskData.WelcomePageData.labelDivs.indexOf(control),
        1
      );
      this.KioskData.WelcomePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.WelcomePageData.otherControls,
          control
        )
      );
      this.WelcomePageDataSubject.next(this.KioskData.WelcomePageData);
    } else if (this.Page?.IsThankYouPage) {
      this.KioskData.ThankYouPageData.labelDivs.splice(
        this.KioskData.ThankYouPageData.labelDivs.indexOf(control),
        1
      );
      this.KioskData.ThankYouPageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.ThankYouPageData.otherControls,
          control
        )
      );
      this.ThankYouPageDataSubject.next(this.KioskData.ThankYouPageData);
    } else if (this.Page?.IsLanguagePage) {
      this.KioskData.LanguagePageData.labelDivs.splice(
        this.KioskData.LanguagePageData.labelDivs.indexOf(control),
        1
      );
      this.KioskData.LanguagePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.LanguagePageData.otherControls,
          control
        )
      );
      this.AddLanguagePageDataToSubject();
    } else if (this.Page?.IsNoQueuePage) {
      this.KioskData.NoQueuePageData.labelDivs.splice(
        this.KioskData.NoQueuePageData.labelDivs.indexOf(control),
        1
      );
      this.KioskData.NoQueuePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.NoQueuePageData.otherControls,
          control
        )
      );
      this.NoQueuePageDataSubject.next(this.KioskData.NoQueuePageData);
    } else if (this.Page?.IsOffLinePage) {
      this.KioskData.OffLinePageData.labelDivs.splice(
        this.KioskData.OffLinePageData.labelDivs.indexOf(control),
        1
      );
      this.KioskData.OffLinePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.OffLinePageData.otherControls,
          control
        )
      );
      this.OffLinePageDataSubject.next(this.KioskData.OffLinePageData);
    }
    this.kioskLayoutService.HandleAllControlZIndex(control.styles.zindex)
  }

  RemoveImage(control: any) {
    if (this.Page?.IsServiceQuestionPage) {
      this.KioskData.ServiceQuestionData.imageDivs.splice(
        this.KioskData.ServiceQuestionData.imageDivs.indexOf(control),
        1
      );
      this.KioskData.ServiceQuestionData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.ServiceQuestionData.otherControls,
          control
        )
      );
      this.ServiceQuestionDataSubject.next(this.KioskData.ServiceQuestionData);
    } else if (this.Page?.IsServicePage) {
      this.KioskData.ServiceData.imageDivs.splice(
        this.KioskData.ServiceData.imageDivs.indexOf(control),
        1
      );
      this.KioskData.ServiceData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.ServiceData.otherControls,
          control
        )
      );
      this.ServicePageDataSubject.next(this.KioskData.ServiceData);
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.KioskData.PreServiceQuestionData.imageDivs.splice(
        this.KioskData.PreServiceQuestionData.imageDivs.indexOf(control),
        1
      );
      this.KioskData.PreServiceQuestionData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.PreServiceQuestionData.otherControls,
          control
        )
      );
      this.PreServiceQuestionDataSubject.next(
        this.KioskData.PreServiceQuestionData
      );
    } else if (this.Page?.IsWelcomePage) {
      this.KioskData.WelcomePageData.imageDivs.splice(
        this.KioskData.WelcomePageData.imageDivs.indexOf(control),
        1
      );
      this.KioskData.WelcomePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.WelcomePageData.otherControls,
          control
        )
      );
      this.WelcomePageDataSubject.next(this.KioskData.WelcomePageData);
    } else if (this.Page?.IsThankYouPage) {
      this.KioskData.ThankYouPageData.imageDivs.splice(
        this.KioskData.ThankYouPageData.imageDivs.indexOf(control),
        1
      );
      this.KioskData.ThankYouPageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.ThankYouPageData.otherControls,
          control
        )
      );
      this.ThankYouPageDataSubject.next(this.KioskData.ThankYouPageData);
    } else if (this.Page?.IsLanguagePage) {
      this.KioskData.LanguagePageData.imageDivs.splice(
        this.KioskData.LanguagePageData.imageDivs.indexOf(control),
        1
      );
      this.KioskData.LanguagePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.LanguagePageData.otherControls,
          control
        )
      );
      this.AddLanguagePageDataToSubject();
    } else if (this.Page?.IsNoQueuePage) {
      this.KioskData.NoQueuePageData.imageDivs.splice(
        this.KioskData.NoQueuePageData.imageDivs.indexOf(control),
        1
      );
      this.KioskData.NoQueuePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.NoQueuePageData.otherControls,
          control
        )
      );
      this.NoQueuePageDataSubject.next(this.KioskData.NoQueuePageData);
    } else if (this.Page?.IsOffLinePage) {
      this.KioskData.OffLinePageData.imageDivs.splice(
        this.KioskData.OffLinePageData.imageDivs.indexOf(control),
        1
      );
      this.KioskData.OffLinePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.OffLinePageData.otherControls,
          control
        )
      );
      this.OffLinePageDataSubject.next(this.KioskData.OffLinePageData);
    }
    this.kioskLayoutService.HandleAllControlZIndex(control.styles.zindex)
  }
  RemoveVideo(control: any) {
    if (this.Page?.IsServiceQuestionPage) {
      this.KioskData.ServiceQuestionData.videoDivs.splice(
        this.KioskData.ServiceQuestionData.videoDivs.indexOf(control),
        1
      );
      this.KioskData.ServiceQuestionData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.ServiceQuestionData.otherControls,
          control
        )
      );
      this.ServiceQuestionDataSubject.next(this.KioskData.ServiceQuestionData);
    } else if (this.Page?.IsServicePage) {
      this.KioskData.ServiceData.videoDivs.splice(
        this.KioskData.ServiceData.videoDivs.indexOf(control),
        1
      );
      this.KioskData.ServiceData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.ServiceData.otherControls,
          control
        )
      );
      this.ServicePageDataSubject.next(this.KioskData.ServiceData);
    } else if (this.Page?.IsPreServiceQuestionPage) {
      this.KioskData.PreServiceQuestionData.videoDivs.splice(
        this.KioskData.PreServiceQuestionData.videoDivs.indexOf(control),
        1
      );
      this.KioskData.PreServiceQuestionData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.PreServiceQuestionData.otherControls,
          control
        )
      );
      this.PreServiceQuestionDataSubject.next(
        this.KioskData.PreServiceQuestionData
      );
    } else if (this.Page?.IsWelcomePage) {
      this.KioskData.WelcomePageData.videoDivs.splice(
        this.KioskData.WelcomePageData.videoDivs.indexOf(control),
        1
      );
      this.KioskData.WelcomePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.WelcomePageData.otherControls,
          control
        )
      );
      this.WelcomePageDataSubject.next(this.KioskData.WelcomePageData);
    } else if (this.Page?.IsThankYouPage) {
      this.KioskData.ThankYouPageData.videoDivs.splice(
        this.KioskData.ThankYouPageData.videoDivs.indexOf(control),
        1
      );
      this.KioskData.ThankYouPageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.ThankYouPageData.otherControls,
          control
        )
      );
      this.ThankYouPageDataSubject.next(this.KioskData.ThankYouPageData);
    } else if (this.Page?.IsLanguagePage) {
      this.KioskData.LanguagePageData.videoDivs.splice(
        this.KioskData.LanguagePageData.videoDivs.indexOf(control),
        1
      );
      this.KioskData.LanguagePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.LanguagePageData.otherControls,
          control
        )
      );
      this.AddLanguagePageDataToSubject();
    } else if (this.Page?.IsNoQueuePage) {
      this.KioskData.NoQueuePageData.videoDivs.splice(
        this.KioskData.NoQueuePageData.videoDivs.indexOf(control),
        1
      );
      this.KioskData.NoQueuePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.NoQueuePageData.otherControls,
          control
        )
      );
      this.NoQueuePageDataSubject.next(this.KioskData.NoQueuePageData);
    } else if (this.Page?.IsOffLinePage) {
      this.KioskData.OffLinePageData.videoDivs.splice(
        this.KioskData.OffLinePageData.videoDivs.indexOf(control),
        1
      );
      this.KioskData.OffLinePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.OffLinePageData.otherControls,
          control
        )
      );
      this.OffLinePageDataSubject.next(this.KioskData.OffLinePageData);
    }
    this.kioskLayoutService.HandleAllControlZIndex(control.styles.zindex)
  }
  RemoveSlider(control: any) {
    if (this.Page?.IsServicePage) {
      this.KioskData.ServiceData.slidersDivs.splice(
        this.KioskData.ServiceData.slidersDivs.indexOf(control),
        1
      );
      this.KioskData.ServiceData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.ServiceData.otherControls,
          control
        )
      );
      this.ServicePageDataSubject.next(this.KioskData.ServiceData);
    }
    if (this.Page?.IsServiceQuestionPage) {
      this.KioskData.ServiceQuestionData.slidersDivs.splice(
        this.KioskData.ServiceQuestionData.slidersDivs.indexOf(control),
        1
      );
      this.KioskData.ServiceQuestionData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.ServiceQuestionData.otherControls,
          control
        )
      );
      this.ServiceQuestionDataSubject.next(this.KioskData.ServiceQuestionData);
    }
    if (this.Page?.IsPreServiceQuestionPage) {
      this.KioskData.PreServiceQuestionData.slidersDivs.splice(
        this.KioskData.PreServiceQuestionData.slidersDivs.indexOf(control),
        1
      );
      this.KioskData.PreServiceQuestionData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.PreServiceQuestionData.otherControls,
          control
        )
      );
      this.PreServiceQuestionDataSubject.next(
        this.KioskData.PreServiceQuestionData
      );
    }
    if (this.Page?.IsWelcomePage) {
      this.KioskData.WelcomePageData.slidersDivs.splice(
        this.KioskData.WelcomePageData.slidersDivs.indexOf(control),
        1
      );
      this.KioskData.WelcomePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.WelcomePageData.otherControls,
          control
        )
      );
      this.WelcomePageDataSubject.next(this.KioskData.WelcomePageData);
    }
    if (this.Page?.IsThankYouPage) {
      this.KioskData.ThankYouPageData.slidersDivs.splice(
        this.KioskData.ThankYouPageData.slidersDivs.indexOf(control),
        1
      );
      this.KioskData.ThankYouPageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.ThankYouPageData.otherControls,
          control
        )
      );
      this.ThankYouPageDataSubject.next(this.KioskData.ThankYouPageData);
    }
    if (this.Page?.IsLanguagePage) {
      this.KioskData.LanguagePageData.slidersDivs.splice(
        this.KioskData.LanguagePageData.slidersDivs.indexOf(control),
        1
      );
      this.KioskData.LanguagePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.LanguagePageData.otherControls,
          control
        )
      );
      this.AddLanguagePageDataToSubject();
    }
    if (this.Page?.IsNoQueuePage) {
      this.KioskData.NoQueuePageData.slidersDivs.splice(
        this.KioskData.NoQueuePageData.slidersDivs.indexOf(control),
        1
      );
      this.KioskData.NoQueuePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.NoQueuePageData.otherControls,
          control
        )
      );
      this.NoQueuePageDataSubject.next(this.KioskData.NoQueuePageData);
    }
    if (this.Page?.IsOffLinePage) {
      this.KioskData.OffLinePageData.slidersDivs.splice(
        this.KioskData.OffLinePageData.slidersDivs.indexOf(control),
        1
      );
      this.KioskData.OffLinePageData.otherControls = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.KioskData.OffLinePageData.otherControls,
          control
        )
      );
      this.OffLinePageDataSubject.next(this.KioskData.OffLinePageData);
    }
    this.kioskLayoutService.HandleAllControlZIndex(control.styles.zindex)
  }

  private ResetOtherControlPropertyWindow(otherControls, control) {
    const index = otherControls.indexOf(
      otherControls.find((x) => x.Control.name === control.name)
    );
    otherControls.splice(index, 1);
    if (index !== 0) {
      this.ShowServicesOtherControlPropertyWindow(
        otherControls[index - 1].Control.name
      );
    } else if (otherControls.length !== 0) {
      this.ShowServicesOtherControlPropertyWindow(
        otherControls[index].Control.name
      );
    }
    return otherControls;
  }

  /* #endregion */

  private AddNewControlToOtherControlListAndGetOtherControlList(
    ddlControl: Array<DDLControl>,
    control: Control,
    name: string,
    isLabelControl: boolean,
    isImageControl: boolean,
    isVideoControl: boolean,
    isSliderControl: boolean = false
  ) {
    ddlControl.push({
      ShowPropertyWindow: false,
      Control: control,
      IsLabelControl: isLabelControl,
      IsImageControl: isImageControl,
      IsVideoControl: isVideoControl,
      IsSliderControl: isSliderControl,
    });
    return this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
      ddlControl,
      name
    );
  }

  private GetOtherControlsListAfterSettingShowPropertyWindowvalue(
    ddlControl: Array<DDLControl>,
    name: string
  ) {
    ddlControl.map((x) => (x.ShowPropertyWindow = false));
    ddlControl.find((x) => x.Control.name === name).ShowPropertyWindow = true;
    return ddlControl;
  }

  /* #region control creation methods */

  CreateImageControl(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    x: number,
    y: number,
    defaultZindex: number
  ) {
    const imageControl = new ImageControl(
      this.formBuilder,
      name,
      src,
      defaultWidth,
      defaultHeight,
      x,
      y,
      defaultZindex
    );
    return imageControl;
  }
  CreateVideoControl(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    x: number,
    y: number,
    defaultZindex: number
  ) {
    const videoControl = new VideoControl(
      this.formBuilder,
      name,
      src,
      defaultWidth,
      defaultHeight,
      x,
      y,
      defaultZindex
    );
    return videoControl;
  }
  CreateLabelControl(
    name: string,
    defaultText: any,
    defaultColor: string,
    defaultWidth: number,
    defaultHeight: number,
    y: number,
    x: number,
    defaultZindex: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string,
    alignment: string = this.Alignment,
    backgroundColor: string
  ) {
    return new LabelControl(
      this.formBuilder,
      name,
      defaultText,
      defaultColor,
      defaultWidth,
      defaultHeight,
      y,
      x,
      defaultZindex,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      alignment,
      backgroundColor
    );
  }

  CreateSliderControl(
    name: string,
    defaultWidth: number,
    defaultHeight: number,
    y: number,
    x: number,
    defaultZindex: number
  ) {
    return new SliderControl(
      this.formBuilder,
      name,
      [],
      defaultWidth,
      defaultHeight,
      y,
      x,
      defaultZindex
    );
  }

  CreateButtonControl(
    name,
    text,
    color,
    bGColor,
    width,
    height,
    fontSize,
    fontStyle,
    font,
    fontWeight,
    selected,
    left,
    top,
    src,
    showIcon,
    boxRoundCorners,
    border,
    borderColor,
    shadow
  ): ButtonControl {
    return new ButtonControl(
      this.formBuilder,
      name,
      text,
      color,
      bGColor,
      width,
      height,
      fontSize,
      fontStyle,
      font,
      fontWeight,
      selected,
      left,
      top,
      src,
      showIcon,
      boxRoundCorners,
      border,
      borderColor,
      shadow
    );
  }
  /* #endregion */

  ConvertTranslatedLanguageArrayToObject(arr) {
    return this.kioskLayoutService.ConvertTranslatedLanguageArrayToObject(arr);
  }

  SetImageFormArray(src: ILanguageControl[]) {
    this.ImageFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach((ele) => {
        const imageSrc =
          src.find((x) => x.languageCode === ele.languageCode)?.url ||
          '/assets/img-icon.svg';
        this.ImageFormArraySubject.value.push(
          this.formBuilder.group({
            language: ele.language,
            languageCode: ele.languageCode,
            [ele.languageCode]: [
              imageSrc,
              [
                requiredFileType(
                  SupportedImageFileTypes,
                  SupportedImageFileSize
                ),
              ],
            ],
            url: imageSrc,
          })
        );
      });
    }
    this.ImageFormArraySubject.next(
      Object.create(this.ImageFormArraySubject.value)
    );
  }
}
