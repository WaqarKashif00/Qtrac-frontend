import { FormBuilder } from '@angular/forms';
import { Control } from './control';

export class TicketItemControl extends Control {
  type: string;
  text: object;
  value: string;
  visible: boolean;
  selected: boolean;
  horizontalPadding: string;
  verticalPadding: string;
  showItem: boolean;
  valuesFont: string;
  valuesFontStyle: string;
  valuesFontSize: number;
  valuesFontWeight: number | string;
  constructor(
    formBuilder: FormBuilder,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    type: string,
    text: object,
    value: string,
    visible: boolean,
    selected: boolean,
    color: string,
    backgroundColor: string,
    horizontalPadding: string,
    boxRoundCorners: string,
    verticalPadding: string,
    height: number,
    width: number,
    showItem: boolean,
    valuesFont: string,
    valuesFontStyle: string,
    valuesFontSize: number,
    valuesFontWeight: number | string,
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      text,
      color,
      backgroundColor,
      horizontalPadding,
      boxRoundCorners,
      verticalPadding,
      height,
      width,
      showItem,
      valuesFont,
      valuesFontStyle,
      valuesFontSize,
      valuesFontWeight,
    );
    this.InitializeProperties(
      font,
      fontStyle,
      fontSize,
      fontWeight,
      type,
      text,
      value,
      visible,
      selected,
      color,
      backgroundColor,
      horizontalPadding,
      boxRoundCorners,
      verticalPadding,
      height,
      width,
      showItem,
      valuesFont,
      valuesFontStyle,
      valuesFontSize,
      valuesFontWeight,
    );
  }
  private InitializeForm(
    formBuilder: FormBuilder,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    text: object,
    color: string,
    backgroundColor: string,
    horizontalPadding: string,
    boxRoundCorners: string,
    verticalPadding: string,
    height: number,
    width: number,
    showItem: boolean,
    valuesFont: string,
    valuesFontStyle: string,
    valuesFontSize: number,
    valuesFontWeight: number | string,
  ) {
    this.form = formBuilder.group(
      {
        font,
        fontStyle,
        fontSize,
        fontWeight,
        text,
        color,
        backgroundColor,
        horizontalPadding,
        boxRoundCorners,
        verticalPadding,
        height,
        width,
        showItem: [showItem, {updateOn: 'change'}],
        valuesFont,
        valuesFontStyle,
        valuesFontSize,
        valuesFontWeight,
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    type: string,
    text: object,
    value: string,
    visible: boolean,
    selected: boolean,
    color: string,
    backgroundColor: string,
    horizontalPadding: string,
    boxRoundCorners: string,
    verticalPadding: string,
    height: number,
    width: number,
    showItem: boolean,
    valuesFont: string,
    valuesFontStyle: string,
    valuesFontSize: number,
    valuesFontWeight: number | string,
  ) {
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.type = type;
    this.text = text;
    this.value = value;
    this.visible = visible;
    this.styles.fontStyle = fontStyle;
    this.styles.fontWeight = fontWeight;
    this.selected = selected;
    this.styles.color = color;
    this.styles.backgroundColor = backgroundColor;
    this.styles.height = height;
    this.styles.width = width;
    this.styles.boxRoundCorners = boxRoundCorners;
    this.horizontalPadding = horizontalPadding;
    this.verticalPadding = verticalPadding;
    this.showItem = showItem;
    this.valuesFont = valuesFont;
    this.valuesFontSize = valuesFontSize;
    this.valuesFontStyle = valuesFontStyle;
    this.valuesFontWeight = valuesFontWeight;
  }
}
