import { Control } from './control';
import { FormBuilder } from '@angular/forms';

export class PageProperties extends Control {
  uniqueName: string;
  hideWelcomePage: boolean;
  hideThankYouPage: boolean;
  constructor(
    formBuilder: FormBuilder,
    hideWelcomePage: boolean,
    hideThankYouPage: boolean
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      hideWelcomePage,
      hideThankYouPage
    );
    this.InitializeProperties(
      hideWelcomePage,
      hideThankYouPage
    );
  }

  private InitializeForm(
    formBuilder: FormBuilder,
    hideWelcomePage: boolean,
    hideThankYouPage: boolean
  ) {
    this.form = formBuilder.group({
      hideWelcomePage,
      hideThankYouPage
    });
  }

  private InitializeProperties(
    hideWelcomePage: boolean,
    hideThankYouPage: boolean
  ) {
    this.hideWelcomePage = hideWelcomePage;
    this.hideThankYouPage = hideThankYouPage;
    this.uniqueName = 'Page Properties';
  }
}
