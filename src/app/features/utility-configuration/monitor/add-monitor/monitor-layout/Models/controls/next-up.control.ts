import { Control } from './control';
import { FormArray, FormBuilder } from '@angular/forms';

export class NextUpControl extends Control {
  text: object;
  visibleServices: string;
  serviceArrangement: string;
  boxShadow: boolean;
  titleFont: string;
  titleFontSize: number;
  titleFontStyle: string;
  titleFontWeight: number | string;
  titleTextColor: string;
  src: string;
  backgroundImage: File;
  displayNoOfCustomers: number;
  columnOne: string;
  columnTwo: string;
  
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
    fontWeight: number | string,
    titleFontWeight: number | string,
    displayNoOfCustomers: number,
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
      fontWeight,
      titleFontWeight,
      displayNoOfCustomers,
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
      fontWeight,
      titleFontWeight,
      displayNoOfCustomers,
      columnOne,
      columnTwo,

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
    fontWeight: number | string,
    titleFontWeight: number | string,
    displayNoOfCustomers: number,
    columnOne:string,
    columnTwo:string,

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
        fontWeight,
        titleFontWeight,
        displayNoOfCustomers,
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
    fontWeight: number | string,
    titleFontWeight: number | string,
    displayNoOfCustomers: number,
    columnOne:string,
    columnTwo:string,

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
    this.styles.fontWeight = fontWeight;
    this.src = src;
    this.backgroundImage = null;
    this.titleFontWeight = titleFontWeight;
    this.displayNoOfCustomers = displayNoOfCustomers;
    this.columnOne = columnOne;
    this.columnTwo = columnTwo;

  }
}
