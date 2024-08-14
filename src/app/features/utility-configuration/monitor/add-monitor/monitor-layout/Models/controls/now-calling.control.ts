import { Control } from './control';
import { FormBuilder } from '@angular/forms';

export class NowCallingControl extends Control {
  text: object;
  visibleServices: string;
  serviceArrangement: string;
  boxShadow: boolean;
  titleFont: string;
  titleFontSize: number;
  titleFontStyle: string;
  titleTextColor: string;
  titleFontWeight: number | string;
  src: string;
  backgroundImage: string;
  columnOne: string;
  columnTwo:string;

  constructor(
    formBuilder: FormBuilder,
    text: object,
    backgroundColor: string,
    color: string,
    boxShadow: boolean,
    boxRoundCorners: string,
    titleFont: string,
    titleFontSize: number,
    titleFontStyle: string,
    titleTextColor: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    height: number,
    width: number,
    top: number,
    left: number,
    src: string,
    titleFontWeight: number | string,
    fontWeight: number | string,
    columnOne?:string,
    columnTwo?:string,
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      text,
      backgroundColor,
      color,
      boxShadow,
      boxRoundCorners,
      titleFont,
      titleFontSize,
      titleFontStyle,
      titleTextColor,
      font,
      fontStyle,
      fontSize,
      height,
      width,
      top,
      left,
      src,
      titleFontWeight,
      fontWeight,
      columnOne,
      columnTwo,
    );
    this.InitializeProperties(
      text,
      backgroundColor,
      color,
      boxShadow,
      boxRoundCorners,
      titleFont,
      titleFontSize,
      titleFontStyle,
      titleTextColor,
      font,
      fontStyle,
      fontSize,
      height,
      width,
      top,
      left,
      src,
      titleFontWeight,
      fontWeight,
      columnOne,
      columnTwo
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    text: object,
    backgroundColor: string,
    color: string,
    boxShadow: boolean,
    boxRoundCorners: string,
    titleFont: string,
    titleFontSize: number,
    titleFontStyle: string,
    titleTextColor: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    height: number,
    width: number,
    top: number,
    left: number,
    src: string,
    titleFontWeight: number | string,
    fontWeight: number | string,
    columnOne?:string,
    columnTwo?:string,
  ) {
    this.form = formBuilder.group(
      {
        text,
        backgroundColor,
        color,
        boxShadow,
        boxRoundCorners,
        titleFont,
        titleFontSize,
        titleFontStyle,
        titleTextColor,
        font,
        fontStyle,
        fontSize,
        height,
        width,
        top,
        left,
        backgroundImage: [],
        src,
        titleFontWeight,
        fontWeight,
        columnOne,
        columnTwo,
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    text: object,
    backgroundColor: string,
    color: string,
    boxShadow: boolean,
    boxRoundCorners: string,
    titleFont: string,
    titleFontSize: number,
    titleFontStyle: string,
    titleTextColor: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    height: number,
    width: number,
    top: number,
    left: number,
    src: string,
    titleFontWeight: number | string,
    fontWeight: number | string,
    columnOne?:string,
    columnTwo?:string,
  ) {
    this.styles.backgroundColor = backgroundColor;
    this.text = text;
    this.boxShadow = boxShadow;
    this.styles.color = color;
    this.styles.boxRoundCorners = boxRoundCorners;
    this.styles.font = font;
    this.styles.fontSize = fontSize;
    this.styles.fontStyle = fontStyle;
    this.titleFont = titleFont;
    this.titleFontSize = titleFontSize;
    this.titleFontStyle = titleFontStyle;
    this.titleTextColor = titleTextColor;
    this.styles.height = height;
    this.styles.width = width;
    this.styles.top = top;
    this.styles.left = left;
    this.src = src;
    this.backgroundImage = null;
    this.titleFontWeight = titleFontWeight;
    this.styles.fontWeight = fontWeight;
    this.columnOne = columnOne;
    this.columnTwo = columnTwo;
  }
}
