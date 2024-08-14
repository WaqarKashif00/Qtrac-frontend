import { FormBuilder, Validators } from '@angular/forms';
import { Control } from './control';

export class DesignerPanelControl extends Control {
  uniqueName: string;
  workFlowId: string;
  workFlowName: string;
  backgroundImage: string;
  backgroundImageFile: File;
  showNextUpPanel: boolean;
  showNowCallingPanel: boolean;
  showNowHelpingPanel: boolean;
  cellSize: number;
  showGrid: boolean;
  enableSoundAlert: boolean;
  enableTextToSpeech:boolean;
  textToSpeachTimer:number| string;
  queueType: string;
  selectedQueues:string[];

  constructor(
    formBuilder: FormBuilder,
    width: number,
    height: number,
    workFlowId: string,
    workFlowName: string,
    templateName: string,
    backgroundImage: string,
    backgroundColor: string,
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    showNextUpPanel: boolean,
    showNowCallingPanel: boolean,
    showNowHelpingPanel: boolean,
    cellSize: number,
    showGrid: boolean,
    enableSoundAlert: boolean,
    enableTextToSpeech: boolean,
    textToSpeachTimer?:number| string,
    queueType?: string,
    selectedQueues?:string[]


  ) {
    super();
    this.InitializeForm(
      formBuilder,
      width,
      height,
      backgroundImage,
      backgroundColor,
      color,
      fontSize,
      font,
      fontStyle,
      workFlowId,
      templateName,
      fontWeight,
      showNextUpPanel,
      showNowCallingPanel,
      showNowHelpingPanel,
      cellSize,
      showGrid,
      enableSoundAlert,
      enableTextToSpeech,
      textToSpeachTimer,
      queueType,
      selectedQueues,

    );
    this.InitializeProperties(
      width,
      height,
      backgroundImage,
      backgroundColor,
      color,
      fontSize,
      font,
      fontStyle,
      workFlowName,
      workFlowId,
      templateName,
      fontWeight,
      showNextUpPanel,
      showNowCallingPanel,
      showNowHelpingPanel,
      cellSize,
      showGrid,
      enableSoundAlert,
      enableTextToSpeech,
      textToSpeachTimer,
      queueType,
      selectedQueues,
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    width: number,
    height: number,
    backgroundImage: string,
    backgroundColor: string,
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    workFlowId: string,
    name: string,
    fontWeight: number | string,
    showNextUpPanel: boolean,
    showNowCallingPanel: boolean,
    showNowHelpingPanel: boolean,
    cellSize: number,
    showGrid: boolean,
    enableSoundAlert: boolean,
    enableTextToSpeech:boolean,
    textToSpeachTimer:number| string,
    queueType: string,
    selectedQueues:string[],

  ) {
    this.form = formBuilder.group({
      name: [name, Validators.required],
      width,
      height,
      backgroundImage,
      backgroundColor,
      color,
      font,
      fontStyle,
      fontSize,
      backgroundImageFile: [],
      workFlowId,
      fontWeight,
      showNextUpPanel: [showNextUpPanel, {updateOn: 'change'}],
      showNowCallingPanel: [showNowCallingPanel, {updateOn: 'change'}],
      showNowHelpingPanel:  [showNowHelpingPanel, {updateOn: 'change'}],
      cellSize:[cellSize, {updateOn: 'change'}],
      showGrid:[showGrid, {updateOn: 'change'}],
      enableSoundAlert: [enableSoundAlert],
      enableTextToSpeech: [enableTextToSpeech, {updateOn: 'change'}],
      textToSpeachTimer,
      queueType:[queueType, {updateOn: 'change'}],
      selectedQueues: [selectedQueues, {updateOn: 'change'}]
    });
  }

  private InitializeProperties(
    width: number,
    height: number,
    backgroundImage: string,
    backgroundColor: string,
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    workFlowName: string,
    workFlowId: string,
    templateName: string,
    fontWeight: number | string,
    showNextUpPanel: boolean,
    showNowCallingPanel: boolean,
    showNowHelpingPanel: boolean,
    cellSize: number,
    showGrid: boolean,
    enableSoundAlert: boolean,
    enableTextToSpeech: boolean,
    textToSpeachTimer:number| string,
    queueType: string,
    selectedQueues: string[],
  ) {
    this.styles.width = width;
    this.styles.height = height;
    this.backgroundImage = backgroundImage;
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.styles.fontStyle = fontStyle;
    this.styles.color = color;
    this.styles.backgroundColor = backgroundColor;
    this.workFlowName = workFlowName;
    this.workFlowId = workFlowId;
    this.name = templateName;
    this.backgroundImageFile = null;
    this.styles.fontWeight = fontWeight;
    this.uniqueName = 'General Properties';
    this.showNextUpPanel = showNextUpPanel;
    this.showNowCallingPanel = showNowCallingPanel;
    this.showNowHelpingPanel = showNowHelpingPanel;
    this.cellSize = cellSize;
    this.showGrid = showGrid;
    this.enableSoundAlert = enableSoundAlert;
    this.enableTextToSpeech = enableTextToSpeech;
    this.textToSpeachTimer = textToSpeachTimer;
    this.queueType = queueType;
    this.selectedQueues = selectedQueues;
  }
}
