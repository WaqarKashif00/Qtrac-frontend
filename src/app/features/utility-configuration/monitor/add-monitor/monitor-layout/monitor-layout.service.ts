import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { DynamicVariableService } from '../../../../../core/services/dynamic-variables.service';
import { cloneObject, getTimeStampSplitedFileName as GetTimeStampSplitFileName } from '../../../../../core/utilities/core-utilities';
import { IDynamicVariable } from '../../../../../models/common/dynamic-variable.interface';
import { ILanguageDropdownList } from '../../../../../models/common/language-dropdownlist.interface';
import { Language } from '../../../../../models/enums/language-enum';
import { CompanyAPIService } from '../../../../../shared/api-services/company-api.service';
import { MonitorAPIService } from '../../../../../shared/api-services/monitor-api.service';
import { WorkflowAPIService } from '../../../../../shared/api-services/workflow-api.service';
import { MonitorService } from '../../monitor.service';
import { MonitorAddService } from '../add-monitor.service';
import { IConfiguration } from './Models/configuration.interface';
import { IControlSelection } from './Models/controls-selection.interface';
import { DesignerPanelControl } from './Models/controls/designer-panel.control';
import { ImageControl } from './Models/controls/image.control';
import { LabelControl } from './Models/controls/label.control';
import { NextUpControl } from './Models/controls/next-up.control';
import { NowCallingControl } from './Models/controls/now-calling.control';
import { NowHelpingControl } from './Models/controls/now-helping.control';
import { SliderControl } from './Models/controls/slider.control';
import { VideoControl } from './Models/controls/video.control';
import {
  IMonitorDesignerData,
  IMonitorImageControlData,
  IMonitorLabelControlData,
  IMonitorLayoutData,
  IMonitorNextUpData,
  IMonitorNowCallingData,
  IMonitorNowHelpingData,
  IMonitorSliderControlData,
  IMonitorVideoControlData
} from './Models/monitor-layout-data';
import { MonitorOtherControlsCountDetail } from './Models/monitor-other-controls-count-details.interface';
import {
  IMonitorSliderControlPostPreview,
  IMonitorSliderControlPreview
} from './Models/monitor-slider-control-preview.interface';
import { IPageData } from './Models/page-data.interface';
import { IWorkFlowDetail } from './Models/work-flow-detail.interface';

@Injectable()
export class MonitorLayoutService extends AbstractComponentService {
  private PageDataSubject: BehaviorSubject<IPageData>;
  PageData$: Observable<IPageData>;
  private SelectedLanguageSubject: BehaviorSubject<string>;
  SelectedLanguage$: Observable<string>;
  private LanguagesSubject: BehaviorSubject<ILanguageDropdownList[]>;
  Languages$: Observable<ILanguageDropdownList[]>;
  private DynamicVariablesSubject: BehaviorSubject<IDynamicVariable[]>;
  DynamicVariables$: Observable<IDynamicVariable[]>;
  private ControlSelectionSubject: BehaviorSubject<IControlSelection>;
  ControlSelection$: Observable<IControlSelection>;
  QueueData$:Observable<any>;
  QueueDataSubject:BehaviorSubject<any>;

  PageData: IPageData;
  WorkFlowData: IWorkFlowDetail;
  IsEditMode: boolean;
  IsEditMode$: Observable<boolean>;
  selectedLanaguage

  IsValidLayoutData = true;
  SaveMonitor = 'save';
  SaveMonitorAsDraft = 'saveAsDraft';
  Alignment = 'center';
  BackgroundColor = 'rgba(0, 0, 0, 0)';

  //#region Constants
  FontStyles = {
    text: '',
    backgroundColor: '#fff',
    backgroundImage: '',
    color: '#707071',
    boxShadow: true,
    boxRoundCorners: '5',
    titleFont: 'Arial',
    titleFontSize: 14,
    titleFontStyle: 'Normal',
    titleTextColor: '#707071',
    font: 'Arial',
    fontStyle: 'Normal',
    fontSize: 14,
    height: 150,
    width: 210,
    top: 80,
    left: 390,
    src: '',
    fontWeight: 'normal',
    titleFontWeight: 'bold',
  };
  NowHelpingFontStyles = {
    text: { en: 'Now Helping' },
    top: 273,
    left: 426,
    titleFontSize: 25,
    fontSize: 40,
  };
  NowCallingFontStyles = {
    text: { en: 'Now Calling' },
    top: 272,
    left: 41,
    fontSize: 14,
  };
  NowCallingColumns = {
    columnOne: "%request.ticketnumber%",
    columnTwo: "%request.calledatdesk%"
  }
  NowHelpingColumns = {
    columnOne: "%request.ticketnumber%",
    columnTwo: "%request.calledatdesk%"
  }
  NextUpFontStyles = {
    text: { en: 'Next Up' },
    top: 64,
    left: 421,
  };
  DesignerPanelFontStyles = {
    width: 848,
    height: 521,
    backgroundColor: '#aa9c9c',
    fontStyle: 'Italic',
  };
  DesignerPanel = {
    cellSize: 50,
    showGrid: false,
    enableSoundAlert: false,
    enableTextToSpeech:false,
    textToSpeachTimer:10,
    queueType:"Combined Queue",
    selectedQueues:[],
  };
  NextUp = {
    displayNoOfCustomers: 10,
    columnOne: "%request.ticketnumber%",
    columnTwo: "%service.name%"
  };
  //#endregion

  get CompanyId() {
    return this.authService.CompanyId;
  }

  constructor(
    private readonly addMonitorService: MonitorAddService,
    private readonly companyAPIService: CompanyAPIService,
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly monitorAPIService: MonitorAPIService,
    private readonly dynamicVariablesService: DynamicVariableService,
    private readonly monitorService: MonitorService
  ) {
    super();
    this.CallInitializeFunctions();
  }

  private CallInitializeFunctions() {
    this.SubscribeObservables();
    this.InitializeObjects();
    this.CallLanguageListAPI();
    this.InitializeSubjects();
  }

  private SubscribeObservables() {
    this.subs.sink = this.addMonitorService.PageData$.subscribe((pageData) => {
      this.InitializeMonitorPageData(pageData);
    });
    this.subs.sink = this.addMonitorService.WorkFlow$.subscribe((workFlow) => {
      this.InitializeMonitorWorkflowData(workFlow);
    });
    this.subs.sink = this.addMonitorService.IsEditMode$.subscribe(
      (isEditMode) => {
        this.IsEditMode = isEditMode;
      }
    );
  }

