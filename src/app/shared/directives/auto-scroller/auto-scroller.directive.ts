import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
* Autoscroller attribute directive
*/
@Directive({
  selector: '[Autoscroller]'
})
export class AutoscrollerDirective {

  constructor(private el: ElementRef) { }

  /**
   *
   * action: string, default 'TopWait, ScrollBottom, BottomWait, SnapTop'
   *
   * The action sequence to be followed, as a comma seperated list of the following:
   *
   * TopWait - Wait at the top for $topWait$ ms
   * ScrollBottom - Scroll to the bottom at $scrollSpeed$ pixels per second
   * BottomWait - Wait at the bottom for $BottomWait$ ms minus the animation time from the previous scroll
   * so it keeps multiple scrollers in sync
   * SnapTop - Snaps back to the top of the list
   * ScrollTop - Scrolls to the top at $scrollSpeed$ pixels per second
   */
  @Input('Autoscrolleractions') action = 'TopWait, ScrollBottom, BottomWait, SnapTop' ;

  /**
   * topWait: number, default 10000ms (10 seconds)
   *
   * Number of ms to wait at the top before moving on to the next action in the sequence
   */
  @Input('AutoscrollertopWait') topWait = 10000;

  /**
   * bottomWait: number, default 10000ms (10 seconds)
   *
   * Number of ms to wait at the bottom before moving on to the next action in the sequence
   */
  @Input('AutoscrollerbottomWait') bottomWait = 10000;

  /**
   * scrollSpeed: number, default 100 pixels per second
   *
   * Speed of the scroll, expressed in pixels per second
   */
  @Input('AutoscrollerscrollSpeed') scrollSpeed = 100;

  // Parsed list of actions
  private _actions: string[] = [];
  // The current entry index in the list that is being processed
  private _currentEntry = 0;
  // This is used by the animation frame render to work out how many units we move an item
  private _oldTimeStamp = 0;
  // This is used by the animation frame render to work out how many units are in the move
  private _pixels = 0;
  // This is the dynamic animate duration, again for the frame render
  private _AnimateDuration = 0;
  // This is how many pixels we have moved so far in this render
  private _animatePixels = 0;
  // This is the animation frame render id
  private _AFID = 0;
  // This is the over time rebase, so that displays stay in sync
  private _AnimationTime = 0;
  // Used by everything that is TimeOut or Animation frame callback based to shut down
  private _isLoaded = true;
  private _startAnimate = 0;

  ngAfterContentInit() {
    this.processNextAction();
  }

  ngOnDestroy() {
    this._isLoaded = false;
  }

  private processNextAction() {

    // if the element is no longer loaded, then quit out of the timer loops
    if (!this.isLoaded()) { return; }

    const nextAction = this.nextEntry();
    let waitTime = 0;


    switch (nextAction.toLowerCase().trim()) {
      case 'topwait':
        waitTime = this.executeTopWait();
        break;
      case 'scrollbottom':
        waitTime = this.executeScrollBottom();
        break;
      case 'scrolltop':
        waitTime = this.executeScrollTop();
        break;
      case 'bottomwait':
        waitTime = this.executeBottomWait();
        break;
      case 'snaptop':
        waitTime = this.executeSnapTop();
        break;
      case 'snapbottom':
        waitTime = this.executeSnapBottom();
        break;
    }

    if (this.isLoaded() && waitTime >= 0) {
      setTimeout(() => this.processNextAction(), waitTime);
    }
  }

  private isLoaded(): boolean {
    return this._isLoaded;
  }

  private parseActions() {
    if (this.action !== null) {
      this._actions = this.action.split(',');
      this._currentEntry = 0;
    }
  }

  private executeTopWait(): number {
    return this.topWait;
  }

  private executeBottomWait(): number {

    let ret = this.bottomWait - this._AnimationTime;
    this._AnimationTime = 0;

    while (ret < 0) {
      ret += this.bottomWait + this.topWait;
    }


    return ret;
  }

  private executeSnapTop(): number {
    if (!this.hasElement()) { return 0; }

    this.el.nativeElement.children[0].scrollTop = 0;
    return  0;
  }

  private executeSnapBottom(): number {
    if (!this.hasElement()) { return 0; }

    const snapPoint = this.getScrollExtent() - this.getWindowSize();
    this.el.nativeElement.children[0].scrollTop = snapPoint;
    return 0;
  }

  private hasElement(): boolean {
    let ret = false;
    if (this.el && this.el.nativeElement && this.el.nativeElement.children.length > 0 && this._isLoaded) { ret = true; }

    return ret;
  }

  private executeScrollTop(): number {
    if (!this.hasElement()) { return 0; }

    const pixels = this.el.nativeElement.scrolltop;

    // animate the scroll
    this._oldTimeStamp = window.performance.now();
    this._pixels = -pixels; this._animatePixels = 0;
    this._AnimateDuration = this.computeDuration(pixels);

    this._startAnimate = window.performance.now();

    this._AFID = requestAnimationFrame((ts) => this.Render(ts));

    return -1;
  }

  private executeScrollBottom(): number {
    if (!this.hasElement()) { return 0; }

    const pixels = this.getScrollExtent() - this.getWindowSize();

    this._oldTimeStamp = window.performance.now();
    this._pixels = pixels; this._animatePixels = 0;
    this._AnimateDuration = this.computeDuration(pixels);

    this._startAnimate = window.performance.now();

    if (pixels > 0) {
      this._AFID = requestAnimationFrame((ts) => this.Render(ts));
    } else {
      return 0;
    }

    return -1;
  }

  private Render(nts: number) {
    let stillRender = true;
    const newTimeStamp = window.performance.now();

    if (!this.hasElement()) {
      stillRender = false;
    } else {

      const diff = Math.abs(newTimeStamp - this._oldTimeStamp);

      if (diff > 0) {
        const frame = this._AnimateDuration / diff;
        if (frame) {
          const step = Math.round(this._pixels / frame);
          if (step > 0) {
            this.el.nativeElement.children[0].scrollTop += step;
            this._animatePixels += step;
            this._oldTimeStamp = newTimeStamp;
          }

          if (Math.abs(this._animatePixels) >= Math.abs(this._pixels)) { stillRender = false; }
        }
      }
    }

    if (!stillRender || !this._isLoaded) {
      cancelAnimationFrame(this._AFID);
      this._AFID = 0;
      this._AnimationTime = window.performance.now() - this._startAnimate;

      this.processNextAction();
    } else {
      this._AFID = requestAnimationFrame((ts) => this.Render(ts));
    }
  }

  private computeDuration(pixels: number) {
    if (this.scrollSpeed !== 0) {
      return pixels / this.scrollSpeed * 1000;
    } else {
      return 0;
    }
  }

  private nextEntry(): string {
    let ret = '';
    if (this._actions.length === 0) {
      this.parseActions();
    }

    if (this._currentEntry >= this._actions.length) {
      this._currentEntry = 0;
    }

    if (this._currentEntry < this._actions.length) {
      ret = this._actions[this._currentEntry];
      this._currentEntry++;
    }

    return ret;
  }

  private getScrollExtent(): number {
    let ret = 0;

    if (this.hasElement()) {
      ret = this.el.nativeElement.children[0].scrollHeight;
    }

    return ret;
  }

  private getWindowSize(): number {
    let ret = 0;

    if (this.hasElement()) {
      ret = this.el.nativeElement.clientHeight;
    }

    return ret;
  }
}
