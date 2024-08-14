import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractComponentService } from '../../../../../base/abstract-component-service';
import { cloneObject, GetDraftSuccessfulMessage, GetSaveSuccessfulMessage, getTimeStampSplitedFileName } from '../../../../../core/utilities/core-utilities';
import { ILanguageDropdownList } from '../../../../../models/common/language-dropdownlist.interface';
import { Language } from '../../../../../models/enums/language-enum';
import { CompanyAPIService } from '../../../../../shared/api-services/company-api.service';
import { HomeInterfaceAPIService } from '../../../../../shared/api-services/home-interface-api.service';
import { HomeInterfaceService } from '../../home-interface.service';
import { AddEditHomeInterfaceService } from '../add-edit-home-interface.service';
import { IConfiguration } from './models/configuration.interface';
import { IControlSelection } from './models/controls-selection.interface';
import { DesignerPanelControl } from './models/controls/designer-panel.control';
import { ImageControl } from './models/controls/image.control';
import { LabelControl } from './models/controls/label.control';
import { SliderControl } from './models/controls/slider.control';
import { VideoControl } from './models/controls/video.control';
import {
  IHomeInterfaceDesignerData,
  IHomeInterfaceImageControlData,
  IHomeInterfaceLabelControlData,
  IHomeInterfaceLayoutData,
  IHomeInterfaceSliderControlData,
  IHomeInterfaceVideoControlData
} from './models/home-interface-layout-data';
import { IHomeInterfaceOtherControlsCountDetail } from './models/home-interface-other-controls-count-details.interface';
import { IHomeInterfaceSliderControlPostPreview, IHomeInterfaceSliderControlPreview } from './models/home-interface-slider-control-preview.interface';
import { IPageData } from './models/page-data.interface';

@Injectable()
export class HomeInterfaceLayoutService extends AbstractComponentService {
  private PageDataSubject: BehaviorSubject<IPageData>;
  PageData$: Observable<IPageData>;
  private SelectedLanguageSubject: BehaviorSubject<string>;
  SelectedLanguage$: Observable<string>;
  private LanguagesSubject: BehaviorSubject<ILanguageDropdownList[]>;
  Languages$: Observable<ILanguageDropdownList[]>;
  private ControlSelectionSubject: BehaviorSubject<IControlSelection>;
  ControlSelection$: Observable<IControlSelection>;

  PageData: IPageData;
  IsEditMode: boolean;
  IsEditMode$: Observable<boolean>;

  IsValidLayoutData = true;
  SaveHomeInterface = 'save';
  SaveHomeInterfaceAsDraft = 'saveAsDraft';
  Alignment = 'center';

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
  DesignerPanelFontStyles = {
    width: 848,
    height: 521,
    backgroundColor: '#aa9c9c',
    fontStyle: 'Italic',
  };
  DesignerPanel = {
    cellSize: 50,
    showGrid: false,
  };
  //#endregion

  get CompanyId() {
    return this.authService.CompanyId;
  }

  constructor(private addEditHomeService: AddEditHomeInterfaceService,
              private homeInterfaceService: HomeInterfaceService,
              private readonly companyAPIService: CompanyAPIService,
              private readonly homeInterfaceAPIService: HomeInterfaceAPIService
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
    this.subs.sink = this.addEditHomeService.PageData$.subscribe((pageData) => {
      this.InitializeHomeInterfacePageData(pageData);
    });
    this.subs.sink = this.addEditHomeService.IsEditMode$.subscribe(
      (isEditMode) => {
        this.IsEditMode = isEditMode;
      }
    );
  }


