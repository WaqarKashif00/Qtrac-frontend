import { Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-station-banner',
  styleUrls: ['agent-lapse-time-banner.component.scss'],
  templateUrl: './agent-lapse-time-banner.component.html',
})
export class LapseTimeBannerComponent extends AbstractComponent {

  @Input() StartTime: string;
  @Input() BannerHeader: string;
  @Input() BannerColor: string;
  @Input() BannerFontFamily: string;
  @Input() BannerHeaderFontSize: string;
  @Input() BannerBodyFontSize: string;
  @Input() currentLanguage: string;
  @Input() translate: any;

  constructor() {
    super();


  }


}
