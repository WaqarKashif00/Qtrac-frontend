import { Control } from './control';
import { FormBuilder } from '@angular/forms';

export class HeaderTextControl extends Control {
  text: string;
  constructor(
    formBuilder: FormBuilder,
    name: string,
    text: string,
    color: string,
    width: number,
    height: number,
    top: number,
    left: number,
    font: string,
    fontStyle: string,
    fontSize: number
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      name,
      text,
      color,
      width,
      height,
      top,
      left,
      font,
      fontStyle,
      fontSize
    );
    this.InitializeProperties(
      name,
      text,
      height,
      width,
      top,
      left,
      color,
      fontSize,
      font,
      fontStyle
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    name: string,
    text: string,
    color: string,
    width: number,
    height: number,
    top: number,
    left: number,
    font: string,
    fontStyle: string,
    fontSize: number
  ) {
    this.form = formBuilder.group(
      {
        name,
        text,
        color,
        width,
        height,
        top,
        left,
        font,
        fontStyle,
        fontSize,
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    name: string,
    text: string,
    height: number,
    width: number,
    top: number,
    left: number,
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string
  ) {
    this.name = name;
    this.text = text;
    this.styles.height = height;
    this.styles.width = width;
    this.styles.top = top;
    this.styles.left = left;
    this.styles.color = color;
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.styles.fontStyle = fontStyle;
  }
}
