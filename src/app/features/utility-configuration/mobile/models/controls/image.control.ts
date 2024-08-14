import { FormBuilder, Validators } from '@angular/forms';
import { ILanguageControl } from '../../../../../models/common/language-control.interface';
import { Control } from './control';

export class ImageControl extends Control {
  src: ILanguageControl[];
  hyperLink: string;
  imageFile: File;
  uniqueName: string;
  verticalPadding: string;
  horizontalPadding: string;
  selected: boolean;
  constructor(
    formBuilder: FormBuilder,
    name: string,
    src:  ILanguageControl[],
    hyperLink: string,
    width: number,
    verticalPadding: string,
    horizontalPadding: string,
    roundCorners: string,
    height: number,
    left: number,
    top: number,
    zindex: number
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      src,
      hyperLink,
      name,
      width,
      verticalPadding,
      horizontalPadding,
      roundCorners,
      height,
      left,
      top,
      zindex
    );
    this.InitializeProperties(
      width,
      height,
      verticalPadding,
      horizontalPadding,
      roundCorners,
      name,
      src,
      hyperLink,
      left,
      top,
      zindex
    );
  }
  private InitializeForm(
    formBuilder: FormBuilder,
    src:  ILanguageControl[],
    hyperLink: string,
    name: string,
    width: number,
    verticalPadding: string,
    horizontalPadding: string,
    roundCorners: string,
    height: number,
    left: number,
    top: number,
    zindex: number
  ) {
    this.form = formBuilder.group(
      {
        src: [src],
        hyperLink: [hyperLink, { updateOn: 'change' } ],
        name: [name, Validators.required],
        width: [width],
        height: [height],
        left: [left],
        verticalPadding:[verticalPadding],
        horizontalPadding:[horizontalPadding],
        boxRoundCorners:[roundCorners],
        top: [top],
        zindex: [zindex, { updateOn: 'change' } ],
        imageFile: [this.imageFile],
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    width: number,
    height: number,
    verticalPadding: string,
    horizontalPadding: string,
    roundCorners: string,
    name: string,
    src:  ILanguageControl[],
    hyperLink: string,
    left: number,
    top: number,
    zindex: number
  ) {
    this.styles.width = width;
    this.styles.height = height;
    this.name = name;
    this.verticalPadding = verticalPadding;
    this.horizontalPadding = horizontalPadding;
    this.styles.boxRoundCorners = roundCorners;
    this.src = src;
    this.hyperLink = hyperLink;
    this.styles.left = left;
    this.styles.top = top;
    this.styles.zindex = zindex;
    this.imageFile = null;
    this.uniqueName = 'Image Properties';
  }
}
