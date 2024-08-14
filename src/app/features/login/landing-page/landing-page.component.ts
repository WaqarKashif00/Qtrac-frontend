import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { LandingPageService } from './landing-page.service';

@Component({
  selector: 'lavi-app-landing-page',
  template: '<router-outlet></router-outlet>',
  providers: [LandingPageService]
})

export class LandingPageComponent extends AbstractComponent {

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly landingPageService: LandingPageService,
  ) {
    super();
  }

  Init() {
    this.subs.sink = this.activatedRoute.queryParams.subscribe(async params => {
      this.landingPageService.HandleQueryParams(params);
    });
  }
}
