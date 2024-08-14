import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IDynamicVariable } from '../../../../../../models/common/dynamic-variable.interface';
import { ILanguageControl } from '../../../../../../models/common/language-control.interface';
import { ILanguageDropdownList } from '../../../../../../models/common/language-dropdownlist.interface';
import { SupportedImageFileSize, SupportedImageFileTypes } from '../../../../../../models/constants/valid-file-types-and-sizes.constant';
import { requiredFileType } from '../../../../../../shared/validators/common.validator';
import { IConfiguration } from '../Models/configuration.interface';
import { IControlSelection } from '../Models/controls-selection.interface';
import { Control } from '../Models/controls/control';
import { DesignerPanelControl } from '../Models/controls/designer-panel.control';
import { ImageControl } from '../Models/controls/image.control';
import { LabelControl } from '../Models/controls/label.control';
import { SliderControl } from '../Models/controls/slider.control';
import { VideoControl } from '../Models/controls/video.control';
import { DDLControl } from '../Models/drop-down-control.interface';
import { IMoveEvent } from '../Models/move-event.interface';
import { IPageData } from '../Models/page-data.interface';
import { MonitorLayoutService } from '../monitor-layout.service';

@Injectable()
export class MonitorTemplateService extends AbstractComponentService {
  PageData: IPageData;

  CurrentPageData$: Observable<IConfiguration>;
  private CurrentPageDataSubject: BehaviorSubject<IConfiguration>;
  DesignerPanel$: Observable<DesignerPanelControl>;
  private DesignerPanelSubject: BehaviorSubject<DesignerPanelControl>;
  ManageControls$: Observable<DDLControl[]>;
  private ManageControlsSubject: BehaviorSubject<DDLControl[]>;
  private ImageFormArraySubject: BehaviorSubject<FormArray>;
  ImageFormArray$: Observable<FormArray>;
  IsEditMode$: Observable<boolean>;
  Languages$: Observable<ILanguageDropdownList[]>;
  SelectedLanguage$: Observable<string>;
  DynamicVariables$: Observable<IDynamicVariable[]>;
  IsOnlyGrid$: Observable<boolean>;
  GridSize$: Observable<number>;
  ControlSelection$: Observable<IControlSelection>;
  QueueData$:Observable<any>;
  QueueDataSubject:BehaviorSubject<any>;

  Languages = [];
  enableTextToSpeach: boolean = false;
  textToSpeachTimer: number = 10;

  Alignment = 'center';
  BackgroundColor = 'rgba(0, 0, 0, 0)';
  isTextToSpeachEnable: boolean;

  constructor(private monitorLayoutService: MonitorLayoutService) {
    super();
    this.InitializeSubjects();
    this.SubscribeObservables();
  }

  private SubscribeObservables() {
    this.subs.sink = this.monitorLayoutService.PageData$.subscribe((x) => {
      this.PageData = x;

      if (x) {
        x.allControls.labelDivs.forEach((m) => {
          this.AddLabelsToThePage(m);
        });
        x.allControls.imageDivs.forEach((m) => {
          this.AddImagesToPage(m);
        });
        x.allControls.videoDivs.forEach((m) => {
          this.AddVideoToPage(m);
        });
        x.allControls.slidersDivs.forEach((m) => {
          this.AddSliderToPage(m);
        });
        this.DesignerPanelSubject.next(x.designerScreen);
        this.CurrentPageDataSubject.next(x.allControls);
        this.ManageControlsSubject.next(x.manageControls);
      }
    });
    this.IsOnlyGrid$ = this.DesignerPanel$.pipe(map(
      designerScreen => designerScreen.showGrid
    ));
    this.GridSize$ = this.DesignerPanel$.pipe(map(
      designerScreen => designerScreen.cellSize
    ));
  }
get CompanyId() {
  return this.monitorLayoutService.CompanyId
}