  private InitializeMonitorWorkflowData(workFlow: IWorkFlowDetail) {
    this.WorkFlowData = workFlow;
    if (workFlow) {
      // this.QueueDataSubject.next(workFlow.queue);
      this.dynamicVariablesService
        .GetDynamicVariables(workFlow, true, false, false)
        .subscribe((allVariables) => {
          this.GetVariables(allVariables);
        });
    }
  }

  private InitializeMonitorPageData(pageData: IMonitorLayoutData) {
    if (pageData) {
      this.SetOtherControlsandDataInLayputPageFromLayoutDataOfDB(pageData);
      this.SetMonitorLayoutControlsDataInRespectiveFormsFromDB(pageData);
      this.PageDataSubject.next(this.PageData);
    }
  }

  private GetVariables(allVariables: IDynamicVariable[]) {
    if (allVariables && Array.isArray(allVariables)) {
      const DynamicVariables = [];
      allVariables.forEach((variables: any) => {
        DynamicVariables.push({
          data_type: variables.data_type,
          id: variables.id,
          shortName: variables.friendlyName,
          type: variables.type,
          fieldName: variables.shortName,
        });
      });
      this.DynamicVariablesSubject.next(DynamicVariables);
    }
  }

  private InitializeObjects() {
    this.InitializeLocalDataWithDefaultValues();
  }

  private InitializeLocalDataWithDefaultValues() {
    this.PageData = {
      manageControls: [],
      allControls: this.GetDefaultAllControlsData(),
      designerScreen: this.CreateAndReturnDefaultDesignPanel(),
      nextUpControl: this.CreateAndReturnDefaultNextUpControl(),
      nowCallingControl: this.CreateAndReturnDefaultNowCallingControl(),
      nowHelpingControl: this.CreateAndReturnNowHelpingControl(),
      controlsCount: this.GetOtherControlsInitialCounts(),
    };
  }

  private InitializeSubjects() {
    this.PageDataSubject = new BehaviorSubject<IPageData>(this.PageData);
    this.PageData$ = this.PageDataSubject.asObservable();
    this.LanguagesSubject = new BehaviorSubject<ILanguageDropdownList[]>([]);
    this.Languages$ = this.LanguagesSubject.asObservable();
    this.SelectedLanguageSubject = new BehaviorSubject(Language.English);
    this.SelectedLanguage$ = this.SelectedLanguageSubject.asObservable();
    this.IsEditMode$ = this.addMonitorService.IsEditMode$;
    this.DynamicVariablesSubject = new BehaviorSubject<IDynamicVariable[]>([]);
    this.DynamicVariables$ = this.DynamicVariablesSubject.asObservable();
    this.ControlSelectionSubject = new BehaviorSubject<IControlSelection>({
      IsNextUpControlSelected: false,
      IsNowCallingControlSelected: false,
      IsNowHelpingControlSelected: false,
      IsOtherControlsSelected: false,
    });
    this.QueueDataSubject = new BehaviorSubject<any[]>([]);
    this.QueueData$ = this.QueueDataSubject.asObservable();



    this.ControlSelection$ = this.ControlSelectionSubject.asObservable();
  }

  private CallLanguageListAPI() {
    this.companyAPIService
      .GetLanguages(this.authService.CompanyId)
      .subscribe((x: ILanguageDropdownList[]) => {
        this.LanguagesSubject.next(x);
      });
  }


  getQueues(){
    this.workflowAPIService.GetQueues(this.authService.CompanyId,this.PageData.designerScreen.workFlowId).subscribe((data)=> {      
    })
  }

  UpdateImageVideoSrcInExistingMonitor(src) {
    if (typeof src === 'string' && this.LanguagesSubject.value) {
      const imageSrc = [];
      this.LanguagesSubject.value.forEach((lang) => {
        imageSrc.push({
          languageCode: lang.languageCode,
          language: lang.language,
          url: lang.isDefault ? src : '',
        });
      });
      return imageSrc;
    }
    return src;
  }

  UpdateSliderSrcInExistingMonitor(src) {
    const data = [];
    src.forEach((x) => {
      if (typeof x.url === 'string') {
        this.LanguagesSubject.value.forEach((lang) => {
          data.push({
            type: x.type,
            url: lang.isDefault ? x.url : [],
            name: lang.isDefault ? this.GetFileName(x.url) : '',
            version: 'Old',
            languageCode: lang.languageCode,
          });
        });
        return this.GetLanguageWiseSrc(data);
      }
    });
    return src;
  }

  GetFileName(url: string) {
    const extractedFileName = url.split('/');
    return GetTimeStampSplitFileName(
      extractedFileName[extractedFileName.length - 1]
    );
  }

  GetLanguageWiseSrc(urls) {
    const src = [];
    this.LanguagesSubject.value.forEach((lang) => {
      src.push({
        language: lang.language,
        languageCode: lang.languageCode,
        url: lang.isDefault ? urls : [],
      });
    });
    return src;
  }

  private SetOtherControlsandDataInLayputPageFromLayoutDataOfDB(
    x: IMonitorLayoutData
  ) {
    this.PageData.allControls = {
      imageDivs: this.CreateAndReturnImageControlsFromImagesDataFromDB(
        x.monitorPageData.images
      ),
      labelDivs: this.CreateAndReturnLabelControlsByLablesDataFromDB(
        x.monitorPageData.labels
      ),
      slidersDivs: this.CreateAndReturnSliderControlsBySlidersDataFromDB(
        x.monitorPageData.sliders
      ),
      videoDivs: this.CreateAndReturnVideoControlsFromVideoDataFromDB(
        x.monitorPageData.videos
      ),
    };
    this.PageData.designerScreen.workFlowName = x.designerScreen.workFlowName;
    this.PageData.controlsCount = {
      totalImageCount:
        x.monitorPageData.otherControlsCount?.totalImageCount || 0,
      totalLabelCount:
        x.monitorPageData.otherControlsCount?.totalLabelCount || 0,
      totalVideoCount:
        x.monitorPageData.otherControlsCount?.totalVideoCount || 0,
      totalSliderCount:
        x.monitorPageData.otherControlsCount?.totalSliderCount || 0,
    };
    this.UpdateExistingData();
  }

  private UpdateExistingData() {
    if (this.PageData) {
      for (const img of this.PageData.allControls.imageDivs) {
        img.src = this.UpdateImageVideoSrcInExistingMonitor(img.src);
      }
      for (const video of this.PageData.allControls.videoDivs) {
        video.src = this.UpdateImageVideoSrcInExistingMonitor(video.src);
      }
      for (const slider of this.PageData.allControls.slidersDivs) {
        slider.src = this.UpdateSliderSrcInExistingMonitor(slider.src);
      }
    }
  }

