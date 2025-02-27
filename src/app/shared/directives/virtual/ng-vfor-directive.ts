import {
  Directive, DoCheck, EmbeddedViewRef, Input, IterableChangeRecord,
  OnInit, OnChanges, SimpleChanges, IterableChanges, IterableDiffer, IterableDiffers,
  TemplateRef, TrackByFunction, ElementRef, ViewContainerRef, isDevMode, EventEmitter,
  Output, AfterContentInit, OnDestroy, SkipSelf, Optional, ChangeDetectorRef
} from '@angular/core';
import {
  NgForOfContext
} from '@angular/common';

import { NgGUDItemsControlComponent} from '../../components/ng-guditems-control/ng-guditems-control.component';

export type NgGUDIterable<T> = Array<T> | Iterable<T>;

class ViewPort {

  constructor(topPosition = 0, start = 0, end = 0) {
    this.topPosition = topPosition;
    this.start = start;
    this.end = end;
  }

  topPosition = 0;
  start = 0;
  end = 0;
}

export class NgVForNeedsUpdateArgs {
  constructor(private _length) {
  }

  public get length(): number {
    return this._length;
  }
}

export class NgVForRenderUpdatedArgs extends ViewPort {

}

class ViewPortDimensions {
  containerHeight = -1;
  standardItemHeight = -1;
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngVFor]'
})
export class NgVForDirective<T> implements OnChanges, OnDestroy, OnInit, DoCheck, AfterContentInit {

  constructor(
    private _elRef: ElementRef,
    private _viewContainer: ViewContainerRef,
    private _template: TemplateRef<NgForOfContext<T>>,
    private _differs: IterableDiffers,
    private _changeDector: ChangeDetectorRef,
    @Optional() @SkipSelf() private _viewPortContainer: NgGUDItemsControlComponent
  ) { }

  private parentType: string;
  // tslint:disable-next-line:no-inferrable-types
  private _topPosition: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  private _dirty: boolean = true;
  private _iterable: NgGUDIterable<T>;
  private _differ: IterableDiffer<T> | null = null;
  private _viewPortDimensions: ViewPortDimensions = null;
  private _lastViewPort: ViewPort = null;
  // tslint:disable-next-line:no-inferrable-types
  private _length: number = 0;
  private _newViewPort: ViewPort = null;
  private _cachedViews: EmbeddedViewRef<NgForOfContext<T>>[] = [];
  private _trackByFn !: TrackByFunction<T>;
  private _noContainer = false;
  private _waitingViewPortChanged = false;


  // region Properties

  public content: HTMLElement;

  public get length(): number {
    return this._length;
  }

  get topPosition(): number {
    return this._topPosition;
  }
  set topPosition(value: number) {
    if (this._topPosition !== value) {
      this._topPosition = value;
      this.setTopPosition(value);
    }
  }

  public SetViewPortDimensions(containerHeight: number, standardItemHeight: number) {
    this._viewPortDimensions =  { containerHeight: containerHeight, standardItemHeight: standardItemHeight };
  }

  // endregion Properties

  // region angular properties

  @Input()
  set ngForTemplate(value: TemplateRef<NgForOfContext<T>>) {
    if (value) {
      this._template = value;
    }
  }

  @Input()
  set ngVForOf(value: NgGUDIterable<T>) {
    this._iterable = value;
    this._dirty = true;
    this.clearViewPort();
  }

  @Input()
  items: any;

  @Input()
  lockPositionOnUpdate = false;

  @Input()
  public cachedViewsBufferSize = 0;

  @Input()
  set ngForTrackBy(fn: TrackByFunction<T>) {
    if (isDevMode() && fn != null && typeof fn !== 'function') {
      if (<any>console && <any>console.warn) {
        console.warn(
            `trackBy must be a function, but received ${JSON.stringify(fn)}. ` +
            `See https://angular.io/docs/ts/latest/api/common/index/NgFor-directive.html#!#change-propagation for more information.`);
      }
    }
    this._trackByFn = fn;
  }
  get ngForTrackBy(): TrackByFunction<T> { return this._trackByFn; }

  @Output() update: EventEmitter<NgVForNeedsUpdateArgs> = new EventEmitter<NgVForNeedsUpdateArgs>();

  @Output() gotdimensions: EventEmitter<NgVForNeedsUpdateArgs> = new EventEmitter<NgVForNeedsUpdateArgs>();