  get Workflow(){
    return this.monitorLayoutService.WorkFlowData
  }
  private InitializeSubjects() {
    this.CurrentPageDataSubject = new BehaviorSubject<IConfiguration>(null);
    this.CurrentPageData$ = this.CurrentPageDataSubject.asObservable();
    this.DesignerPanelSubject = new BehaviorSubject<DesignerPanelControl>(null);
    this.DesignerPanel$ = this.DesignerPanelSubject.asObservable();
    this.ManageControlsSubject = new BehaviorSubject<DDLControl[]>(null);
    this.ManageControls$ = this.ManageControlsSubject.asObservable();
    this.IsEditMode$ = this.monitorLayoutService.IsEditMode$;
    this.SelectedLanguage$ = this.monitorLayoutService.SelectedLanguage$;
    this.ImageFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.ImageFormArray$ = this.ImageFormArraySubject.asObservable();
    this.DynamicVariables$ = this.monitorLayoutService.DynamicVariables$;
    this.ControlSelection$=this.monitorLayoutService.ControlSelection$;
    this.QueueData$ = this.monitorLayoutService.QueueData$;
    this.Languages$ = this.monitorLayoutService.Languages$.pipe(
      tap((lang) => {
        this.Languages = lang;
      })
    );
  }

  ChangeDesignerPanel(DesignerPanel: DesignerPanelControl) {
    this.PageData.designerScreen = DesignerPanel;
    this.DesignerPanelSubject.next(DesignerPanel);
  }

