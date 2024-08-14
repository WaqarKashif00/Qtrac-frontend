import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { ILanguageControl } from '../../../../../../models/common/language-control.interface';
import { ILanguageDropdownList } from '../../../../../../models/common/language-dropdownlist.interface';
import { SupportedImageFileSize, SupportedImageFileTypes } from '../../../../../../models/constants/valid-file-types-and-sizes.constant';
import { requiredFileType } from '../../../../../../shared/validators/common.validator';
import { HomeInterfaceLayoutService } from '../home-interface-layout.service';
import { IConfiguration } from '../models/configuration.interface';
import { IControlSelection } from '../models/controls-selection.interface';
import { Control } from '../models/controls/control';
import { DesignerPanelControl } from '../models/controls/designer-panel.control';
import { ImageControl } from '../models/controls/image.control';
import { LabelControl } from '../models/controls/label.control';
import { SliderControl } from '../models/controls/slider.control';
import { VideoControl } from '../models/controls/video.control';
import { DDLControl } from '../models/drop-down-control.interface';
import { IMoveEvent } from '../models/move-event.interface';
import { IPageData } from '../models/page-data.interface';

@Injectable()
export class HomeInterfaceTemplateService extends AbstractComponentService {
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
  IsOnlyGrid$: Observable<boolean>;
  GridSize$: Observable<number>;
  ControlSelection$: Observable<IControlSelection>;

  Languages = [];

  Alignment = 'center';

  constructor(private layoutService: HomeInterfaceLayoutService) {
    super();
    this.InitializeSubjects();
    this.SubscribeObservables();
  }

  private SubscribeObservables() {
    this.subs.sink = this.layoutService.PageData$.subscribe((x) => {
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
        x.allControls.sliderDivs.forEach((m) => {
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

  private InitializeSubjects() {
    this.CurrentPageDataSubject = new BehaviorSubject<IConfiguration>(null);
    this.CurrentPageData$ = this.CurrentPageDataSubject.asObservable();
    this.DesignerPanelSubject = new BehaviorSubject<DesignerPanelControl>(null);
    this.DesignerPanel$ = this.DesignerPanelSubject.asObservable();
    this.ManageControlsSubject = new BehaviorSubject<DDLControl[]>(null);
    this.ManageControls$ = this.ManageControlsSubject.asObservable();
    this.IsEditMode$ = this.layoutService.IsEditMode$;
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$;
    this.ImageFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.ImageFormArray$ = this.ImageFormArraySubject.asObservable();
    this.ControlSelection$ = this.layoutService.ControlSelection$;
    this.Languages$ = this.layoutService.Languages$.pipe(
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
    this.PageData.allControls.sliderDivs = [].concat(this.PageData.allControls.sliderDivs);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  AddNewLabelControl(event: IMoveEvent) {
    this.layoutService.OnOtherControlsClick();
    this.PageData.controlsCount.totalLabelCount++;
    const name = 'Label' + this.PageData.controlsCount.totalLabelCount;
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
      Math.round(event.x),
      'Arial',
      'Italic',
      13,
      'normal',
      this.Alignment,
      defaultZIndex
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
    this.layoutService.OnOtherControlsClick();
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
      Math.round(event.x),
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
    this.layoutService.OnOtherControlsClick();
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
      Math.round(event.x),
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
    this.layoutService.OnOtherControlsClick();
    this.PageData.controlsCount.totalSliderCount++;
    const name = 'Slider' + this.PageData.controlsCount.totalSliderCount;
    const defaultHeight = 50;
    const defaultWidth = 60;
    const defaultZIndex = 50;
    const sliderControl = this.CreateSliderControl(
      name,
      defaultWidth,
      defaultHeight,
      Math.round(event.x),
      Math.round(event.y),
      defaultZIndex
    );
    this.AddSliderToPage(sliderControl);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  AddSliderToPage(sliderControl: SliderControl) {
    if (
      !this.PageData.allControls.sliderDivs.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.PageData.allControls.sliderDivs = this.PageData.allControls.sliderDivs.concat(
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
    this.layoutService.OnOtherControlsClick();
    const control = this.PageData.manageControls.find(
      (x) => x.control === event.control);
    control.control.form.controls.left.setValue(event.event.x);
    control.control.form.controls.top.setValue(event.event.y);
    this.SelectAndHighLightBasedOnControl(control);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  ControlResizeEnd(event) {
    this.layoutService.OnOtherControlsClick();
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
    this.layoutService.HandleAllControlZIndex(control.styles.zindex);
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
    this.layoutService.HandleAllControlZIndex(control.styles.zindex);
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
    this.layoutService.HandleAllControlZIndex(control.styles.zindex);
  }
  RemoveSlider(control: any) {
    this.PageData.allControls.sliderDivs.splice(
      this.PageData.allControls.sliderDivs.indexOf(control),
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
    this.layoutService.HandleAllControlZIndex(control.styles.zindex);
  }

  /* #region  control click functions */
  ImageClick(control) {
    this.layoutService.OnOtherControlsClick();
    this.SelectControlOnPage(control);
    this.UpdateSelectedPropertyOfImageControl(control);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  LabelClick(control) {
    this.layoutService.OnOtherControlsClick();
    this.SelectControlOnPage(control);
    this.UpdateSelectedPropertyOfLabelControl(control);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  VideoClick(control) {
    this.layoutService.OnOtherControlsClick();
    this.SelectControlOnPage(control);
    this.UpdateSelectedPropertyOfVideoControl(control);
    this.CurrentPageDataSubject.next(this.PageData.allControls);
    this.ManageControlsSubject.next(this.PageData.manageControls);
  }

  SliderClick(control) {
    this.SelectControlOnPage(control);
    this.layoutService.OnOtherControlsClick();
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

    this.PageData.allControls.sliderDivs.map(x => {
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

    this.PageData.allControls.sliderDivs.map(x => {
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

    this.PageData.allControls.sliderDivs.map(x => {
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

    this.PageData.allControls.sliderDivs.map(x => {
      x.selected = false;
    });
    this.PageData.allControls.sliderDivs.find(x => x.name === sliderControl.name).selected = true;
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
    zindex:number
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
    zindex:number
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
    zindex:number
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
      zindex
    );
  }

  CreateSliderControl(
    name: string,
    defaultWidth: number,
    defaultHeight: number,
    y: number,
    x: number,
    zindex:number
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
    return this.layoutService.ConvertTranslatedLanguageArrayToObject(langArray);
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
    this.layoutService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.layoutService.DecreaseZIndex();
  }
}