  CreateAndReturnSliderControlsBySlidersDataFromDB(
    sliders: IMonitorSliderControlData[]
  ): SliderControl[] {
    const sliderControls: SliderControl[] = [];
    sliders.forEach((x) => {
      sliderControls.push(
        new SliderControl(
          this.formBuilder,
          x.name,
          this.SetURL(x.src),
          x.width,
          x.height,
          x.left,
          x.top,
          x.zindex
        )
      );
    });
    return sliderControls;
  }
  SetURL(
    urls: IMonitorSliderControlPreview[]
  ): IMonitorSliderControlPostPreview[] {
    const data: IMonitorSliderControlPostPreview[] = [];
    urls.forEach((x) => {
      data.push({
        type: x.type,
        url: x.url,
        version: 'Old',
        languageCode: x.languageCode,
      });
    });
    return data;
  }
  CreateAndReturnLabelControlsByLablesDataFromDB(
    labels: IMonitorLabelControlData[]
  ): LabelControl[] {
    const labelControls: LabelControl[] = [];
    labels.forEach((x) => {
      labelControls.push(
        new LabelControl(
          this.formBuilder,
          x.name,
          x.text,
          x.color,
          x.width,
          x.height,
          x.top,
          x.left,
          x.font,
          x.fontStyle,
          x.fontSize,
          this.GetDefaultFontWeight(x.fontWeight),
          x.alignment || this.Alignment,
          x.zindex,
          x.backgroundColor||this.BackgroundColor,
          x.isTextToSpeachEnable
        )
      );
    });
    return labelControls;
  }

  CreateAndReturnImageControlsFromImagesDataFromDB(
    images: IMonitorImageControlData[]
  ): ImageControl[] {
    const imageControls: ImageControl[] = [];
    images.forEach((x) => {
      imageControls.push(
        new ImageControl(
          this.formBuilder,
          x.name,
          x.src,
          x.width,
          x.height,
          x.left,
          x.top,
          x.zindex
        )
      );
    });
    return imageControls;
  }

  CreateAndReturnVideoControlsFromVideoDataFromDB(
    images: IMonitorVideoControlData[]
  ): VideoControl[] {
    const videoControl: VideoControl[] = [];
    images.forEach((x) => {
      videoControl.push(
        new VideoControl(
          this.formBuilder,
          x.name,
          x.src,
          x.width,
          x.height,
          x.left,
          x.top,
          x.zindex
        )
      );
    });
    return videoControl;
  }

  GetDefaultFontWeight(fontWeight) {
    return typeof fontWeight === 'number'
      ? this.FontStyles.fontWeight
      : fontWeight;
  }

  private SetMonitorLayoutControlsDataInRespectiveFormsFromDB(
    x: IMonitorLayoutData
  ) {
    this.PageData.designerScreen.form.patchValue({
      width: x.designerScreen.width,
      height: x.designerScreen.height,
      name: x.designerScreen.templateName,
      backgroundImage: x.designerScreen.backGroundImageSrc,
      backgroundColor: x.designerScreen.backgroundColor,
      color: x.designerScreen.color,
      font: x.designerScreen.font,
      fontStyle: x.designerScreen.fontStyle,
      fontSize: x.designerScreen.fontSize,
      workFlowId: x.designerScreen.workFlowId,
      fontWeight: this.GetDefaultFontWeight(x.designerScreen.fontWeight),
      showNextUpPanel: Boolean(x.designerScreen.showNextUpPanel),
      showNowCallingPanel: Boolean(x.designerScreen.showNowCallingPanel),
      showNowHelpingPanel: Boolean(x.designerScreen.showNowHelpingPanel),
      showGrid: x.designerScreen.showGrid,
      cellSize: x.designerScreen.cellSize,
      enableSoundAlert: x.designerScreen.enableSoundAlert,
      enableTextToSpeech:x.designerScreen.enableTextToSpeech,
      textToSpeachTimer:x.designerScreen.textToSpeachTimer,
      queueType:x.designerScreen.queueType,
      selectedQueues:x.designerScreen.selectedQueues,

    });
    this.PageData.nextUpControl.form.patchValue({
      text: x.monitorPageData.nextUp.text,
      backgroundColor: x.monitorPageData.nextUp.backgroundColor,
      color: x.monitorPageData.nextUp.color,
      boxShadow: x.monitorPageData.nextUp.boxShadow,
      boxRoundCorners: x.monitorPageData.nextUp.boxRoundCorners,
      titleFont: x.monitorPageData.nextUp.titleFont,
      titleFontSize: x.monitorPageData.nextUp.titleFontSize,
      titleFontStyle: x.monitorPageData.nextUp.titleFontStyle,
      titleTextColor: x.monitorPageData.nextUp.titleTextColor,
      font: x.monitorPageData.nextUp.font,
      fontStyle: x.monitorPageData.nextUp.fontStyle,
      fontSize: x.monitorPageData.nextUp.fontSize,
      height: x.monitorPageData.nextUp.height,
      width: x.monitorPageData.nextUp.width,
      top: x.monitorPageData.nextUp.top,
      left: x.monitorPageData.nextUp.left,
      backgroundImage: null,
      src: x.monitorPageData.nextUp.backgroundImageURL,
      fontWeight: this.GetDefaultFontWeight(
        x.monitorPageData.nextUp.fontWeight
      ),
      titleFontWeight: this.GetDefaultFontWeight(
        x.monitorPageData.nextUp.titleFontWeight
      ),
      displayNoOfCustomers: x.monitorPageData.nextUp.displayNoOfCustomers || this.NextUp.displayNoOfCustomers,
      columnOne:x.monitorPageData.nextUp.columnOne || this.NextUp.columnOne,
      columnTwo:x.monitorPageData.nextUp.columnTwo || this.NextUp.columnTwo,

    });
    this.PageData.nowCallingControl.form.patchValue({
      text: x.monitorPageData.nowCalling.text,
      backgroundColor: x.monitorPageData.nowCalling.backgroundColor,
      color: x.monitorPageData.nowCalling.color,
      boxShadow: x.monitorPageData.nowCalling.boxShadow,
      boxRoundCorners: x.monitorPageData.nowCalling.boxRoundCorners,
      titleFont: x.monitorPageData.nowCalling.titleFont,
      titleFontSize: x.monitorPageData.nowCalling.titleFontSize,
      titleFontStyle: x.monitorPageData.nowCalling.titleFontStyle,
      titleTextColor: x.monitorPageData.nowCalling.titleTextColor,
      font: x.monitorPageData.nowCalling.font,
      fontStyle: x.monitorPageData.nowCalling.fontStyle,
      fontSize: x.monitorPageData.nowCalling.fontSize,
      height: x.monitorPageData.nowCalling.height,
      width: x.monitorPageData.nowCalling.width,
      top: x.monitorPageData.nowCalling.top,
      left: x.monitorPageData.nowCalling.left,
      backgroundImage: null,
      src: x.monitorPageData.nowCalling.backgroundImageURL,
      fontWeight: this.GetDefaultFontWeight(
        x.monitorPageData.nowCalling.fontWeight
      ),
      titleFontWeight: this.GetDefaultFontWeight(
        x.monitorPageData.nowCalling.titleFontWeight
      ),
      columnOne:x.monitorPageData.nowCalling.columnOne || this.NowCallingColumns.columnOne,
      columnTwo:x.monitorPageData.nowCalling.columnTwo || this.NowCallingColumns.columnTwo,
    });
    this.PageData.nowHelpingControl.form.patchValue({
      text: x.monitorPageData.nowHelping.text,
      backgroundColor: x.monitorPageData.nowHelping.backgroundColor,
      color: x.monitorPageData.nowHelping.color,
      boxShadow: x.monitorPageData.nowHelping.boxShadow,
      boxRoundCorners: x.monitorPageData.nowHelping.boxRoundCorners,
      titleFont: x.monitorPageData.nowHelping.titleFont,
      titleFontSize: x.monitorPageData.nowHelping.titleFontSize,
      titleFontStyle: x.monitorPageData.nowHelping.titleFontStyle,
      titleTextColor: x.monitorPageData.nowHelping.titleTextColor,
      font: x.monitorPageData.nowHelping.font,
      fontStyle: x.monitorPageData.nowHelping.fontStyle,
      fontSize: x.monitorPageData.nowHelping.fontSize,
      height: x.monitorPageData.nowHelping.height,
      width: x.monitorPageData.nowHelping.width,
      top: x.monitorPageData.nowHelping.top,
      left: x.monitorPageData.nowHelping.left,
      backgroundImage: null,
      src: x.monitorPageData.nowHelping.backgroundImageURL,
      fontWeight: this.GetDefaultFontWeight(
        x.monitorPageData.nowHelping.fontWeight
      ),
      titleFontWeight: this.GetDefaultFontWeight(
        x.monitorPageData.nowHelping.titleFontWeight
      ),
      columnOne:x.monitorPageData.nowHelping.columnOne || this.NowHelpingColumns.columnOne,
      columnTwo:x.monitorPageData.nowHelping.columnTwo || this.NowHelpingColumns.columnTwo,
    });
  }