  @Output() viewPortUpdated: EventEmitter<NgVForRenderUpdatedArgs> = new EventEmitter<NgVForRenderUpdatedArgs>();

  // endregion angular properties

  // region Angular hooks

  ngOnInit() {
    this.content = this._elRef.nativeElement.parentElement;
    this.parentType = this._elRef.nativeElement.parentElement.localName;
    if (this.parentType === 'table') {
      this._elRef.nativeElement.parentElement.style.position = 'absolute';
    } else {
      this.content.style.position = 'absolute';
    }
    if (this._viewPortContainer !== null && this._viewPortContainer !== undefined) {
      this._viewPortContainer.attach(this);
    } else {
      this._noContainer = true;
      this.ngDoCheck();
    }
  }

  ngAfterContentInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnDestroy() {
    for (let loop = 0; loop < this._cachedViews.length; loop++) {
      this._cachedViews[loop].destroy();
    }
    this._cachedViews = [];
    this.update.complete();
    this.gotdimensions.complete();
  }

  ngDoCheck(): void {
    this._waitingViewPortChanged = false;
    if (this._dirty) {
      this._dirty = false;
      if (!this._differ && this._iterable) {
        try {
          this._differ = this._differs.find(this._iterable).create(this.ngForTrackBy);
        } catch (e) {

        }
      }

      if (this._differ) {
        const changes = this._differ.diff(this._iterable);
        if (changes) { this.applyChanges(changes); }
      }
    }
    if (this._newViewPort !== null && this._newViewPort !== undefined) {
      if (this._noContainer === false) {
        const nvp = this._newViewPort;
        this._newViewPort = null;
        this.renderViewPort(nvp.topPosition, nvp.start, nvp.end);
      }
    }
  }

  // endregion Angular hooks

  // region changes

  private applyChanges(changes: IterableChanges<T>) {
    // if we are at the start of the render pass, we dont know the height of anything, so render out just the first item
    let vp: ViewPort = null;
    let changed = false;
    let containerNeedsDimensions = false;

    if (this._viewPortDimensions === null) {
      vp = new ViewPort(0, 0, 0);
      containerNeedsDimensions = true;
    } else {
      vp = this._lastViewPort;
    }
    this._lastViewPort = vp;
    const vpstart = vp ? vp.start : 0;
    const vpend = vp ? vp.end : 0;

    changes.forEachOperation(
      (item: IterableChangeRecord<any>, adjustedPreviousIndex: number, currentIndex: number) => {
        if (item.previousIndex == null) {
          changed = true;
          // insert
          this._length++;
          if (this._noContainer === true || (currentIndex >= vpstart && currentIndex <= vpend)) {
            let view = this.getNewView();
            if (view) {
              this._viewContainer.insert(view, currentIndex - vpstart);
              view.context.$implicit = item.item;
            } else {
              view = this._viewContainer.createEmbeddedView(
              this._template, new NgForOfContext<T>(item.item, this._iterable, -1, -1), currentIndex - vpstart);
            }
          }
        } else if (currentIndex == null) {
          changed = true;
          // remove
          this._length--;
          if (this._noContainer === true || (adjustedPreviousIndex >= vpstart && adjustedPreviousIndex <= vpend)) {
            if(this._viewContainer && this._viewContainer.length > adjustedPreviousIndex - vpstart) {
              this.cacheView(this._viewContainer.detach(adjustedPreviousIndex - vpstart) as EmbeddedViewRef<NgForOfContext<T>>);
            }
          }
        } else {
          changed = true;
          // move
          const view = this._viewContainer.get(adjustedPreviousIndex);
          if (view !== null && view !== undefined) {
            if (this._noContainer === true || (currentIndex >= vpstart && currentIndex <= vpend &&
              adjustedPreviousIndex >= vpstart && adjustedPreviousIndex <= vpend)) {
              this._viewContainer.move(view, currentIndex - vpstart);
            } else {
              if (adjustedPreviousIndex >= vpstart && adjustedPreviousIndex <= vpend && this._viewContainer && this._viewContainer.length > adjustedPreviousIndex - vpstart) {
                this.cacheView(this._viewContainer.detach(adjustedPreviousIndex - vpstart) as EmbeddedViewRef<NgForOfContext<T>>);
              }
            }
          }
        }
      });

    for (let i = 0, ilen = this._viewContainer.length; i < ilen; i++) {
      const viewRef = <EmbeddedViewRef<NgForOfContext<T>>>this._viewContainer.get(i);
      if (viewRef !== null && viewRef !== undefined) {
        viewRef.context.index = i + vpstart;
        viewRef.context.count = this._length;
        viewRef.context.ngForOf = this._iterable;
      }
    }

    changes.forEachIdentityChange((record: any) => {
      if (this._noContainer === true || (record.currentIndex >= vpstart && record.currentIndex <= vpend)) {
        const viewRef =
          <EmbeddedViewRef<NgForOfContext<T>>>this._viewContainer.get(record.currentIndex - vpstart);
        if (viewRef !== null && viewRef !== undefined) {
          viewRef.context.$implicit = record.item;
        }
      }
    });

    // If the length has shortened the viewport then we need to take that into account
    if (this.length < vpend && vp) {
      vp.end = this.length;
      vp.start = Math.min(vp.start, this.length);
      this._lastViewPort = vp;
    }

    // emit a somethings changed event

    this._length = this.getIterableLength();
    this.update.emit(new NgVForNeedsUpdateArgs(this.length));

    if(changed && containerNeedsDimensions && this._length > 0) {
      let x = 0;
      setTimeout(() => this.gotdimensions.emit(new NgVForNeedsUpdateArgs(this.length)),20);
    }

  }

