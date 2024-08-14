import { FormBuilder } from '@angular/forms';
import { Control } from './control';

export class PageProperties extends Control {
  uniqueName: string;
  hideWelcomePage: boolean;
  constructor(
    formBuilder: FormBuilder,
    hideWelcomePage: boolean
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      hideWelcomePage
    );
    this.InitializeProperties(
      hideWelcomePage
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    hideWelcomePage: boolean,
  ) {
    this.form = formBuilder.group({
      hideWelcomePage,
    });
  }

  private InitializeProperties(
    hideWelcomePage: boolean,
  ) {
    this.hideWelcomePage = hideWelcomePage;
    this.uniqueName = 'Page Properties';
  }
}
