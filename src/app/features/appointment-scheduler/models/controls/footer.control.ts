import { FormBuilder } from '@angular/forms';
import { Control } from './control';

export class FooterProperties extends Control {
  color: string;
  backColor: string;
  text: object;
  constructor(
    formBuilder,
    color,
    backColor,
    text,
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      color,
      backColor,
      text,
    );
    this.InitializeVariable(
      color,
      backColor,
      text,
    );
  }
  private InitializeVariable(
    color: string,
    backColor: string,
    text: any,
  ) {
    this.color = color;
    this.backColor = backColor;
    this.text = text;
  }
  private InitializeForm(
    formBuilder: FormBuilder,
    color: string,
    backColor: string,
    text: any,
  ) {
    this.form = formBuilder.group(
      {
        color: [color],
        backColor: [backColor],
        text: [text],
      },
      { updateOn: 'blur' }
    );
  }
}