  // Re-Direct To list Page
  RedirectToMonitorListPage() {
    this.routeHandlerService.RedirectToMonitorListPage();
  }

  // Save Layout Data
  SaveClick() {
    const postData = this.GetLayoutDetails();
    this.ValidateLayoutData(this.PageData);
    if (this.IsValidLayoutData) {
      const fileUploadAPIs = this.GetFileUploadUrlApis(postData);
      if (fileUploadAPIs.length > 0) {
        this.formService.CombineAPICall(fileUploadAPIs).subscribe((x) => {
          this.AfterUploadingFilesSuccessFullySendDataToDB(
            this.SaveMonitor,
            postData
          );
        });
      } else {
        this.AfterUploadingFilesSuccessFullySendDataToDB(
          this.SaveMonitor,
          postData
        );
      }
    } else {
      this.IsValidLayoutData = true;
    }
  }

  ValidateLayoutData(data) {
    Object.keys(data).forEach((key) => {
      if (key === 'form' && !data[key].valid) {
        this.AppNotificationService.NotifyError(
          'Name field from ' + data.uniqueName + ' must not be empty.'
        );
        this.IsValidLayoutData = false;
      }
      if (
        this.IsValidLayoutData &&
        key !== 'form' &&
        typeof data[key] === 'object' &&
        data[key]
      ) {
        this.ValidateLayoutData(data[key]);
      }
    });
  }

  private AfterUploadingFilesSuccessFullySendDataToDB(
    saveApiUrl,
    postData: IMonitorLayoutData
  ) {
    if (saveApiUrl === this.SaveMonitor) {
      postData.companyId = this.authService.CompanyId;
      this.monitorAPIService
        .Save(this.authService.CompanyId, postData)
        .subscribe((x: any) => {
          this.browserStorageService.SetMonitorTemplateIdInSessionStorage(
            x.designerScreen.templateId
          );
          this.AppNotificationService.Notify('Monitor saved.');
          this.RedirectToMonitorListPage();
        });
    } else {
      this.monitorAPIService
        .SaveAsDraft(this.authService.CompanyId, postData)
        .subscribe((x: any) => {
          this.browserStorageService.SetMonitorTemplateIdInSessionStorage(
            x.designerScreen.templateId
          );
          this.RedirectToMonitorListPage();
          this.AppNotificationService.Notify('Monitor drafted.');
        });
    }
  }

  private GetFileUploadUrlApis(postData: IMonitorLayoutData) {
    const fileUploadAPIs = [];
    if (this.PageData.designerScreen.backgroundImageFile) {
      fileUploadAPIs.push(
        this.UploadDesignerLayoutBackGroundImageAndSetBackGroundURLInPostData(
          postData
        )
      );
    }
    if (this.PageData.nextUpControl.backgroundImage) {
      fileUploadAPIs.push(
        this.UploadNextUpBackGroundImageAndSetBackGroundURLInPostData(postData)
      );
    }
    if (this.PageData.nowCallingControl.backgroundImage) {
      fileUploadAPIs.push(
        this.UploadNowCallingBackGroundImageAndSetBackGroundURLInPostData(
          postData
        )
      );
    }
    if (this.PageData.nowHelpingControl.backgroundImage) {
      fileUploadAPIs.push(
        this.UploadNowHelpingBackGroundImageAndSetBackGroundURLInPostData(
          postData
        )
      );
    }
    if (this.PageData.allControls.imageDivs.length > 0) {
      this.PageData.allControls.imageDivs.forEach((image) => {
        this.UploadImageFiles(image, fileUploadAPIs, postData);
      });
    }
    if (this.PageData.allControls.videoDivs.length > 0) {
      this.PageData.allControls.videoDivs.forEach((video) => {
        this.UploadVideoFiles(video, fileUploadAPIs, postData);
      });
    }
    if (this.PageData.allControls.slidersDivs.length > 0) {
      this.PageData.allControls.slidersDivs.forEach((slider) => {
        if (slider.src && slider.src.length > 0) {
          this.UploadSliderFiles(slider, fileUploadAPIs, postData);
        } else {
        }
      });
    }
    return fileUploadAPIs;
  }

