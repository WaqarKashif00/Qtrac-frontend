import { Control } from './control';
import { FormBuilder } from '@angular/forms';
import { ILanguageControl } from '../../../../../models/common/language-control.interface';

export class FooterControl extends Control {
  footerImageFile: File;
  footerImage: string;
  footerLogoFile: File;
  footerLogo: string; // we are not using dynamic footer logo from now.
  text: object;
  isVisible: boolean; // we are not using dynamic footer logo from now.
  isTextVisible: boolean;
  isFooterImageVisible: boolean;
  isLogoVisible: boolean;  // we are not using dynamic footer logo from now.
  constructor(
    formBuilder: FormBuilder,
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    footerImage: string,
    text: object,
    isVisible: boolean,
    isTextVisible: boolean,
    isFooterImageVisible: boolean,
    isLogoVisible: boolean,
    footerLogo: string,
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      color,
      fontSize,
      font,
      fontStyle,
      fontWeight,
      footerImage,
      text,
      isVisible,
      isTextVisible,
      isFooterImageVisible,
      isLogoVisible,
      footerLogo,
    );
    this.InitializeProperties(
      color,
      fontSize,
      font,
      fontStyle,
      fontWeight,
      footerImage,
      text,
      isVisible,
      isTextVisible,
      isFooterImageVisible,
      isLogoVisible,
      footerLogo,
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    footerImage: string,
    text: object,
    isVisible: boolean,
    isTextVisible: boolean,
    isFooterImageVisible: boolean,
    isLogoVisible: boolean,
    footerLogo: string,
  ) {
    this.form = formBuilder.group({
      color,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      footerImage,
      footerImageFile: [this.footerImageFile],
      text,
      isVisible,
      isTextVisible,
      isFooterImageVisible,
      isLogoVisible,
      footerLogo
    });
  }

  private InitializeProperties(
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    footerImage: string,
    text: object,
    isVisible: boolean,
    isTextVisible: boolean,
    isFooterImageVisible: boolean,
    isLogoVisible: boolean,
    footerLogo: string,
  ) {
    this.styles.fontWeight = fontWeight;
    this.styles.fontSize = fontSize;
    this.styles.font = font;
    this.styles.fontStyle = fontStyle;
    this.styles.color = color;
    this.footerImage = footerImage;
    this.text = text;
    this.isVisible = isVisible;
    this.isTextVisible = isTextVisible;
    this.isFooterImageVisible = isFooterImageVisible;
    this.isLogoVisible = isLogoVisible;
    this.footerLogo = footerLogo;
  }
}
