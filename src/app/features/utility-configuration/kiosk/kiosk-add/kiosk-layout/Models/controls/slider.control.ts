import { FormBuilder, Validators } from '@angular/forms';
import { ISliderControlPostPreview } from '../slider-control-preview.interface';
import { Control } from './control';

export class SliderControl extends Control {
  src: Array<ISliderControlPostPreview>;
  urls: Array<ISliderControlPostPreview>;
  uniqueName: string;
  selected: boolean;
  constructor(
    formBuilder: FormBuilder,
    name: string,
    urls: Array<ISliderControlPostPreview>,
    width: number,
    height: number,
    left: number,
    top: number,
    zindex: number,
  ) {
    super();
    this.InitializeForm(formBuilder, urls, name, width, height, left, top, zindex);
    this.InitializeProperties(width, height, name, urls, left, top, zindex);
  }
  private InitializeForm(
    formBuilder: FormBuilder,
    urls: Array<ISliderControlPostPreview>,
    name: string,
    width: number,
    height: number,
    left: number,
    top: number,
    zindex: number
  ) {
    this.form = formBuilder.group(
      {
        src: [urls],
        name: [name, Validators.required],
        width: [width],
        height: [height],
        left: [left],
        top: [top],
        zindex: [zindex, {updateOn: 'change'}],
        urls: [urls],
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    width: number,
    height: number,
    name: string,
    urls: Array<ISliderControlPostPreview>,
    left: number,
    top: number,
    zindex: number
  ) {
    this.styles.width = width;
    this.styles.height = height;
    this.name = name;
    this.urls = urls;
    this.styles.left = left;
    this.styles.top = top;
    this.styles.zindex = zindex;
    this.src = urls;
    this.uniqueName = 'Slider Properties';
  }
}