  private UploadSliderFiles(
    slider: SliderControl,
    fileUploadAPIs: any[],
    postData: IMonitorLayoutData
  ) {
    if (slider.src && slider.src.length > 0) {
      slider.src.forEach((i) => {
        if (i[i.languageCode]) {
          for (const item of i[i.languageCode]) {
            if (!this.ObjectIsEmpty(item.file)) {
              fileUploadAPIs.push(
                this.UploadSlidersAndSetURLInPostData(
                  item.file,
                  item.file.name,
                  slider.name,
                  postData,
                  item.languageCode
                )
              );
            }
          }
        }
      });
    }
  }

  UploadSlidersAndSetURLInPostData(
    file: File,
    fileName: string,
    name: string,
    postData: IMonitorLayoutData,
    languageCode: string
  ) {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        postData.monitorPageData.sliders
          .find((x) => x.name === name)
          .src.find((y) => y.languageCode === languageCode)
          .url.find((n) => n.name === fileName).url = url;
      })
    );
  }

  private UploadImageFiles(
    image: ImageControl,
    fileUploadAPIs: any[],
    postData: IMonitorLayoutData
  ) {
    if (image.src && image.src.length > 0 && typeof image.src !== 'string') {
      image.src.forEach((i) => {
        if (
          i[i.languageCode] &&
          typeof i[i.languageCode] === 'object' &&
          !this.ObjectIsEmpty(i[i.languageCode])
        ) {
          fileUploadAPIs.push(
            this.UploadImagesAndSetBackGroundURLInPostData(
              i[i.languageCode],
              image.name,
              i.languageCode,
              postData
            )
          );
        }
      });
    }
  }

  UploadImagesAndSetBackGroundURLInPostData(
    file: File,
    fileName: string,
    languageCode: string,
    postData: IMonitorLayoutData
  ) {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        postData.monitorPageData.images
          .find((x) => x.name === fileName)
          .src.find((s) => s.languageCode === languageCode).url = url;
      })
    );
  }

  private UploadVideoFiles(
    video: VideoControl,
    fileUploadAPIs: any[],
    postData: IMonitorLayoutData
  ) {
    if (video.src && video.src.length > 0 && typeof video.src !== 'string') {
      video.src.forEach((i) => {
        if (
          i[i.languageCode] &&
          typeof i[i.languageCode] === 'object' &&
          !this.ObjectIsEmpty(i[i.languageCode])
        ) {
          fileUploadAPIs.push(
            this.UploadVideosAndSetBackGroundURLInPostData(
              i[i.languageCode],
              video.name,
              i.languageCode,
              postData
            )
          );
        }
      });
    }
  }

  UploadVideosAndSetBackGroundURLInPostData(
    file: File,
    fileName: string,
    languageCode: string,
    postData: IMonitorLayoutData
  ) {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        postData.monitorPageData.videos
          .find((x) => x.name === fileName)
          .src.find((s) => s.languageCode === languageCode).url = url;
      })
    );
  }

  UploadNextUpBackGroundImageAndSetBackGroundURLInPostData(
    postData: IMonitorLayoutData
  ) {
    return this.formService
      .GetImageUrl(this.PageData.nextUpControl.backgroundImage)
      .pipe(
        tap((url) => {
          postData.monitorPageData.nextUp.backgroundImageURL = url;
        })
      );
  }

  UploadNowCallingBackGroundImageAndSetBackGroundURLInPostData(
    postData: IMonitorLayoutData
  ) {
    return this.formService
      .GetImageUrl(this.PageData.nowCallingControl.backgroundImage)
      .pipe(
        tap((url) => {
          postData.monitorPageData.nowCalling.backgroundImageURL = url;
        })
      );
  }

  UploadNowHelpingBackGroundImageAndSetBackGroundURLInPostData(
    postData: IMonitorLayoutData
  ) {
    return this.formService
      .GetImageUrl(this.PageData.nowHelpingControl.backgroundImage)
      .pipe(
        tap((url) => {
          postData.monitorPageData.nowHelping.backgroundImageURL = url;
        })
      );
  }

  private UploadDesignerLayoutBackGroundImageAndSetBackGroundURLInPostData(
    postData: IMonitorLayoutData
  ) {
    return this.formService
      .GetImageUrl(this.PageData.designerScreen.backgroundImageFile)
      .pipe(
        tap((url) => {
          postData.designerScreen.backGroundImageSrc = url;
        })
      );
  }

  UpdateSelectedControlZIndex(IsIncrease: boolean , AllControls: IConfiguration): number {
    const totalControlsCount =
    AllControls.imageDivs.length +
    AllControls.videoDivs.length +
    AllControls.labelDivs.length +
    AllControls.slidersDivs.length;
    return (IsIncrease) ? 50 + totalControlsCount : 50 - totalControlsCount;
  }

  UpdatePageDataControlZIndex(IsFront: boolean) {
    const controlTypes = ['labelDivs', 'imageDivs', 'videoDivs', 'slidersDivs'];
    for (const controlType of controlTypes) {
        this.PageData.allControls[controlType].forEach((x) => {
          if (IsFront ? x.styles.zindex > 50 : x.styles.zindex < 50) {
          x.styles.zindex = x.form.controls.zindex.value += IsFront ? -1 : 1;
          }
        });
      }
    this.PageDataSubject.next(this.PageData);
  }


  updateNextUpQueueName(data) {
    this.PageData.nextUpControl.form.get("text").setValue(this.PageData.nextUpControl.text)
    this.PageDataSubject.next(data);  
  }

  IncreaseZIndex() {
      const controlTypes = ['labelDivs', 'imageDivs', 'videoDivs', 'slidersDivs'];
      for (const controlType of controlTypes) {
        this.PageData.allControls[controlType].forEach((x) => {
        if (x.selected){
        x.styles.zindex =  x.form.controls.zindex.value = this.UpdateSelectedControlZIndex(true, this.PageData.allControls);
      }
      });
      }
      this.UpdatePageDataControlZIndex(true) ;
  }

  DecreaseZIndex() {
    const controlTypes = ['labelDivs', 'imageDivs', 'videoDivs', 'slidersDivs'];
    for (const controlType of controlTypes) {
      this.PageData.allControls[controlType].forEach( (x) => {
      if (x.selected){
      x.styles.zindex = x.form.controls.zindex.value = this.UpdateSelectedControlZIndex(false, this.PageData.allControls);
      }
    });
    }
    this.UpdatePageDataControlZIndex(false) ;
}

