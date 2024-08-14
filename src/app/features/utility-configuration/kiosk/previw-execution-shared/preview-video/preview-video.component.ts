import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { UrlType } from 'src/app/models/constants/url-type';
import { Validations } from 'src/app/models/constants/validation.constant';
import { GetYoutubeEmbedURL } from 'src/app/shared/components/video/video.util';
import { IKioskVideosControlData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';

@Component({
  selector: 'lavi-preview-video',
  templateUrl: './preview-video.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewVideoComponent extends AbstractComponent {
  @Input() Videos: Array<IKioskVideosControlData>;
  @Input() SelectedLanguage: string;


  ValidationPatterns = Validations;
  UrlType: UrlType = {youtube:false,other:false};
  constructor(private sanitizer: DomSanitizer) {
    super();
  }


  GetUrl(src){
    const url = typeof(src) !== 'string' ? src.find(x => x.languageCode === this.SelectedLanguage)?.url : [];
    if(!url){
      this.UrlType.youtube = false;
      this.UrlType.other = false;
      return url;
    }
    const match = url.match(this.ValidationPatterns.YoutubeRegX);
    if(match && match[2].length === 11){
      this.UrlType.youtube = true;
      this.UrlType.other = false;
    }
    else
    {
      this.UrlType.youtube = false;
      this.UrlType.other = true;
      return url;
    }
    const videoId = match[2];
    const latestUrl = GetYoutubeEmbedURL(videoId);
    const sanitizeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(latestUrl);
    return sanitizeUrl;
  }

}