  getIterableLength(): number {
    let ret = 0;

    if(Array.isArray(this._iterable)) {
      ret = (this._iterable as Array<T>).length;
    } else {
      for(const item of this._iterable) {
        ret++;
      }
    }

    return ret;
  }

  // endregion changes

  public setTargetViewPort(topPosition: number, start: number, end: number) {
    this._newViewPort = new ViewPort(topPosition, start, end);
    if(!this._waitingViewPortChanged) {
      this._waitingViewPortChanged = true;
      setTimeout(() => this._changeDector.detectChanges(), 20);
    }
  }

  // region Implementation

  setTopPosition(height: number) {
    if (this.parentType === 'table') {
      this.content.parentElement.style.top = `${height}px`;
    } else {
      this.content.style.top = `${height}px`;
    }
  }

  private getCachedViewsBufferSize(): number {
    let ret = 0;

    if (this.cachedViewsBufferSize) {
      ret = this.cachedViewsBufferSize;
    } else {
      if (this._lastViewPort) {
        ret = (this._lastViewPort.end - this._lastViewPort.start) + 1;
      }
    }

    return ret;
  }

  private cacheView(view: EmbeddedViewRef<NgForOfContext<T>>) {
    if (view == null) { return; }
    if (this.getCachedViewsBufferSize() >= this._cachedViews.length) {
      this._cachedViews.push(view);
      if (view.context !== null && view.context !== undefined) {
        view.context.$implicit = null;
      }
    } else {
      view.destroy();
    }
  }

  private getNewView(): EmbeddedViewRef<NgForOfContext<T>> {
    let ret: EmbeddedViewRef<NgForOfContext<T>> = null;

    if (this._cachedViews.length > 0) {
      ret = this._cachedViews.pop();
    }

    return ret;
  }

  private clearViewPort() {
    const toRemove = this._viewContainer.length;
    this._length = 0;
    for (let loop = 0; loop < toRemove; loop++) {
      this.cacheView(this._viewContainer.detach(0) as EmbeddedViewRef<NgForOfContext<T>>);
    }
    this._lastViewPort = null;
  }

