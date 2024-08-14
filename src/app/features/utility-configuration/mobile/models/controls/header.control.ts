import { Control } from './control';
import { FormBuilder } from '@angular/forms';

export class HeaderControl extends Control {
  backgroundImage: string;
  backgroundImageFile: File;
  isVisible: boolean;
  verticalPadding: string;
  horizontalPadding: string;
  logoPosition: string;
  height: string;
  constructor(
    formBuilder: FormBuilder,
    backgroundImage: string,
    isVisible: boolean,
    verticalPadding: string,
    horizontalPadding: string,
    logoPosition: string,
    height: string,
  ) {
    super();
    this.InitializeForm(formBuilder, backgroundImage, isVisible, verticalPadding, horizontalPadding, logoPosition,height);
    this.InitializeProperties(backgroundImage, isVisible, verticalPadding, horizontalPadding, logoPosition,height);
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    backgroundImage: string,
    isVisible: boolean,
    verticalPadding: string,
    horizontalPadding: string,
    logoPosition: string,
    height: string,
  ) {
    this.form = formBuilder.group(
      {
        backgroundImage,
        backgroundImageFile: [this.backgroundImageFile],
        isVisible,
        verticalPadding,
        horizontalPadding,
        height,
        logoPosition: [logoPosition, {updateOn: 'change'}],
      },
      { updateOn: 'change' }
    );
  }

  private InitializeProperties(backgroundImage: string, isVisible: boolean,
                               verticalPadding: string, horizontalPadding: string, logoPosition: string,height:string) {
    this.backgroundImage = backgroundImage;
    this.backgroundImageFile = null;
    this.isVisible = isVisible;
    this.verticalPadding = verticalPadding;
    this.horizontalPadding = horizontalPadding;
    this.logoPosition = logoPosition;
    this.height = height
  }
}
