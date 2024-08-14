import { FormBuilder, Validators } from '@angular/forms';
import { Control } from './control';

export class LabelControl extends Control {
  text: object;
  hyperLink: string;
  uniqueName: string;
  verticalPadding: string;
  horizontalPadding: string;
  selected: boolean;
  alignment: string;
  constructor(
    formBuilder: FormBuilder,
    name: string,
    text: object,
    hyperLink: string,
    color: string,
    backgroundColor: string,
    verticalPadding: string,
    horizontalPadding: string,
    roundCorners: string,
    width: number,
    height: number,
    top: number,
    left: number,
    zindex: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    alignment: string
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      name,
      text,
      hyperLink,
      color,
      backgroundColor,
      verticalPadding,
      horizontalPadding,
      roundCorners,
      width,
      height,
      top,
      left,
      zindex,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      alignment
    );
    this.InitializeProperties(
      name,
      text,
      hyperLink,
      height,
      width,
      top,
      left,
      zindex,
      color,
      backgroundColor,
      verticalPadding,
      horizontalPadding,
      roundCorners,
      fontSize,
      font,
      fontStyle,
      fontWeight,
      alignment
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    name: string,
    text: object,
    hyperLink: string,
    color: string,
    backgroundColor: string,
    verticalPadding: string,
    horizontalPadding: string,
    boxRoundCorners: string,
    width: number,
    height: number,
    top: number,
    left: number,
    zindex: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    alignment: string
  ) {
    this.form = formBuilder.group(
      {
        name: [name, Validators.required],
        text,
        hyperLink,
        color,
        backgroundColor,
        verticalPadding,
        horizontalPadding,
        boxRoundCorners,
        width,
        height,
        top,
        left,
        zindex: [zindex,{ updateOn: 'change' }],
        font,
        fontStyle,
        fontSize,
        fontWeight,
        alignment:[alignment,{ updateOn: 'change' }]
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    name: string,
    text: object,
    hyperLink: string,
    height: number,
    width: number,
    top: number,
    left: number,
    zindex: number,
    color: string,
    backgroundColor: string,
    verticalPadding: string,
    horizontalPadding: string,
    roundCorners: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    alignment: string
  ) {
    this.name = name;
    this.text = text;
    this.hyperLink = hyperLink;
    this.verticalPadding = verticalPadding;
    this.horizontalPadding = horizontalPadding;
    this.styles.backgroundColor = backgroundColor;
    this.styles.boxRoundCorners = roundCorners;
    this.styles.height = height;
    this.styles.width = width;
    this.styles.top = top;
    this.styles.zindex = zindex;
    this.styles.left = left;
    this.styles.color = color;
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.styles.fontStyle = fontStyle;
    this.styles.fontWeight = fontWeight;
    this.uniqueName = 'Label Properties';
    this.alignment = alignment;
  }
}
