import { FormBuilder, Validators } from '@angular/forms';
import { ILanguageControl } from '../../../../../models/common/language-control.interface';
import { Control } from './control';

export class VideoControl extends Control {
  src: ILanguageControl[];
  videoFile: File;
  uniqueName: string;
  verticalPadding: string;
  horizontalPadding: string;
  selected: boolean;
  constructor(
    formBuilder: FormBuilder,
    name: string,
    src: ILanguageControl[],
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
      name,
      width,
      height,
      verticalPadding,
      horizontalPadding,
      roundCorners,
      left,
      top,
      zindex
    );
    this.InitializeProperties(
      width,
      height,
      name,
      verticalPadding,
      horizontalPadding,
      roundCorners,
      src,
      left,
      top,
      zindex
    );
  }
  private InitializeForm(
    formBuilder: FormBuilder,
    src: ILanguageControl[],
    name: string,
    width: number,
    height: number,
    verticalPadding: string,
    horizontalPadding: string,
    roundCorners: string,
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
        verticalPadding: [verticalPadding],
        horizontalPadding: [horizontalPadding],
        boxRoundCorners: [roundCorners],
        left: [left],
        top: [top],
        zindex: [zindex,{updateOn: 'change' }],
        videoFile: [this.videoFile],
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    width: number,
    height: number,
    name: string,
    verticalPadding: string,
    horizontalPadding: string,
    roundCorners: string,
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
    this.verticalPadding = verticalPadding;
    this.horizontalPadding = horizontalPadding;
    this.styles.boxRoundCorners = roundCorners;
    this.videoFile = null;
    this.uniqueName = 'Video Properties';
  }
}
