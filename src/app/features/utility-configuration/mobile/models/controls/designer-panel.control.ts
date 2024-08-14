import { Control } from './control';
import { FormBuilder, Validators } from '@angular/forms';

export class DesignerPanelControl extends Control {
  templateId: string;
  workFlowId: string;
  workFlowName: string;
  backgroundImage: string;
  backgroundImageFile: File;
  uniqueName: string;
  waitingTime: number;
  constructor(
    formBuilder: FormBuilder,
    workFlowId: string,
    workFlowName: string,
    name: string,
    backgroundImage: string,
    backgroundColor: string,
    color: string,
    height: number,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    waitingTime: number
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      name,
      backgroundImage,
      backgroundColor,
      color,
      height,
      fontSize,
      font,
      fontStyle,
      fontWeight,
      waitingTime
    );
    this.InitializeProperties(
      name,
      backgroundImage,
      backgroundColor,
      color,
      height,
      fontSize,
      font,
      fontStyle,
      workFlowName,
      workFlowId,
      fontWeight,
      waitingTime
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    name: string,
    backgroundImage: string,
    backgroundColor: string,
    color: string,
    height: number,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    waitingTime: number
  ) {
    this.form = formBuilder.group({
      name: [name, Validators.required],
      backgroundImage,
      backgroundColor,
      color,
      height,
      font,
      fontStyle,
      fontSize,
      backgroundImageFile: [this.backgroundImageFile],
      fontWeight,
      waitingTime
    });
  }

  private InitializeProperties(
    name: string,
    backgroundImage: string,
    backgroundColor: string,
    color: string,
    height: number,
    fontSize: number,
    font: string,
    fontStyle: string,
    workFlowName: string,
    workFlowId: string,
    fontWeight: number | string,
    waitingTime: number
  ) {
    this.styles.fontWeight = fontWeight;
    this.name = name;
    this.backgroundImage = backgroundImage;
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.styles.fontStyle = fontStyle;
    this.styles.color = color;
    this.styles.height = height;
    this.styles.backgroundColor = backgroundColor;
    this.workFlowName = workFlowName;
    this.workFlowId = workFlowId;
    this.backgroundImageFile = null;
    this.uniqueName = 'General Properties';
    this.waitingTime = waitingTime;
  }
}
