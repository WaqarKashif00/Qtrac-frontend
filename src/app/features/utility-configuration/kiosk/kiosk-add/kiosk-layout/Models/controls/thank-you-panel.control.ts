import { FormBuilder } from '@angular/forms';
import { IThankYouItemControl } from '../thank-you-page-item.interface';
import { Control } from './control';

export class ThankYouPanelControl extends Control {
  items: Array<IThankYouItemControl>;
  verticalPadding: number;
  horizontalPadding: number;
  dynamicTextColor: string;
  messageDisplayTimeInSeconds: number;
  itemBackgroundColor: string;
  constructor(
    formBuilder: FormBuilder,
    height: number,
    top: number,
    width: number,
    backgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    left: number,
    dynamicTextColor: string,
    horizontalPadding: number,
    verticalPadding: number,
    messageDisplayTimeInSeconds: number,
    itemBackgroundColor: string
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      height,
      top,
      left,
      width,
      backgroundColor,
      color,
      horizontalPadding,
      verticalPadding,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      dynamicTextColor,
      messageDisplayTimeInSeconds,
      itemBackgroundColor,
    );
    this.items = new Array<IThankYouItemControl>();
    this.InitializeProperties(
      height,
      top,
      left,
      width,
      backgroundColor,
      color,
      horizontalPadding,
      verticalPadding,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      dynamicTextColor,
      messageDisplayTimeInSeconds,
      itemBackgroundColor
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    height: number,
    top: number,
    left: number,
    width: number,
    backgroundColor: string,
    color: string,
    horizontalPadding: number,
    verticalPadding: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    dynamicTextColor: string,
    messageDisplayTimeInSeconds: number,
    itemBackgroundColor: string
  ) {
    this.form = formBuilder.group(
      {
        height,
        top,
        left,
        width,
        backgroundColor,
        color,
        horizontalPadding,
        verticalPadding,
        font,
        fontStyle,
        fontSize,
        fontWeight,
        dynamicTextColor,
        messageDisplayTimeInSeconds,
        itemBackgroundColor
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    height: number,
    top: number,
    left: number,
    width: number,
    backgroundColor: string,
    color: string,
    horizontalPadding: number,
    verticalPadding: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    dynamicTextColor: string,
    messageDisplayTimeInSeconds: number,
    itemBackgroundColor: string
  ) {
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
    this.styles.width = width;
    this.dynamicTextColor = dynamicTextColor;
    this.messageDisplayTimeInSeconds = messageDisplayTimeInSeconds;
    this.itemBackgroundColor = itemBackgroundColor;
  }
}
