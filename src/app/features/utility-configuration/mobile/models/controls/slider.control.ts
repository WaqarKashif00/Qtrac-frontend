import { FormBuilder, Validators } from '@angular/forms';
import { IMobileSliderControlPostPreview } from '../mobile-slider-control-preview.interface';
import { Control } from './control';

export class SliderControl extends Control {
  src: Array<IMobileSliderControlPostPreview>;
  urls: Array<IMobileSliderControlPostPreview>;
  uniqueName: string;
  verticalPadding: string;
  horizontalPadding: string;
  selected: boolean;
  constructor(
    formBuilder: FormBuilder,
    name: string,
    urls: Array<IMobileSliderControlPostPreview>,
    width: number,
    height: number,
    left: number,
    top: number,
    zindex: number,
    verticalPadding: string,
    horizontalPadding: string,
    boxCorner: string
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      urls,
      name,
      width,
      height,
      left,
      top,
      zindex,
      verticalPadding,
      horizontalPadding,
      boxCorner
    );
    this.InitializeProperties(
      width,
      height,
      name,
      urls,
      left,
      top,
      zindex,
      verticalPadding,
      horizontalPadding,
      boxCorner
    );
  }
  private InitializeForm(
    formBuilder: FormBuilder,
    urls: Array<IMobileSliderControlPostPreview>,
    name: string,
    width: number,
    height: number,
    left: number,
    top: number,
    zindex: number,
    verticalPadding: string,
    horizontalPadding: string,
    boxCorner: string
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
        verticalPadding: [verticalPadding],
        horizontalPadding: [horizontalPadding],
        boxCorner: [boxCorner],
      },
      { updateOn: 'blur' }
    );
  }

  private InitializeProperties(
    width: number,
    height: number,
    name: string,
    urls: Array<IMobileSliderControlPostPreview>,
    left: number,
    top: number,
    zindex: number,
    verticalPadding: string,
    horizontalPadding: string,
    boxCorner: string
  ) {
    this.styles.width = width;
    this.styles.height = height;
    this.styles.boxRoundCorners = boxCorner;
    this.verticalPadding = verticalPadding;
    this.horizontalPadding = horizontalPadding;
    this.name = name;
    this.urls = urls;
    this.styles.left = left;
    this.styles.top = top;
    this.styles.zindex = zindex;
    this.src = urls;
    this.uniqueName = 'Slider Properties';
  }
}