  private renderViewPort(topPosition: number, start: number, end: number) {
    this.topPosition = topPosition;
    const vp = new ViewPort(topPosition, Math.min(start, this.length), Math.min(end, this.length));
    const lastViewPort = this._lastViewPort;
    this._lastViewPort = vp;
    const lastViewPortstart = lastViewPort ? lastViewPort.start : 0;
    const lastViewPortend = lastViewPort ? lastViewPort.end : 0;
    const lastViewPortExtent = lastViewPort ? lastViewPort.end - lastViewPort.start + 1 : 0;
    const vpExtent = vp.end - vp.start + 1;
    const frontAdd = Math.min(vpExtent, lastViewPortstart - vp.start);
    const frontRemove = Math.min(vp.start - lastViewPortstart, lastViewPortExtent);
    const backRemove = Math.min(lastViewPortExtent, lastViewPortend - vp.end);
    const backAdd = Math.min(vpExtent, vp.end - lastViewPortend);
    const skip = Math.max(0, Math.min(lastViewPortend + 1, vp.end + 1) - Math.max(lastViewPortstart, vp.start));
    console.log("VP " + vp.start + " - " + vp.end + " frontAdd:" + frontAdd + " frontRemove:" + frontRemove + " backAdd:" + backAdd + " backRemove:" + backRemove);

    if (frontAdd || frontRemove || backRemove || backAdd) {
      // Remove all the items at the end that are now out of viewport scope (backremove>0)...
      if (backRemove > 0) {
        for (let loop = lastViewPortExtent; loop > lastViewPortExtent - backRemove; loop--) {
          if(this._viewContainer.length > loop) {
            this.cacheView(this._viewContainer.detach(loop) as EmbeddedViewRef<NgForOfContext<T>>);
          }
        }
      }
      // Now remove all the front items that are now out of viewport scope (frontRemove>0)...
      if (frontRemove > 0) {
        for (let loop = 0; loop < frontRemove; loop++) {
          if(this._viewContainer.length > 0) {
            this.cacheView(this._viewContainer.detach(0) as EmbeddedViewRef<NgForOfContext<T>>);
          }
        }
      }

      // Ok, so now we need to seek to the start point of the new viewport
      let it = null;
      let eof = false;
      if (!Array.isArray(this._iterable)) {
        // have to do a manual loop based seek..
        it = this._iterable[Symbol.iterator];
        if (it !== null && it !== undefined && it.seekTo !== undefined) {
          (<any>it).seekTo(vp.start);
        }
        let item: any;
        for (let loop = 0; loop < vp.start; loop++) {
          item = it.next();
          if (item.done) {
            eof = true;
            break;
          }
        }
      }

      let indexPoint = 0;

      // Do we need to insert items in the front ?
      if (frontAdd > 0 && !eof) {
        indexPoint += frontAdd;
        for (let loop = 0; loop < frontAdd; loop++) {
          let item: any;
          if (it === null) {
            if (this._iterable['length'] <= vp.start + loop) {
              eof = true;
              break;
            }
            item = this._iterable[vp.start + loop];
          } else {
            const e = it.next();
            if (e.done) {
              eof = true;
              break;
            } else {
              item = e.value;
            }
          }
          if (!eof && item !== null && item !== undefined) {
            let view = this.getNewView();
            if (view) {
              this._viewContainer.insert(view, loop);
              view.context.$implicit = item;
            } else {
              view = this._viewContainer.createEmbeddedView(
                  this._template, new NgForOfContext<T>(item, this._iterable, -1, -1), loop);
            }
          }
        }
      }

      // now skip the items we already have rendered
      indexPoint += skip;
      if (!eof && skip > 0 && it !== null) {
        for (let loop = 0; loop < skip; loop++) {
          const e = it.next();
          if (e.done) {
            eof = true;
            break;
          }
        }
      }

      // Do we have items to add at the back ?
      if (!eof && backAdd > 0) {
        for (let loop = 0; loop < backAdd; loop++) {
          let item: any;
          if (it !== null) {
            const e = it.next();
            if (e.done) {
              eof = true;
              break;
            }
            item = e.value;
          } else {
            item = this._iterable[vp.start + indexPoint + loop];
          }
          if (!eof && item !== null && item !== undefined) {
            let view = this.getNewView();
            if (view) {
              this._viewContainer.insert(view);
              view.context.$implicit = item;
            } else {
              view = this._viewContainer.createEmbeddedView(
                this._template, new NgForOfContext<T>(item, this._iterable, -1, -1));
            }
          }
        }
      }

      for (let i = 0, ilen = this._viewContainer.length; i < ilen; i++) {
        const viewRef = <EmbeddedViewRef<NgForOfContext<T>>>this._viewContainer.get(i);
        if (viewRef !== null && viewRef !== undefined) {
          viewRef.context.index = i + vp.start;
          viewRef.context.count = this._length;
          viewRef.context.ngForOf = this._iterable;
        }
      }
    }

    this.viewPortUpdated.emit(new NgVForRenderUpdatedArgs(vp.topPosition, vp.start, vp.end));
  }

  // end region Implementation

}
