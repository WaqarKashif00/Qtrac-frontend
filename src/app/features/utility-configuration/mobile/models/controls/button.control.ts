import { FormBuilder } from '@angular/forms';
import { ILanguageControl } from '../../../../../models/common/language-control.interface';
import { Control } from './control';

export class ButtonControl extends Control {
  text: object;
  uniqueName: string;
  verticalPadding: string;
  horizontalPadding: string;
  showPropertyWindow: boolean;
  isPrimaryButtonSelected: boolean;
  secondaryButtonText: object;
  showPrimaryButtonIcon: boolean;
  showSecondaryButtonIcon: boolean;
  primaryButtonSrc: ILanguageControl[];
  secondaryButtonSrc: ILanguageControl[];
  dropdownText: string;
  border: string;
  borderColor: string;
  shadow: boolean;
  constructor(
    formBuilder: FormBuilder,
    name: string,
    text: object,
    color: string,
    backgroundColor: string,
    verticalPadding: string,
    horizontalPadding: string,
    roundCorners: string,
    height: number,
    width: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    top: number,
    isPrimaryButtonSelected: boolean,
    showPrimaryButtonIcon: boolean,
    showSecondaryButtonIcon: boolean,
    primaryButtonSrc: ILanguageControl[],
    secondaryButtonSrc: ILanguageControl[],
    secondaryButtonText: object,
    border: string,
    borderColor: string,
    shadow: boolean,
    dropdownText?: string,
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      name,
      text,
      color,
      backgroundColor,
      verticalPadding,
      horizontalPadding,
      roundCorners,
      height,
      width,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      top,
      isPrimaryButtonSelected,
      showPrimaryButtonIcon,
      showSecondaryButtonIcon,
      primaryButtonSrc,
      secondaryButtonSrc,
      secondaryButtonText,
      border,
      borderColor,
      shadow
    );
    this.InitializeProperties(
      name,
      text,
      height,
      width,
      color,
      backgroundColor,
      verticalPadding,
      horizontalPadding,
      roundCorners,
      fontSize,
      font,
      fontStyle,
      fontWeight,
      top,
      isPrimaryButtonSelected,
      showPrimaryButtonIcon,
      showSecondaryButtonIcon,
      primaryButtonSrc,
      secondaryButtonSrc,
      secondaryButtonText,
      border,
      borderColor,
      shadow,
      dropdownText,
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    name: string,
    text: object,
    color: string,
    backgroundColor: string,
    verticalPadding: string,
    horizontalPadding: string,
    boxRoundCorners: string,
    height: number,
    width: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    top: number,
    isPrimaryButtonSelected: boolean,
    showPrimaryButtonIcon: boolean,
    showSecondaryButtonIcon: boolean,
    primaryButtonSrc: ILanguageControl[],
    secondaryButtonSrc: ILanguageControl[],
    secondaryButtonText: object,
    border: string,
    borderColor: string,
    shadow: boolean
  ) {
    this.form = formBuilder.group(
      {
        name: [name],
        text,
        color,
        backgroundColor,
        verticalPadding,
        horizontalPadding,
        boxRoundCorners,
        height,
        width,
        font,
        fontStyle,
        fontSize,
        fontWeight,
        top,
        isPrimaryButtonSelected,
        showPrimaryButtonIcon: [showPrimaryButtonIcon, { updateOn: 'change' }],
        showSecondaryButtonIcon: [showSecondaryButtonIcon, { updateOn: 'change' }],
        primaryButtonSrc: [primaryButtonSrc],
        secondaryButtonSrc: [secondaryButtonSrc],
        secondaryButtonText,
        border,
        borderColor,
        shadow
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    name: string,
    text: object,
    height: number,
    width: number,
    color: string,
    backgroundColor: string,
    verticalPadding: string,
    horizontalPadding: string,
    roundCorners: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    top: number,
    isPrimaryButtonSelected: boolean,
    showPrimaryButtonIcon: boolean,
    showSecondaryButtonIcon: boolean,
    primaryButtonSrc: ILanguageControl[],
    secondaryButtonSrc: ILanguageControl[],
    secondaryButtonText: object,
    border: string,
    borderColor: string,
    shadow: boolean,
    dropdownText?: string
  ) {
    this.name = name;
    this.text = text;
    this.styles.top = top;
    this.styles.left = 0;
    this.styles.height = height;
    this.styles.width = width;
    this.verticalPadding = verticalPadding;
    this.horizontalPadding = horizontalPadding;
    this.styles.backgroundColor = backgroundColor;
    this.styles.boxRoundCorners = roundCorners;
    this.styles.color = color;
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.styles.fontStyle = fontStyle;
    this.styles.fontWeight = fontWeight;
    this.uniqueName = 'Button Properties';
    this.isPrimaryButtonSelected = isPrimaryButtonSelected;
    this.showPrimaryButtonIcon = showPrimaryButtonIcon;
    this.showSecondaryButtonIcon = showSecondaryButtonIcon;
    this.primaryButtonSrc = primaryButtonSrc;
    this.secondaryButtonSrc = secondaryButtonSrc;
    this.secondaryButtonText = secondaryButtonText;
    this.dropdownText = dropdownText;
    this.border = border;
    this.borderColor = borderColor;
    this.shadow = shadow;
  }
}

