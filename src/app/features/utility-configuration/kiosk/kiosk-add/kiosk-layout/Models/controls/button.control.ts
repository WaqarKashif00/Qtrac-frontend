import { FormBuilder } from '@angular/forms';
import { ILanguageControl } from '../../../../../../../models/common/language-control.interface';
import { Control } from './control';

export class ButtonControl extends Control {
  text: object;
  selected: boolean;
  showButton: boolean;
  showPropertyWindow: boolean;
  src: ILanguageControl[];
  showIcon: boolean;
  border: string;
  borderColor: string;
  shadow: boolean;
  constructor(
    formBuilder: FormBuilder,
    name: string,
    text: object,
    color: string,
    backgroundColor: string,
    width: number,
    height: number,
    fontSize: number,
    fontStyle: string,
    font: string,
    fontWeight: string | number,
    selected: boolean,
    left: number,
    top: number,
    src: ILanguageControl[],
    showIcon: boolean,
    boxRoundCorners: string,
    border: string,
    borderColor: string,
    shadow: boolean
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      backgroundColor,
      text,
      color,
      width,
      height,
      fontSize,
      fontStyle,
      font,
      fontWeight,
      left,
      top,
      src,
      showIcon,
      boxRoundCorners,
      border,
      borderColor,
      shadow
    );
    this.InitializeProperties(
      name,
      backgroundColor,
      text,
      height,
      width,
      fontSize,
      fontStyle,
      font,
      fontWeight,
      color,
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

  private InitializeForm(
    formBuilder: FormBuilder,
    backgroundColor: string,
    text: object,
    color: string,
    width: number,
    height: number,
    fontSize: number,
    fontStyle: string,
    font: string,
    fontWeight: string | number,
    left: number,
    top: number,
    src: ILanguageControl[],
    showIcon: boolean,
    boxRoundCorners: string,
    border: string,
    borderColor: string,
    shadow: boolean
  ) {
    this.form = formBuilder.group(
      {
        backgroundColor,
        text,
        color,
        width,
        height,
        fontSize,
        fontStyle,
        font,
        fontWeight,
        left,
        top,
        src: [src],
        showIcon: [showIcon, {updateOn: 'change'}],
        boxRoundCorners,
        border,
        borderColor,
        shadow
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    name: string,
    backgroundColor: string,
    text: object,
    height: number,
    width: number,
    fontSize: number,
    fontStyle: string,
    font: string,
    fontWeight: string | number,
    color: string,
    selected: boolean,
    left: number,
    top: number,
    src: ILanguageControl[],
    showIcon: boolean,
    boxRoundCorners: string,
    border: string,
    borderColor: string,
    shadow: boolean
  ) {
    this.styles.backgroundColor = backgroundColor;
    this.name = name;
    this.text = text;
    this.styles.height = height;
    this.styles.width = width;
    this.styles.fontSize = fontSize;
    this.styles.fontStyle = fontStyle;
    this.styles.font = font;
    this.styles.fontWeight = fontWeight;
    this.styles.color = color;
    this.selected = selected;
    this.styles.left = left;
    this.styles.top = top;
    this.src = src;
    this.showIcon = showIcon;
    this.styles.boxRoundCorners = boxRoundCorners;
    this.border = border;
    this.borderColor = borderColor;
    this.shadow = shadow;
  }
}
