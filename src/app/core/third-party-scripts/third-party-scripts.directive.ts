import { DOCUMENT } from '@angular/common';
import {
    Directive,
    Inject,
    OnInit,
    Renderer2
} from '@angular/core';
import { AppConfigService } from '../services/app-config.service';

@Directive({
  selector: 'lavi-scripts',
})
export class ThirdPartyScriptsDirective implements OnInit {
  constructor(
    private readonly appConfigService: AppConfigService,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) {}
  ngOnInit(): void {
    let script = this._renderer2.createElement('script');
    script.src = this.scriptSource;
    this._renderer2.appendChild(this._document.head, script);
  }
  get scriptSource(): string {
    return (
      'https://maps.googleapis.com/maps/api/js?key=' +
      this.appConfigService.config.GoogleApiKey +
      '&libraries=places&language=en'
    );
  }
}
