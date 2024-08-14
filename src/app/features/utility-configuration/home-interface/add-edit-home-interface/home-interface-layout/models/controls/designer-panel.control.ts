import { Control } from './control';
import { FormBuilder, Validators } from '@angular/forms';

export class DesignerPanelControl extends Control {
  uniqueName: string;
  backgroundImage: string;
  backgroundImageFile: File;
  cellSize: number;
  showGrid: boolean;
  constructor(
    formBuilder: FormBuilder,
    width: number,
    height: number,
    templateName: string,
    backgroundImage: string,
    backgroundColor: string,
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    cellSize: number,
    showGrid: boolean,
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
      templateName,
      fontWeight,
      cellSize,
      showGrid
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
      templateName,
      fontWeight,
      cellSize,
      showGrid
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
    name: string,
    fontWeight: number | string,
    cellSize: number,
    showGrid: boolean,
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
      fontWeight,
      cellSize: [cellSize, {updateOn: 'change'}],
      showGrid: [showGrid, {updateOn: 'change'}],
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
    templateName: string,
    fontWeight: number | string,
    cellSize: number,
    showGrid: boolean
  ) {
    this.styles.width = width;
    this.styles.height = height;
    this.backgroundImage = backgroundImage;
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.styles.fontStyle = fontStyle;
    this.styles.color = color;
    this.styles.backgroundColor = backgroundColor;
    this.name = templateName;
    this.backgroundImageFile = null;
    this.styles.fontWeight = fontWeight;
    this.uniqueName = 'General Properties';
    this.cellSize = cellSize;
    this.showGrid = showGrid;
  }
}
