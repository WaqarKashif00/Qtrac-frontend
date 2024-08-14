import { Control } from './control';
import { FormBuilder } from '@angular/forms';
import { ItemsControl } from './items.control';
import { ButtonControl } from './button.control';

export class PanelControl extends Control {
  items: Array<ItemsControl>;
  button: ButtonControl;
  verticalPadding: string;
  horizontalPadding: string;
  dynamicTextColor: string;
  showServiceIcons: boolean;
  constructor(
    formBuilder: FormBuilder,
    height: number,
    top: number,
    backgroundColor: string,
    roundCorners: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    left: number,
    dynamicTextColor,
    horizontalPadding: string,
    verticalPadding: string,
    showServiceIcons: boolean
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      height,
      top,
      left,
      backgroundColor,
      roundCorners,
      color,
      horizontalPadding,
      verticalPadding,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      dynamicTextColor,
      showServiceIcons
    );
    this.items = new Array<ItemsControl>();
    this.InitializeProperties(
      height,
      top,
      left,
      backgroundColor,
      color,
      horizontalPadding,
      roundCorners,
      verticalPadding,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      dynamicTextColor,
      showServiceIcons
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    height: number,
    top: number,
    left: number,
    backgroundColor: string,
    boxRoundCorners: string,
    color: string,
    horizontalPadding: string,
    verticalPadding: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    dynamicTextColor: string,
    showServiceIcons: boolean
  ) {
    this.form = formBuilder.group(
      {
        height,
        top,
        backgroundColor,
        color,
        horizontalPadding,
        boxRoundCorners,
        verticalPadding,
        font,
        fontStyle,
        fontSize,
        fontWeight,
        dynamicTextColor,
        showServiceIcons: [showServiceIcons, {updateOn: 'change'}]
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    height: number,
    top: number,
    left: number,
    backgroundColor: string,
    color: string,
    horizontalPadding: string,
    roundCorners: string,
    verticalPadding: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    dynamicTextColor: string,
    showServiceIcons: boolean
  ) {
    this.styles.height = height;
    this.styles.top = top;
    this.styles.left = left;
    this.styles.boxRoundCorners = roundCorners;
    this.styles.backgroundColor = backgroundColor;
    this.styles.color = color;
    this.horizontalPadding = horizontalPadding;
    this.verticalPadding = verticalPadding;
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.styles.fontStyle = fontStyle;
    this.styles.fontWeight = fontWeight;
    this.dynamicTextColor = dynamicTextColor;
    this.showServiceIcons = showServiceIcons;
  }
}
