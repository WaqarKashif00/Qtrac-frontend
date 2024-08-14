import { Directive, ElementRef, Input, OnChanges, SimpleChanges, Renderer2, HostListener } from '@angular/core';

@Directive ({
  selector: '[lavi-video-loader]'
})


export class VideoLoaderDirective {
constructor(
  private el: ElementRef,
  private renderer: Renderer2
) { }


@HostListener('loadstart', ['$event.target'])
VideoLoader(){
  let video = this.el.nativeElement;
  video.classList.add('preloader');
    function checkLoad() {
        if (video.readyState === 4) {
            video.classList.remove('preloader')
        } else {
            setTimeout(checkLoad, 100);
        }
    }
    checkLoad();
  }
}
