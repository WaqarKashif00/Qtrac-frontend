import { FormBuilder, Validators } from '@angular/forms';
import { Control } from './control';

export class DesignerPanelControl extends Control {
  templateId: string;
  workFlowId: string;
  workFlowName: string;
  backgroundImage: string;
  backgroundImageFile: File;
  uniqueName: string;
  cellSize: number;
  showGrid: boolean;
  enableVirtualKeyboard : boolean;
  waitingTime: number;
  constructor(
    formBuilder: FormBuilder,
    width: number,
    height: number,
    workFlowId: string,
    workFlowName: string,
    name: string,
    backgroundImage: string,
    backgroundColor: string,
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    cellSize: number = 50,
    showGrid: boolean = true,
    enableVirtualKeyboard = true,
    waitingTime: number
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      width,
      height,
      name,
      backgroundImage,
      backgroundColor,
      color,
      fontSize,
      font,
      fontStyle,
      fontWeight,
      cellSize,
      showGrid,
      enableVirtualKeyboard,
      waitingTime
    );
    this.InitializeProperties(
      width,
      height,
      name,
      backgroundImage,
      backgroundColor,
      color,
      fontSize,
      font,
      fontStyle,
      workFlowName,
      workFlowId,
      fontWeight,
      cellSize,
      showGrid,
      enableVirtualKeyboard,
      waitingTime
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    width: number,
    height: number,
    name: string,
    backgroundImage: string,
    backgroundColor: string,
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    cellSize: number = 50,
    showGrid: boolean = true,
    enableVirtualKeyboard : boolean = true,
    waitingTime: number
  ) {
    this.form = formBuilder.group({
      width,
      height,
      name: [name, Validators.required],
      backgroundImage,
      backgroundColor,
      color,
      font,
      fontStyle,
      fontSize,
      backgroundImageFile: [this.backgroundImageFile],
      fontWeight,
      cellSize,
      showGrid,
      enableVirtualKeyboard,
      waitingTime
    });
  }

  private InitializeProperties(
    width: number,
    height: number,
    name: string,
    backgroundImage: string,
    backgroundColor: string,
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    workFlowName: string,
    workFlowId: string,
    fontWeight: number | string,
    cellSize: number = 50,
    showGrid: boolean = true,
    enableVirtualKeyboard = false,
    waitingTime: number
  ) {
    this.styles.fontWeight = fontWeight;
    this.styles.width = width;
    this.styles.height = height;
    this.name = name;
    this.backgroundImage = backgroundImage;
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.styles.fontStyle = fontStyle;
    this.styles.color = color;
    this.styles.backgroundColor = backgroundColor;
    this.workFlowName = workFlowName;
    this.workFlowId = workFlowId;
    this.backgroundImageFile = null;
    this.cellSize = cellSize;
    this.showGrid = showGrid;
    this.uniqueName = 'General Properties';
    this.enableVirtualKeyboard = enableVirtualKeyboard;
    this.waitingTime = waitingTime;
  }
}