HandleAllControlZIndex(deletedControlZIndex: number){
  const controlTypes = ['labelDivs', 'imageDivs', 'videoDivs', 'slidersDivs'];
  for (const controlType of controlTypes) {
    this.PageData.allControls[controlType].forEach((x) => {
      if (x.styles.zindex > 50 && 50 < deletedControlZIndex && deletedControlZIndex < x.styles.zindex) {
      x.styles.zindex -= 1;
      x.form.controls.zindex.value -= 1;
      }
      if (x.styles.zindex < 50 && 50 > deletedControlZIndex && deletedControlZIndex > x.styles.zindex) {
        x.styles.zindex += 1;
        x.form.controls.zindex.value += 1;
      }
    });
  }
}

  // Save as Draft Layout Data
  SaveAsDraftClick() {
    const postData = this.GetLayoutDetails();
    this.ValidateLayoutData(this.PageData);
    if (this.IsValidLayoutData) {
      const fileUploadAPIs = this.GetFileUploadUrlApis(postData);
      if (fileUploadAPIs.length > 0) {
        this.formService.CombineAPICall(fileUploadAPIs).subscribe((x) => {
          this.AfterUploadingFilesSuccessFullySendDataToDB(
            this.SaveMonitorAsDraft,
            postData
          );
        });
      } else {
        this.AfterUploadingFilesSuccessFullySendDataToDB(
          this.SaveMonitorAsDraft,
          postData
        );
      }
    } else {
      this.IsValidLayoutData = true;
    }
  }

  IsMonitorTemplateIdExistInSession() {
    return this.browserStorageService.MonitorTemplateId;
  }

  // Get Layout Details
  GetLayoutDetails(): IMonitorLayoutData {
    const images = this.GetImagesDetailsFromLayout();
    const labels = this.GetLabelsDetailFromLayout();
    const videos = this.GetVideosDetailsFromLayout();
    const sliders = this.GetSlidersDetailsFromLayout();
    const monitorDesigner = this.GetDesignerDetailFromLayout();
    const monitorNextUp = this.GetMonitorNextUpControlDetailFromLayout();
    const monitorNowCalling =
      this.GetMonitorNowCallingControlDetailFromLayout();
    const monitorNowHelping =
      this.GetMonitorNowHelpingControlDetailFromLayout();
    return {
      designerScreen: monitorDesigner,
      monitorPageData: {
        images,
        labels,
        videos,
        sliders,
        nextUp: monitorNextUp,
        nowCalling: monitorNowCalling,
        nowHelping: monitorNowHelping,
        otherControlsCount: {
          totalImageCount: this.PageData.controlsCount.totalImageCount,
          totalLabelCount: this.PageData.controlsCount.totalLabelCount,
          totalSliderCount: this.PageData.controlsCount.totalSliderCount,
          totalVideoCount: this.PageData.controlsCount.totalVideoCount,
        },
      },
      companyId: null
    };
  }

  GetMonitorNowHelpingControlDetailFromLayout(): IMonitorNowHelpingData {
    return {
      text: this.PageData.nowHelpingControl.text,
      backgroundColor: this.PageData.nowHelpingControl.styles.backgroundColor,
      color: this.PageData.nowHelpingControl.styles.color,
      boxShadow: this.PageData.nowHelpingControl.boxShadow,
      boxRoundCorners: this.PageData.nowHelpingControl.styles.boxRoundCorners,
      titleFont: this.PageData.nowHelpingControl.titleFont,
      titleFontSize: this.PageData.nowHelpingControl.titleFontSize,
      titleFontStyle: this.PageData.nowHelpingControl.titleFontStyle,
      titleTextColor: this.PageData.nowHelpingControl.titleTextColor,
      font: this.PageData.nowHelpingControl.styles.font,
      fontStyle: this.PageData.nowHelpingControl.styles.fontStyle,
      fontSize: this.PageData.nowHelpingControl.styles.fontSize,
      height: this.PageData.nowHelpingControl.styles.height,
      width: this.PageData.nowHelpingControl.styles.width,
      top: this.PageData.nowHelpingControl.styles.top,
      left: this.PageData.nowHelpingControl.styles.left,
      backgroundImageURL: this.PageData.nowHelpingControl.src,
      fontWeight: this.PageData.nowHelpingControl.styles.fontWeight,
      titleFontWeight: this.PageData.nowHelpingControl.titleFontWeight,
      columnOne: this.PageData.nowHelpingControl.form.get("columnOne").value|| this.PageData.nowHelpingControl.columnOne,
      columnTwo: this.PageData.nowHelpingControl.form.get("columnTwo").value||this.PageData.nowHelpingControl.columnTwo,
    };
  }

  GetMonitorNowCallingControlDetailFromLayout(): IMonitorNowCallingData {
    return {
      text: this.PageData.nowCallingControl.text,
      backgroundColor: this.PageData.nowCallingControl.styles.backgroundColor,
      color: this.PageData.nowCallingControl.styles.color,
      boxShadow: this.PageData.nowCallingControl.boxShadow,
      boxRoundCorners: this.PageData.nowCallingControl.styles.boxRoundCorners,
      titleFont: this.PageData.nowCallingControl.titleFont,
      titleFontSize: this.PageData.nowCallingControl.titleFontSize,
      titleFontStyle: this.PageData.nowCallingControl.titleFontStyle,
      titleTextColor: this.PageData.nowCallingControl.titleTextColor,
      font: this.PageData.nowCallingControl.styles.font,
      fontStyle: this.PageData.nowCallingControl.styles.fontStyle,
      fontSize: this.PageData.nowCallingControl.styles.fontSize,
      width: this.PageData.nowCallingControl.styles.width,
      height: this.PageData.nowCallingControl.styles.height,
      top: this.PageData.nowCallingControl.styles.top,
      left: this.PageData.nowCallingControl.styles.left,
      backgroundImageURL: this.PageData.nowCallingControl.src,
      fontWeight: this.PageData.nowCallingControl.styles.fontWeight,
      titleFontWeight: this.PageData.nowCallingControl.titleFontWeight,
      columnOne: this.PageData.nowCallingControl.form.get("columnOne").value|| this.PageData.nowCallingControl.columnOne,
      columnTwo: this.PageData.nowCallingControl.form.get("columnTwo").value||this.PageData.nowCallingControl.columnTwo,
    };
  }

  GetMonitorNextUpControlDetailFromLayout(): IMonitorNextUpData {
    return {
      text: this.PageData.nextUpControl.text,
      backgroundColor: this.PageData.nextUpControl.styles.backgroundColor,
      color: this.PageData.nextUpControl.styles.color,
      boxShadow: this.PageData.nextUpControl.boxShadow,
      boxRoundCorners: this.PageData.nextUpControl.styles.boxRoundCorners,
      titleFont: this.PageData.nextUpControl.titleFont,
      titleFontSize: this.PageData.nextUpControl.titleFontSize,
      titleFontStyle: this.PageData.nextUpControl.titleFontStyle,
      titleTextColor: this.PageData.nextUpControl.titleTextColor,
      font: this.PageData.nextUpControl.styles.font,
      fontStyle: this.PageData.nextUpControl.styles.fontStyle,
      fontSize: this.PageData.nextUpControl.styles.fontSize,
      height: this.PageData.nextUpControl.styles.height,
      width: this.PageData.nextUpControl.styles.width,
      top: this.PageData.nextUpControl.styles.top,
      backgroundImageURL: this.PageData.nextUpControl.src,
      left: this.PageData.nextUpControl.styles.left,
      fontWeight: this.PageData.nextUpControl.styles.fontWeight,
      titleFontWeight: this.PageData.nextUpControl.titleFontWeight,
      displayNoOfCustomers: this.PageData.nextUpControl.displayNoOfCustomers,
      columnOne: this.PageData.nextUpControl.form.get("columnOne").value|| this.PageData.nextUpControl.columnOne,
      columnTwo: this.PageData.nextUpControl.form.get("columnTwo").value||this.PageData.nextUpControl.columnTwo,

    };
  }

  GetDesignerDetailFromLayout(): IMonitorDesignerData {
    return {
      height: this.PageData.designerScreen.styles.height,
      cellSize: this.PageData.designerScreen.cellSize,
      showGrid: this.PageData.designerScreen.showGrid,
      enableSoundAlert: this.PageData.designerScreen.enableSoundAlert,
      enableTextToSpeech:this.PageData.designerScreen.enableTextToSpeech,
      textToSpeachTimer:this.PageData.designerScreen.textToSpeachTimer,
      queueType:this.PageData.designerScreen.queueType,
      selectedQueues:this.PageData.designerScreen.selectedQueues,
      workFlowName: this.PageData.designerScreen.workFlowName,
      workFlowId: this.PageData.designerScreen.workFlowId,
      backGroundImageSrc: this.PageData.designerScreen.backgroundImage,
      color: this.PageData.designerScreen.styles.color,
      backgroundColor: this.PageData.designerScreen.styles.backgroundColor,
      font: this.PageData.designerScreen.styles.font,
      fontSize: this.PageData.designerScreen.styles.fontSize,
      fontStyle: this.PageData.designerScreen.styles.fontStyle,
      templateName: this.PageData.designerScreen.name,
      width: this.PageData.designerScreen.styles.width,
      templateId: this.browserStorageService.MonitorTemplateId
        ? this.browserStorageService.MonitorTemplateId
        : this.uuid,
      fontWeight: this.PageData.designerScreen.styles.fontWeight,
      showNextUpPanel: Boolean(this.PageData.designerScreen.showNextUpPanel),
      showNowCallingPanel: Boolean(
        this.PageData.designerScreen.showNowCallingPanel
      ),
      showNowHelpingPanel: Boolean(
        this.PageData.designerScreen.showNowHelpingPanel
      ),
    };
  }

  GetImagesDetailsFromLayout() {
    const images: IMonitorImageControlData[] = [];
    this.PageData.allControls.imageDivs.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return images;
  }

  GetVideosDetailsFromLayout() {
    const videos: IMonitorVideoControlData[] = [];
    this.PageData.allControls.videoDivs.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return videos;
  }
  GetSlidersDetailsFromLayout() {
    const sliders: IMonitorSliderControlData[] = [];
    this.PageData.allControls.slidersDivs.forEach((x) => {
      sliders.push({
        height: x.styles.height,
        left: x.styles.left,
        name: x.name,
        src: this.GetUrls(x.src),
        top: x.styles.top,
        utls: x.urls,
        width: x.styles.width,
        zindex: x.styles.zindex,
      });
    });
    return sliders;
  }

  GetUrls(src) {
    const urls = [];
    src.forEach((element) => {
      urls.push({
        language: this.LanguagesSubject.value.find(x => x.languageCode === element.languageCode).language,
        languageCode: element.languageCode,
        [element.languageCode]: element[element.languageCode],
        url: element.url.length > 0 ? element.url : [],
      });
    });
    return urls;
  }

  GetLabelsDetailFromLayout() {
    const labels: IMonitorLabelControlData[] = [];
    this.PageData.allControls.labelDivs.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        top: x.styles.top,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        alignment: x.alignment,
        zindex: x.styles.zindex,
        backgroundColor:x.styles.backgroundColor,
        isTextToSpeachEnable: x.isTextToSpeachEnable
      });
    });
    
    return labels;
  }

  // Default Control Creation
  CreateAndReturnDefaultDesignPanel(): DesignerPanelControl {
    return new DesignerPanelControl(
      this.formBuilder,
      this.DesignerPanelFontStyles.width,
      this.DesignerPanelFontStyles.height,
      this.WorkFlowData ? this.WorkFlowData.workFlowId : '',
      this.WorkFlowData ? this.WorkFlowData.name : '',
      this.IsMonitorTemplateIdExistInSession()
        ? ''
        : this.GetDefaultTemplateName(),
      '',
      this.DesignerPanelFontStyles.backgroundColor,
      this.FontStyles.color,
      this.FontStyles.fontSize,
      this.FontStyles.font,
      this.DesignerPanelFontStyles.fontStyle,
      this.FontStyles.fontWeight,
      true,
      true,
      true,
      this.DesignerPanel.cellSize,
      this.DesignerPanel.showGrid,
      this.DesignerPanel.enableSoundAlert,
      this.DesignerPanel.enableTextToSpeech,
      this.DesignerPanel.textToSpeachTimer,
      this.DesignerPanel.queueType,
      this.DesignerPanel.selectedQueues
    );
  }

  GetDefaultAllControlsData(): IConfiguration {
    return {
      imageDivs: [],
      labelDivs: [],
      slidersDivs: [],
      videoDivs: [],
    };
  }

  private GetDefaultTemplateName(): string {
    const ExistingTemplateNameList: number[] = [];

    if (
      this.monitorService.Monitors$ != null &&
      this.monitorService.Monitors$ != undefined
    ) {
      this.monitorService.Monitors$.subscribe((response) => {
        response
          .map((x) => x.designerScreen.templateName)
          .forEach((x) => {
            const regexp = new RegExp('^template-\\d+$');
            if (regexp.test(x.toLowerCase())) {
              const digit = x.match(/\d+/);
              if (digit != null) {
                ExistingTemplateNameList.push(parseInt(digit[0]));
              }
            }
          });

        if (
          ExistingTemplateNameList != null &&
          ExistingTemplateNameList != undefined &&
          ExistingTemplateNameList.length > 0
        ) {
          ExistingTemplateNameList.sort(function(x, y) {
            return x - y;
          });
        }
      });
    }

    if (
      ExistingTemplateNameList == null ||
      ExistingTemplateNameList == undefined ||
      ExistingTemplateNameList.length <= 0
    ) {
      if (
        (this.monitorService.Monitors$ == null ||
          this.monitorService.Monitors$ == undefined) &&
        this.browserStorageService.MonitorTemplateName
      ) {
        return this.browserStorageService.MonitorTemplateName;
      }

      this.browserStorageService.SetMonitorTemplateName('Template-1');
      return 'Template-1';
    }

    const count = ExistingTemplateNameList.slice(-1)[0] + 1;
    const missing = new Array();

    for (let i = 1; i <= count; i++) {
      if (ExistingTemplateNameList.indexOf(i) == -1) {
        missing.push(i);
      }
    }

    this.browserStorageService.SetMonitorTemplateName('Template-' + missing[0]);
    return 'Template-' + missing[0];
  }

  private CreateAndReturnNowHelpingControl(): NowHelpingControl {
    return new NowHelpingControl(
      this.formBuilder,
      this.NowHelpingFontStyles.text,
      this.FontStyles.backgroundColor,
      this.FontStyles.color,
      this.FontStyles.boxShadow,
      this.FontStyles.boxRoundCorners,
      this.FontStyles.titleFont,
      this.FontStyles.titleFontSize,
      this.FontStyles.titleFontStyle,
      this.FontStyles.titleTextColor,
      this.FontStyles.font,
      this.FontStyles.fontStyle,
      this.FontStyles.fontSize,
      this.FontStyles.height,
      this.FontStyles.width,
      this.NowHelpingFontStyles.top,
      this.NowHelpingFontStyles.left,
      this.FontStyles.src,
      this.FontStyles.titleFontWeight,
      this.FontStyles.fontWeight,
      this.NowHelpingColumns.columnOne,
      this.NowHelpingColumns.columnTwo,
      
    );
  }
  private GetOtherControlsInitialCounts(): MonitorOtherControlsCountDetail {
    return {
      totalImageCount: 0,
      totalLabelCount: 0,
      totalSliderCount: 0,
      totalVideoCount: 0,
    };
  }

  private CreateAndReturnDefaultNowCallingControl(): NowCallingControl {
    return new NowCallingControl(
      this.formBuilder,
      this.NowCallingFontStyles.text,
      this.FontStyles.backgroundColor,
      this.FontStyles.color,
      this.FontStyles.boxShadow,
      this.FontStyles.boxRoundCorners,
      this.FontStyles.titleFont,
      this.FontStyles.titleFontSize,
      this.FontStyles.titleFontStyle,
      this.FontStyles.titleTextColor,
      this.FontStyles.font,
      this.FontStyles.fontStyle,
      this.NowCallingFontStyles.fontSize,
      this.FontStyles.height,
      this.FontStyles.width,
      this.NowCallingFontStyles.top,
      this.NowCallingFontStyles.left,
      this.FontStyles.src,
      this.FontStyles.titleFontWeight,
      this.FontStyles.fontWeight,
      this.NowCallingColumns.columnOne,
      this.NowCallingColumns.columnTwo,

    );
  }

  private CreateAndReturnDefaultNextUpControl(): NextUpControl {
    return new NextUpControl(
      this.formBuilder,
      this.NextUpFontStyles.text,
      this.FontStyles.backgroundColor,
      this.FontStyles.color,
      this.FontStyles.boxShadow,
      this.FontStyles.boxRoundCorners,
      this.FontStyles.titleFont,
      this.FontStyles.titleFontSize,
      this.FontStyles.titleFontStyle,
      this.FontStyles.titleTextColor,
      this.FontStyles.font,
      this.FontStyles.fontStyle,
      this.FontStyles.fontSize,
      this.FontStyles.height,
      this.FontStyles.width,
      this.NextUpFontStyles.top,
      this.NextUpFontStyles.left,
      this.FontStyles.src,
      this.FontStyles.fontWeight,
      this.FontStyles.titleFontWeight,
      this.NextUp.displayNoOfCustomers,
      this.NextUp.columnOne,
      this.NextUp.columnTwo
    );
  }
  OnNextUpControlClick() {
    this.ResetControlSelection();
    this.ControlSelectionSubject.value.IsNextUpControlSelected = true;
    this.ControlSelectionSubject.next(cloneObject(this.ControlSelectionSubject.value));
  }

  OnNowCallingControlClick() {
    this.ResetControlSelection();
    this.ControlSelectionSubject.value.IsNowCallingControlSelected = true;
    this.ControlSelectionSubject.next(cloneObject(this.ControlSelectionSubject.value));
  }
  OnNowHelpingControlClick() {
    this.ResetControlSelection();
    this.ControlSelectionSubject.value.IsNowHelpingControlSelected = true;
    this.ControlSelectionSubject.next(cloneObject(this.ControlSelectionSubject.value));
  }
  OnOtherControlsClick() {
    this.ResetControlSelection();
    this.ControlSelectionSubject.value.IsOtherControlsSelected = true;
    this.ControlSelectionSubject.next(cloneObject(this.ControlSelectionSubject.value));
  }
  private ResetControlSelection() {
    for (const [propertyKey, propertyValue] of Object.entries(
      this.ControlSelectionSubject.value
    )) {
      this.ControlSelectionSubject.value[propertyKey] = false;
    }
  }
  ChangeLayoutLanguage(value: string) {
    this.SelectedLanguageSubject.next(value);
    this.selectedLanaguage = value
  }

  // Return CurrentPage Data
  GetPageData(): any {
    return this.PageData;
  }

  ConvertTranslatedLanguageArrayToObject(arr) {
    const obj = {};
    for (const element of arr) {
      obj[element.languageId] = element.translatedText;
    }
    return obj;
  }

  ObjectIsEmpty(object) {
    for (const key in object) {
      if (key) {
        return false;
      }
    }
    return true;
  }
}