  private InitializeHomeInterfacePageData(pageData: IHomeInterfaceLayoutData) {
    if (pageData) {
      this.SetOtherControlsandDataInLayputPageFromLayoutDataOfDB(pageData);
      this.SetHomeInterfaceLayoutControlsDataInRespectiveFormsFromDB(pageData);
      this.PageDataSubject.next(this.PageData);
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
    this.IsEditMode$ = this.addEditHomeService.IsEditMode$;
    this.ControlSelectionSubject = new BehaviorSubject<IControlSelection>({
      IsOtherControlsSelected: false,
    });
    this.ControlSelection$ = this.ControlSelectionSubject.asObservable();
  }

  private CallLanguageListAPI() {
    this.companyAPIService
      .GetLanguages(this.authService.CompanyId)
      .subscribe((x: ILanguageDropdownList[]) => {
        this.LanguagesSubject.next(x);
      });
  }

  GetFileName(url: string) {
    const extractedFileName = url.split('/');
    return getTimeStampSplitedFileName(
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
    x: IHomeInterfaceLayoutData
  ) {
    this.PageData.allControls = {
      imageDivs: this.CreateAndReturnImageControlsFromImagesDataFromDB(
        x.homeInterfacePageData.images
      ),
      labelDivs: this.CreateAndReturnLabelControlsByLablesDataFromDB(
        x.homeInterfacePageData.labels
      ),
      sliderDivs: this.CreateAndReturnSliderControlsBySlidersDataFromDB(
        x.homeInterfacePageData.sliders
      ),
      videoDivs: this.CreateAndReturnVideoControlsFromVideoDataFromDB(
        x.homeInterfacePageData.videos
      ),
    };
    this.PageData.controlsCount = {
      totalImageCount:
        x.homeInterfacePageData.otherControlsCount?.totalImageCount || 0,
      totalLabelCount:
        x.homeInterfacePageData.otherControlsCount?.totalLabelCount || 0,
      totalVideoCount:
        x.homeInterfacePageData.otherControlsCount?.totalVideoCount || 0,
      totalSliderCount:
        x.homeInterfacePageData.otherControlsCount?.totalSliderCount || 0,
    };
  }

  CreateAndReturnSliderControlsBySlidersDataFromDB(
    sliders: IHomeInterfaceSliderControlData[]
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
    urls: IHomeInterfaceSliderControlPreview[]
  ): IHomeInterfaceSliderControlPostPreview[] {
    const data: IHomeInterfaceSliderControlPostPreview[] = [];
    urls.forEach((x) => {
      data.push({
        type: x.type,
        url: x.url,
        version: 'Old',
        languageCode: x.languageCode,
        language: x.language
      });
    });
    return data;
  }
  CreateAndReturnLabelControlsByLablesDataFromDB(
    labels: IHomeInterfaceLabelControlData[]
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
          x.zindex
        )
      );
    });
    return labelControls;
  }

  CreateAndReturnImageControlsFromImagesDataFromDB(
    images: IHomeInterfaceImageControlData[]
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
    images: IHomeInterfaceVideoControlData[]
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

  private SetHomeInterfaceLayoutControlsDataInRespectiveFormsFromDB(
    x: IHomeInterfaceLayoutData
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
      fontWeight: this.GetDefaultFontWeight(x.designerScreen.fontWeight),
      showGrid: x.designerScreen.showGrid,
      cellSize: x.designerScreen.cellSize,
    });
  }

  // Re-Direct To list Page
  RedirectToHomeInterfaceListPage() {
    this.routeHandlerService.RedirectToHomeInterfaceListPage();
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
            this.SaveHomeInterface,
            postData
          );
        });
      } else {
        this.AfterUploadingFilesSuccessFullySendDataToDB(
          this.SaveHomeInterface,
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
    postData: IHomeInterfaceLayoutData
  ) {
    if (saveApiUrl === this.SaveHomeInterface) {
      this.homeInterfaceAPIService
        .Save(this.authService.CompanyId, postData)
        .subscribe((x: any) => {
          this.browserStorageService.SetHomeInterfaceIdInSessionStorage(
            x.designerScreen.templateId
          );
          this.AppNotificationService.Notify(GetSaveSuccessfulMessage('Home Interface'));
          this.RedirectToHomeInterfaceListPage();
        });
    } else {
      this.homeInterfaceAPIService
        .SaveAsDraft(this.authService.CompanyId, postData)
        .subscribe((x: any) => {
          this.browserStorageService.SetHomeInterfaceIdInSessionStorage(
            x.designerScreen.templateId
          );
          this.RedirectToHomeInterfaceListPage();
          this.AppNotificationService.Notify(GetDraftSuccessfulMessage('Home Interface'));
        });
    }
  }

  private GetFileUploadUrlApis(postData: IHomeInterfaceLayoutData) {
    const fileUploadAPIs = [];
    if (this.PageData.designerScreen.backgroundImageFile) {
      fileUploadAPIs.push(
        this.UploadDesignerLayoutBackGroundImageAndSetBackGroundURLInPostData(
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
    if (this.PageData.allControls.sliderDivs.length > 0) {
      this.PageData.allControls.sliderDivs.forEach((slider) => {
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
    postData: IHomeInterfaceLayoutData
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
    postData: IHomeInterfaceLayoutData,
    languageCode: string
  ) {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        postData.homeInterfacePageData.sliders
          .find((x) => x.name === name)
          .src.find((y) => y.languageCode === languageCode)
          .url.find((n) => n.name === fileName).url = url;
      })
    );
  }

  private UploadImageFiles(
    image: ImageControl,
    fileUploadAPIs: any[],
    postData: IHomeInterfaceLayoutData
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
    postData: IHomeInterfaceLayoutData
  ) {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        postData.homeInterfacePageData.images
          .find((x) => x.name === fileName)
          .src.find((s) => s.languageCode === languageCode).url = url;
      })
    );
  }

  private UploadVideoFiles(
    video: VideoControl,
    fileUploadAPIs: any[],
    postData: IHomeInterfaceLayoutData
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
    postData: IHomeInterfaceLayoutData
  ) {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        postData.homeInterfacePageData.videos
          .find((x) => x.name === fileName)
          .src.find((s) => s.languageCode === languageCode).url = url;
      })
    );
  }

  private UploadDesignerLayoutBackGroundImageAndSetBackGroundURLInPostData(
    postData: IHomeInterfaceLayoutData
  ) {
    return this.formService
      .GetImageUrl(this.PageData.designerScreen.backgroundImageFile)
      .pipe(
        tap((url) => {
          postData.designerScreen.backGroundImageSrc = url;
        })
      );
  }

  UpdateSelectedControlZIndex(IsIncrease:boolean , AllControls: IConfiguration): number {
    const totalControlsCount =
    AllControls.imageDivs.length +
    AllControls.videoDivs.length +
    AllControls.labelDivs.length +
    AllControls.sliderDivs.length;
    return (IsIncrease)?50 + totalControlsCount:50 - totalControlsCount;
  }

  UpdatePageDataControlZIndex(IsFront: boolean) {
    let controlTypes = ['labelDivs','imageDivs','videoDivs','sliderDivs'];
      for (const controlType of controlTypes) {
        this.PageData.allControls[controlType].forEach((x) => {
          if (IsFront?x.styles.zindex > 50:x.styles.zindex < 50) {
          x.styles.zindex = x.form.controls.zindex.value += IsFront?-1:1;
          }
        });
      } 
    this.PageDataSubject.next(this.PageData);
  }
 
 
  IncreaseZIndex() {  
      let controlTypes = ['labelDivs','imageDivs','videoDivs','sliderDivs'];
      for (const controlType of controlTypes) { 
        this.PageData.allControls[controlType].forEach((x) =>{
        if(x.selected){
        x.styles.zindex =  x.form.controls.zindex.value = this.UpdateSelectedControlZIndex(true, this.PageData.allControls);    
      }
      });
      } 
      this.UpdatePageDataControlZIndex(true) ; 
  }

  DecreaseZIndex() { 
    let controlTypes = ['labelDivs','imageDivs','videoDivs','sliderDivs'];
    for (const controlType of controlTypes) {
      this.PageData.allControls[controlType].forEach( (x) =>{
      if(x.selected){
      x.styles.zindex = x.form.controls.zindex.value = this.UpdateSelectedControlZIndex(false, this.PageData.allControls); 
      }
    });
    }
    this.UpdatePageDataControlZIndex(false) ; 
}


