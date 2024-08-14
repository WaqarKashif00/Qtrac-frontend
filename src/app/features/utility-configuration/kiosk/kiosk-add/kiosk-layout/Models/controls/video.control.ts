import { FormBuilder, Validators } from '@angular/forms';
import { ILanguageControl } from '../../../../../../../models/common/language-control.interface';
import { Control } from './control';

export class VideoControl extends Control {
  src: ILanguageControl[];
  imageFile: File;
  uniqueName: string;
  selected: boolean;
  constructor(
    formBuilder: FormBuilder,
    name: string,
    src: ILanguageControl[],
    width: number,
    height: number,
    left: number,
    top: number,
    zindex: number
  ) {
    super();
    this.InitializeForm(formBuilder, src, name, width, height, left, top, zindex);
    this.InitializeProperties(width, height, name, src, left, top, zindex);
  }
  private InitializeForm(
    formBuilder: FormBuilder,
    src: ILanguageControl[],
    name: string,
    width: number,
    height: number,
    left: number,
    top: number,
    zindex: number
  ) {
    this.form = formBuilder.group(
      {
        src: [src],
        name: [name, Validators.required],
        width: [width],
        height: [height],
        left: [left],
        top: [top],
        zindex: [zindex, {updateOn: 'change'}],
        imageFile: [this.imageFile],
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    width: number,
    height: number,
    name: string,
    src: ILanguageControl[],
    left: number,
    top: number,
    zindex: number
  ) {
    this.styles.width = width;
    this.styles.height = height;
    this.name = name;
    this.src = src;
    this.styles.left = left;
    this.styles.top = top;
    this.styles.zindex = zindex;
    this.imageFile = null;
    this.uniqueName = 'Video Properties';
  }
}
