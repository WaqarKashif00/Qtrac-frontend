import { FormBuilder } from '@angular/forms';
import { Control } from './control';
import { ServiceBoxControl } from './service-box.control';

export class  ServicePanelControl extends Control {
  datasource: Array<ServiceBoxControl>;
  verticalPadding: number;
  horizontalPadding: number;
  mode: Mode;
  showServiceIcons: boolean;
  textBackgroundColor: string;
  constructor(
    formBuilder: FormBuilder,
    width: number,
    height: number,
    top: number,
    left: number,
    backgroundColor: string,
    color: string,
    verticalPadding: number,
    horizontalPadding: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    mode: number,
    showServiceIcons: boolean,
    textBackgroundColor: string
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      width,
      height,
      top,
      left,
      backgroundColor,
      color,
      horizontalPadding,
      verticalPadding,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      mode,
      showServiceIcons,
      textBackgroundColor
    );
    this.datasource = new Array<ServiceBoxControl>();
    this.InitializeProperties(
      width,
      height,
      top,
      left,
      backgroundColor,
      color,
      horizontalPadding,
      verticalPadding,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      mode,
      showServiceIcons,
      textBackgroundColor
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    width: number,
    height: number,
    top: number,
    left: number,
    backgroundColor: string,
    color: string,
    horizontalPadding: number,
    verticalPadding: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    mode: number,
    showServiceIcons: boolean,
    textBackgroundColor: string
  ) {
    this.form = formBuilder.group(
      {
        width,
        height,
        top,
        left,
        backgroundColor,
        color,
        horizontalPadding,
        verticalPadding,
        font,
        fontStyle,
        fontSize,
        fontWeight,
        mode: [mode, {updateOn: 'change'}],
        showServiceIcons: [showServiceIcons, {updateOn: 'change'}],
        textBackgroundColor
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    width: number,
    height: number,
    top: number,
    left: number,
    backgroundColor: string,
    color: string,
    horizontalPadding: number,
    verticalPadding: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    mode: number,
    showServiceIcons: boolean,
    textBackgroundColor: string
  ) {
    this.styles.width = width;
    this.styles.height = height;
    this.styles.top = top;
    this.styles.left = left;
    this.styles.backgroundColor = backgroundColor;
    this.styles.color = color;
    this.horizontalPadding = horizontalPadding;
    this.verticalPadding = verticalPadding;
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.styles.fontStyle = fontStyle;
    this.styles.fontWeight = fontWeight;
    this.mode = mode;
    this.showServiceIcons = showServiceIcons;
    this.textBackgroundColor = textBackgroundColor;
  }
}
export enum Mode {
  Single = 2,
  All = 1,
}