HandleAllControlZIndex(deletedControlZIndex: number){ 
  let controlTypes = ['labelDivs','imageDivs','videoDivs','sliderDivs'];
  for (const controlType of controlTypes) {
    this.PageData.allControls[controlType].forEach((x) => {
      if (x.styles.zindex > 50 && 50 < deletedControlZIndex && deletedControlZIndex < x.styles.zindex) {
        x.styles.zindex -= 1;
      x.form.controls.zindex.value -= 1;
      }
      if(x.styles.zindex < 50 && 50 > deletedControlZIndex && deletedControlZIndex > x.styles.zindex){
        x.styles.zindex += 1;
        x.form.controls.zindex.value += 1;
      }
    });
  }
  this.PageDataSubject.next(this.PageData);
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
            this.SaveHomeInterfaceAsDraft,
            postData
          );
        });
      } else {
        this.AfterUploadingFilesSuccessFullySendDataToDB(
          this.SaveHomeInterfaceAsDraft,
          postData
        );
      }
    } else {
      this.IsValidLayoutData = true;
    }
  }

  IsHomeInterfaceIdExistInSession() {
    return this.browserStorageService.HomeInterfaceId;
  }

  // Get Layout Details
  GetLayoutDetails(): IHomeInterfaceLayoutData {
    const images = this.GetImagesDetailsFromLayout();
    const labels = this.GetLabelsDetailFromLayout();
    const videos = this.GetVideosDetailsFromLayout();
    const sliders = this.GetSlidersDetailsFromLayout();
    const designer = this.GetDesignerDetailFromLayout();
    return {
      designerScreen: designer,
      homeInterfacePageData: {
        images,
        labels,
        videos,
        sliders,
        otherControlsCount: {
          totalImageCount: this.PageData.controlsCount.totalImageCount,
          totalLabelCount: this.PageData.controlsCount.totalLabelCount,
          totalSliderCount: this.PageData.controlsCount.totalSliderCount,
          totalVideoCount: this.PageData.controlsCount.totalVideoCount,
        },
      },
      companyId: this.CompanyId
    };
  }

  GetDesignerDetailFromLayout(): IHomeInterfaceDesignerData {
    return {
      height: this.PageData.designerScreen.styles.height,
      cellSize: this.PageData.designerScreen.cellSize,
      showGrid: this.PageData.designerScreen.showGrid,
      backGroundImageSrc: this.PageData.designerScreen.backgroundImage,
      color: this.PageData.designerScreen.styles.color,
      backgroundColor: this.PageData.designerScreen.styles.backgroundColor,
      font: this.PageData.designerScreen.styles.font,
      fontSize: this.PageData.designerScreen.styles.fontSize,
      fontStyle: this.PageData.designerScreen.styles.fontStyle,
      templateName: this.PageData.designerScreen.name,
      width: this.PageData.designerScreen.styles.width,
      templateId: this.browserStorageService.HomeInterfaceId
        ? this.browserStorageService.HomeInterfaceId
        : this.uuid,
      fontWeight: this.PageData.designerScreen.styles.fontWeight,
    };
  }

  GetImagesDetailsFromLayout() {
    const images: IHomeInterfaceImageControlData[] = [];
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
    const videos: IHomeInterfaceVideoControlData[] = [];
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
    const sliders: IHomeInterfaceSliderControlData[] = [];
    this.PageData.allControls.sliderDivs.forEach((x) => {
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
        language: element.language,
        languageCode: element.languageCode,
        [element.languageCode]: element[element.languageCode],
        url: element.url.length > 0 ? element.url : [],
      });
    });
    return urls;
  }

  GetLabelsDetailFromLayout() {
    const labels: IHomeInterfaceLabelControlData[] = [];
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
      this.IsHomeInterfaceIdExistInSession()
        ? ''
        : this.GetDefaultTemplateName(),
      '',
      this.DesignerPanelFontStyles.backgroundColor,
      this.FontStyles.color,
      this.FontStyles.fontSize,
      this.FontStyles.font,
      this.DesignerPanelFontStyles.fontStyle,
      this.FontStyles.fontWeight,
      this.DesignerPanel.cellSize,
      this.DesignerPanel.showGrid
    );
  }

  GetDefaultAllControlsData(): IConfiguration {
    return {
      imageDivs: [],
      labelDivs: [],
      sliderDivs: [],
      videoDivs: [],
    };
  }

  private GetDefaultTemplateName(): string {
    const ExistingTemplateNameList: number[] = [];

    if (
      this.homeInterfaceService.HomeInterfaces$ != null &&
      this.homeInterfaceService.HomeInterfaces$ !== undefined
    ) {
      this.homeInterfaceService.HomeInterfaces$.subscribe((response) => {
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
          ExistingTemplateNameList !== undefined &&
          ExistingTemplateNameList.length > 0
        ) {
          ExistingTemplateNameList.sort((x, y) => {
            return x - y;
          });
        }
      });
    }

    if (
      ExistingTemplateNameList == null ||
      ExistingTemplateNameList === undefined ||
      ExistingTemplateNameList.length <= 0
    ) {
      if (
        (this.homeInterfaceService.HomeInterfaces$ === null ||
          this.homeInterfaceService.HomeInterfaces$ === undefined) &&
        this.browserStorageService.HomeInterfaceName
      ) {
        return this.browserStorageService.HomeInterfaceName;
      }

      this.browserStorageService.SetHomeInterfaceName('Template-1');
      return 'Template-1';
    }

    const count = ExistingTemplateNameList.slice(-1)[0] + 1;
    const missing = new Array();

    for (let i = 1; i <= count; i++) {
      if (ExistingTemplateNameList.indexOf(i) === -1) {
        missing.push(i);
      }
    }

    this.browserStorageService.SetHomeInterfaceName('Template-' + missing[0]);
    return 'Template-' + missing[0];
  }

  private GetOtherControlsInitialCounts(): IHomeInterfaceOtherControlsCountDetail {
    return {
      totalImageCount: 0,
      totalLabelCount: 0,
      totalSliderCount: 0,
      totalVideoCount: 0,
    };
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
