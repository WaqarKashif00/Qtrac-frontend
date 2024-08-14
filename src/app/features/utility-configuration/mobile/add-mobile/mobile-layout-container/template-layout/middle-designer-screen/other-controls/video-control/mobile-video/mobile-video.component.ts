import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UrlType } from 'src/app/models/constants/url-type';
import { Validations } from 'src/app/models/constants/validation.constant';
import { GetYoutubeEmbedURL } from 'src/app/shared/components/video/video.util';

@Component({
  selector: 'lavi-mobile-video',
  templateUrl: './mobile-video.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaviMobileVideoComponent implements OnChanges{

  @Input() Src: string;
  @Input() Width: number;
  @Input() Height: number;
  @Input() zindex: number;
  @Input() BoxCorners: number;
  @Input() ShowRemoveOption = true;

  @Output() Remove: EventEmitter<void> = new EventEmitter();

  ValidationPatterns = Validations;
  UrlType: UrlType = {youtube:false,other:false};
  constructor(private elRef: ElementRef,private sanitizer: DomSanitizer) {}


  GetUrl(src){
    if(!src){
      this.UrlType.youtube = false;
      this.UrlType.other = false;
      return src;
    }
    const match = src.match(this.ValidationPatterns.YoutubeRegX);
    if(match && match[2].length === 11){
      this.UrlType.youtube = true;
      this.UrlType.other = false;
    }
    else
    {
      this.UrlType.youtube = false;
      this.UrlType.other = true;
      return src;
    }
    const videoId = match[2];
    const latestUrl = GetYoutubeEmbedURL(videoId);
    const sanitizeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(latestUrl);
    return sanitizeUrl;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.Src) {
      const player = this.elRef.nativeElement.querySelector('video');
      if (player) {
      player.load();
      }
    }
  }

  RemoveControl(){
    this.Remove.emit();
  }
}