  ChangeServiceControlData(control: Control) {
    this.PageData.manageControls = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.PageData.manageControls,
        control.name
      )
    );
    this.PageData.allControls.slidersDivs = [].concat(this.PageData.allControls.slidersDivs);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  AddNewLabelControl(event: IMoveEvent, args?:any) {
   let name = ""
    if(args) {
      if(args.type == "textToSpeach" && args?.value == true) {
        this.enableTextToSpeach = true;
         name = 'Default monitor announcement text' ;
      }
    } else {
     name = 'Label' + this.PageData.controlsCount.totalLabelCount;
    }
    
    this.isTextToSpeachEnable = this.enableTextToSpeach

     
    this.monitorLayoutService.OnOtherControlsClick()
    this.PageData.controlsCount.totalLabelCount++;
    const defaultText = { en: name };
    const defaultColor = '#000000';
    const defaultHeight = 50;
    const defaultWidth = 60;
    const defaultZIndex = 50;
    const labelControl = this.CreateLabelControl(
      name,
      defaultText,
      defaultColor,
      defaultWidth,
      defaultHeight,
      Math.round(event.y),
      event.x,
      'Arial',
      'Italic',
      13,
      'normal',
      this.Alignment,
      defaultZIndex,
      this.BackgroundColor,
      this.isTextToSpeachEnable 
    );

    this.AddLabelsToThePage(labelControl);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  private AddLabelsToThePage(labelControl: LabelControl) {
    if (
      !this.PageData.allControls.labelDivs.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.PageData.allControls.labelDivs = this.PageData.allControls.labelDivs.concat(
        labelControl
      );
    }
    if (
      !this.PageData.manageControls.some(
        (x) => x.control.name === labelControl.name
      )
    ) {
      this.PageData.manageControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.PageData.manageControls,
          labelControl,
          labelControl.name,
          true,
          false,
          false
        )
      );
    }
    this.UpdateSelectedPropertyOfLabelControl(labelControl);
  }

  AddNewImageControl(event) {
    this.monitorLayoutService.OnOtherControlsClick()
    this.PageData.controlsCount.totalImageCount++;
    const name = 'Image' + this.PageData.controlsCount.totalImageCount;
    const src = [{language: 'English', languageCode: 'en', src: '/assets/img-icon.svg', url: '/assets/img-icon.svg'}];
    const defaultHeight = 60;
    const defaultWidth = 60;
    const defaultZIndex = 50;
    const imageControl = this.CreateImageControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZIndex
    );
    this.AddImagesToPage(imageControl);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  private AddImagesToPage(imageControl: ImageControl) {
    if (
      !this.PageData.allControls.imageDivs.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.PageData.allControls.imageDivs = this.PageData.allControls.imageDivs.concat(
        imageControl
      );
    }
    if (
      !this.PageData.manageControls.some(
        (x) => x.control.name == imageControl.name
      )
    ) {
      this.PageData.manageControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.PageData.manageControls,
          imageControl,
          imageControl.name,
          false,
          true,
          false
        )
      );
    }
    this.UpdateSelectedPropertyOfImageControl(imageControl);
  }

  AddNewVideoControl(event) {
    this.monitorLayoutService.OnOtherControlsClick()
    this.PageData.controlsCount.totalVideoCount++;
    const name = 'Video' + this.PageData.controlsCount.totalVideoCount;
    const src = [{language: 'English', languageCode: 'en', src: '', url: ''}];
    const defaultHeight = 60;
    const defaultWidth = 60;
    const defaultZIndex = 50;
    const videoControl = this.CreateVideoControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZIndex
    );
    this.AddVideoToPage(videoControl);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  private AddVideoToPage(videoControl: VideoControl) {
    if (
      !this.PageData.allControls.videoDivs.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.PageData.allControls.videoDivs = this.PageData.allControls.videoDivs.concat(
        videoControl
      );
    }
    if (
      !this.PageData.manageControls.some(
        (x) => x.control.name == videoControl.name
      )
    ) {
      this.PageData.manageControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.PageData.manageControls,
          videoControl,
          videoControl.name,
          false,
          false,
          true
        )
      );
    }
    this.UpdateSelectedPropertyOfVideoControl(videoControl);
  }

  AddNewSliderControl(event: IMoveEvent) {
    this.monitorLayoutService.OnOtherControlsClick()
    this.PageData.controlsCount.totalSliderCount++;
    const name = 'Slider' + this.PageData.controlsCount.totalSliderCount;
    const defaultHeight = 50;
    const defaultWidth = 60;
    const defaultZIndex = 50;
    const sliderControl = this.CreateSliderControl(
      name,
      defaultWidth,
      defaultHeight,
      event.x,
      Math.round(event.y),
      defaultZIndex
    );
    this.AddSliderToPage(sliderControl);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  AddSliderToPage(sliderControl: SliderControl) {
    if (
      !this.PageData.allControls.slidersDivs.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.PageData.allControls.slidersDivs = this.PageData.allControls.slidersDivs.concat(
        sliderControl
      );
    }
    if (
      !this.PageData.manageControls.some(
        (x) => x.control.name === sliderControl.name
      )
    ) {
      this.PageData.manageControls = [].concat(
        this.AddNewControlToOtherControlListAndGetOtherControlList(
          this.PageData.manageControls,
          sliderControl,
          sliderControl.name,
          false,
          false,
          false,
          true
        )
      );
    }
    this.UpdateSelectedPropertyOfSliderControl(sliderControl);
  }

  ControlMoveEnd(event) {
    this.monitorLayoutService.OnOtherControlsClick()
    const control = this.PageData.manageControls.find(
      (x) => x.control === event.control);
    control.control.form.controls.left.setValue(event.event.x);
    control.control.form.controls.top.setValue(event.event.y);
    control.control.styles.left = event.event.x;
    control.control.styles.top = event.event.y;
    this.SelectAndHighLightBasedOnControl(control);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  ControlResizeEnd(event) {
    this.monitorLayoutService.OnOtherControlsClick()
    const control = this.PageData.manageControls.find(
      (x) => x.control === event.control);
    control.control.form.controls.width.setValue(event.event.size.width);
    control.control.form.controls.height.setValue(event.event.size.height);
    this.SelectAndHighLightBasedOnControl(control);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  private SelectAndHighLightBasedOnControl(control) {
    this.SelectControlOnPage(control.control);
    if (control.isImageControl) {
      this.UpdateSelectedPropertyOfImageControl(control.control);
    }else if (control.isVideoControl){
      this.UpdateSelectedPropertyOfVideoControl(control.control);
    }else if (control.isSliderControl){
      this.UpdateSelectedPropertyOfSliderControl(control.control);
    }else if (control.isLabelControl){
      this.UpdateSelectedPropertyOfLabelControl(control.control);
    }
  }

  RemoveLabel(control: any) {
    this.PageData.allControls.labelDivs.splice(
      this.PageData.allControls.labelDivs.indexOf(control),
      1
    );
    this.PageData.manageControls = [].concat(
      this.ResetOtherControlPropertyWindow(
        this.PageData.manageControls,
        control
      )
    );
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
    this.monitorLayoutService.HandleAllControlZIndex(control.styles.zindex)
  }

  RemoveImage(control: any) {
    this.PageData.allControls.imageDivs.splice(
      this.PageData.allControls.imageDivs.indexOf(control),
      1
    );
    this.PageData.manageControls = [].concat(
      this.ResetOtherControlPropertyWindow(
        this.PageData.manageControls,
        control
      )
    );
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
    this.monitorLayoutService.HandleAllControlZIndex(control.styles.zindex)
  }
  RemoveVideo(control: any) {
    this.PageData.allControls.videoDivs.splice(
      this.PageData.allControls.videoDivs.indexOf(control),
      1
    );
    this.PageData.manageControls = [].concat(
      this.ResetOtherControlPropertyWindow(
        this.PageData.manageControls,
        control
      )
    );
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
    this.monitorLayoutService.HandleAllControlZIndex(control.styles.zindex)
  }
  RemoveSlider(control: any) {
    this.PageData.allControls.slidersDivs.splice(
      this.PageData.allControls.slidersDivs.indexOf(control),
      1
    );
    this.PageData.manageControls = [].concat(
      this.ResetOtherControlPropertyWindow(
        this.PageData.manageControls,
        control
      )
    );
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
    this.monitorLayoutService.HandleAllControlZIndex(control.styles.zindex)
  }

  /* #region  control click functions */
  ImageClick(control) {
    this.monitorLayoutService.OnOtherControlsClick()
    this.SelectControlOnPage(control);
    this.UpdateSelectedPropertyOfImageControl(control);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  LabelClick(control) {
    this.monitorLayoutService.OnOtherControlsClick()
    this.SelectControlOnPage(control);
    this.UpdateSelectedPropertyOfLabelControl(control);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  VideoClick(control) {
    this.monitorLayoutService.OnOtherControlsClick()
    this.SelectControlOnPage(control);
    this.UpdateSelectedPropertyOfVideoControl(control);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  SliderClick(control) {
    this.SelectControlOnPage(control);
    this.monitorLayoutService.OnOtherControlsClick()
    this.UpdateSelectedPropertyOfSliderControl(control);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  private SelectControlOnPage(control): void {
    this.PageData.manageControls = [].concat(this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
      this.PageData.manageControls,
      control.name
    ));
  }

  private UpdateSelectedPropertyOfLabelControl(labelControl) {
    this.PageData.allControls.imageDivs.map(x => {
      x.selected = false;
    });

    this.PageData.allControls.labelDivs.map(x => {
      x.selected = false;
    });
    this.PageData.allControls.labelDivs.find(x => x.name === labelControl.name).selected = true;

    this.PageData.allControls.videoDivs.map(x => {
      x.selected = false;
    });

    this.PageData.allControls.slidersDivs.map(x => {
      x.selected = false;
    });
  }

  private UpdateSelectedPropertyOfVideoControl(videoControl) {
    this.PageData.allControls.imageDivs.map(x => {
      x.selected = false;
    });

    this.PageData.allControls.labelDivs.map(x => {
      x.selected = false;
    });

    this.PageData.allControls.videoDivs.map(x => {
      x.selected = false;
    });
    this.PageData.allControls.videoDivs.find(x => x.name === videoControl.name).selected = true;

    this.PageData.allControls.slidersDivs.map(x => {
      x.selected = false;
    });
  }

  private UpdateSelectedPropertyOfImageControl(imageControl) {
    this.PageData.allControls.imageDivs.map(x => {
      x.selected = false;
    });
    this.PageData.allControls.imageDivs.find(x => x.name === imageControl.name).selected = true;

    this.PageData.allControls.labelDivs.map(x => {
      x.selected = false;
    });

    this.PageData.allControls.videoDivs.map(x => {
      x.selected = false;
    });

    this.PageData.allControls.slidersDivs.map(x => {
      x.selected = false;
    });
  }

  private UpdateSelectedPropertyOfSliderControl(sliderControl) {
    this.PageData.allControls.imageDivs.map(x => {
      x.selected = false;
    });

    this.PageData.allControls.labelDivs.map(x => {
      x.selected = false;
    });

    this.PageData.allControls.videoDivs.map(x => {
      x.selected = false;
    });

    this.PageData.allControls.slidersDivs.map(x => {
      x.selected = false;
    });
    this.PageData.allControls.slidersDivs.find(x => x.name === sliderControl.name).selected = true;
  }

  /* #endregion  control click functions */

  private ResetOtherControlPropertyWindow(otherControls, control) {
    const index = otherControls.indexOf(
      otherControls.find((x) => x.control.name === control.name)
    );
    otherControls.splice(index, 1);
    if (index !== 0) {
      this.ShowServicesOtherControlPropertyWindow(
        otherControls[index - 1].control.name
      );
    } else if (otherControls.length !== 0) {
      this.ShowServicesOtherControlPropertyWindow(
        otherControls[index].control.name
      );
    }
    return otherControls;
  }

  ShowServicesOtherControlPropertyWindow(name: string) {
    this.PageData.manageControls.map((x) => (x.showPropertyWindow = false));
    this.PageData.manageControls.find(
      (x) => x.control.name === name
    ).showPropertyWindow = true;
  }

  CreateImageControl(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    x: number,
    y: number,
    zindex: number
  ) {
    const imageControl = new ImageControl(
      this.formBuilder,
      name,
      src,
      defaultWidth,
      defaultHeight,
      x,
      y,
      zindex
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
    zindex: number
  ) {
    return new VideoControl(
      this.formBuilder,
      name,
      src,
      defaultWidth,
      defaultHeight,
      x,
      y,
      zindex
    );
  }

  CreateLabelControl(
    name: string,
    defaultText: object,
    defaultColor: string,
    defaultWidth: number,
    defaultHeight: number,
    y: number,
    x: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string,
    alignment: string = this.Alignment,
    zindex: number,
    backgroundColor:string=this.BackgroundColor,
    isTextToSpeachEnable:boolean
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
      font,
      fontStyle,
      fontSize,
      fontWeight,
      alignment,
      zindex,
      backgroundColor,
      isTextToSpeachEnable
    );
  }

  CreateSliderControl(
    name: string,
    defaultWidth: number,
    defaultHeight: number,
    y: number,
    x: number,
    zindex: number
  ) {
    return new SliderControl(
      this.formBuilder,
      name,
      [],
      defaultWidth,
      defaultHeight,
      y,
      x,
      zindex
    );
  }

  AddNewControlToOtherControlListAndGetOtherControlList(
    ManageControls: DDLControl[],
    control: Control,
    name: string,
    isLabelControl: boolean,
    isImageControl: boolean,
    isVideoControl: boolean,
    isSliderControl: boolean = false
  ): any {
    ManageControls.push({
      showPropertyWindow: false,
      control,
      isLabelControl,
      isImageControl,
      isSliderControl,
      isVideoControl,
    });
    return this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
      ManageControls,
      name
    );
  }

  private GetOtherControlsListAfterSettingShowPropertyWindowvalue(
    ddlControl: Array<DDLControl>,
    name: string
  ) {
    ddlControl.map((x) => (x.showPropertyWindow = false));
    ddlControl.find((x) => x.control.name === name).showPropertyWindow = true;
    return ddlControl;
  }
  /* #region  Declare Properties */

  public ConvertTranslatedLanguageArrayToObject(langArray) {
    return this.monitorLayoutService.ConvertTranslatedLanguageArrayToObject(langArray);
  }

  SetImageFormArray(src: ILanguageControl[]) {
    this.ImageFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach((ele, index) => {
        const imageSrc = src.find(x => x.languageCode === ele.languageCode)?.url || '/assets/img-icon.svg';
        this.ImageFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          [ele.languageCode]: [imageSrc, [requiredFileType(SupportedImageFileTypes, SupportedImageFileSize)]] ,
          url: imageSrc
        }));
      });
    }
    this.ImageFormArraySubject.next(Object.create(this.ImageFormArraySubject.value));
  }
  IncreaseZIndex(){
    this.monitorLayoutService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.monitorLayoutService.DecreaseZIndex();
  }
}
