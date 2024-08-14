import { FormBuilder } from '@angular/forms';
import { Control } from './control';

export class Announcement extends Control {
  color: string;
  backColor: string;
  text: object;
  showAnnouncement: boolean;
  constructor(
    formBuilder,
    color,
    backColor,
    text,
    showAnnouncement
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      color,
      backColor,
      text,
      showAnnouncement
    );
    this.InitializeVariable(
      color,
      backColor,
      text,
      showAnnouncement
    );
  }
  private InitializeVariable(
    color: string,
    backColor: string,
    text: any,
    showAnnouncement: boolean
  ) {
    this.color = color;
    this.backColor = backColor;
    this.text = text;
    this.showAnnouncement = showAnnouncement;
  }
  private InitializeForm(
    formBuilder: FormBuilder,
    color: string,
    backColor: string,
    text: any,
    showAnnouncement: boolean
  ) {
    this.form = formBuilder.group(
      {
        color: [color],
        backColor: [backColor],
        text: [text],
        showAnnouncement: [showAnnouncement]
      },
      { updateOn: 'blur' }
    );
  }
}
