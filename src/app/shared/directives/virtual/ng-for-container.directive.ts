import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  HostListener,
  ContentChild,
  AfterContentInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { ThemeService } from '@progress/kendo-angular-charts';
import { Subject, Subscription, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
// import { RightPanelComponent } from 'src/app/features/snapshot/right-panel/right-panel.component';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngVForContainer]'
})
export class NgVForContainerDirective implements OnInit, AfterContentInit, AfterViewInit,  OnDestroy {

  @Input() scrollbarWidth: number;
  @Input() scrollbarHeight: number;
  @Input() customSize: Function = null;
  @ContentChild('totalHeight') totalHeight: ElementRef;

  scroll$: Subject<Event> = new Subject<Event>();
  scrollHeight: number;
  logger = "";

  private previousStart: number;
  private previousEnd: number;
  private counter = 5;
  private dimensions: any;
  private vrItems = null;

  @HostListener('scroll')
  onScroll(e: Event) {
    this.scroll$.next();
  }

  constructor(private elRef: ElementRef /*, private _channelService: NgGUDVForChannelService */) {
  }

  ngOnInit() {
      this.scroll$.pipe(switchMap(() => {
          this.refresh();
          return of();
      })).subscribe(() => { });
      this.scrollbarWidth = 0;
      this.scrollbarHeight = 0;

  }

  ngOnDestroy() {
      this.vrItems = null;
      this.scroll$.complete();
  }

  directAttach(target) {
      this.vrItems = target;
  }

  ngAfterContentInit() {
      if (this.vrItems !== null && this.vrItems !== undefined) {
          this.attachUpdate(this.vrItems);
      }
  }

  ngAfterViewInit() {
  }

  @Input()
  public get scrollTop(): number {
      let ret = 0;
      const el = this.elRef.nativeElement;

      if (el) {
          ret = el.scrollTop;
      }

      return ret;
  }
  public set scrollTop(newScrollTop: number) {
      const el = this.elRef.nativeElement;

      if (el) {
          el.scrollTop = newScrollTop;
          this.refresh();
      }
  }

  public attachUpdate(element) {
      if (this.vrItems === null || this.vrItems === undefined) {
          this.vrItems = element;
      }
      setTimeout(() => {
        // Wire in the update event
        element.update.subscribe((u) => {
            this.previousStart = this.previousEnd = undefined;
            this.refresh();
        });
        if (element.length > 0) {
            this.refresh();
        }
      },20);

  }

  private gotDimensions() {
    console.log("Running gotDimensions");
    this.previousStart = this.previousEnd = undefined;
    if(this.calculateDimensions()) {
      this.calculateItems(true, this.counter);
      if(this.vrItems && this.dimensions) {
        this.vrItems.SetViewPortDimensions(this.dimensions.viewHeight, this.dimensions.childHeight);
      }
    } else {
      setTimeout(() => this.gotDimensions(), 20);
    }

  }

  private refresh() {
      if(!this.calculateDimensions()) {
        setTimeout(() => this.refresh(), 20);
      }
      if(this.vrItems && this.dimensions) {
        this.vrItems.SetViewPortDimensions(this.dimensions.viewHeight, this.dimensions.childHeight);
      }
      this.calculateItems(true, this.counter);
  }

  private countItemsPerRow() {
      return 1;
  }

  protected getCustomSizeAdjustments(startIndex: number, extentLength: number, totalLength: number) {
      let adjustments = { adjustmentBefore: 0, beforeCount: 0, adjustmentStart: 0, startCount: 0, adjustmentAfter: 0, afterCount: 0 };

      if (this.customSize !== null && this.customSize !== undefined) {
          adjustments = this.customSize(startIndex, extentLength, totalLength);
      }

      return adjustments;
  }

  private calculateDimensions(): boolean {
    let ret = false;

    if(this.dimensions) {
      return true;
    }

      if (!this.vrItems || (this.vrItems && !this.vrItems.length)) { return false; }
      const container = this.vrItems.content;
      const viewWidth = this.elRef.nativeElement.clientWidth - this.scrollbarWidth;
      const viewHeight = this.elRef.nativeElement.clientHeight - this.scrollbarHeight;

      const contentDimensions = container.children[0] ?
          {
              width: container.children[0].offsetWidth,
              height: container.children[0].offsetHeight
          } :
          {
              width: viewWidth,
              height: viewHeight
          };
      let index = 0;
      if (this.previousStart >= 0) {
          index = this.previousStart;
      }
      let childWidth = contentDimensions.width;
      let childHeight = contentDimensions.height;

      const itemsPerRow = Math.max(1, this.countItemsPerRow());
      const itemsPerCol = Math.max(1, Math.floor(viewHeight / childHeight));
      if(childHeight > 0) {

        this.dimensions = {
            viewWidth: viewWidth,
            viewHeight: viewHeight,
            childWidth: childWidth,
            childHeight: childHeight,
            itemsPerRow: itemsPerRow,
            itemsPerCol: itemsPerCol,
        };

        ret = true;
      }

      return ret;
  }

  private calculateItems(newItems: boolean, retry: number) {
      if (!this.dimensions) {
          return;
      } else if (!this.dimensions.childHeight && retry > 0) { // first item didn't render in time
        console.log(`Retrying rendering items, retries remaining: ${retry - 1}`);
      } else {
          const visited = new Object();
          const el = this.elRef.nativeElement;
          const itemsLength = this.vrItems.getIterableLength();
          const d = this.dimensions;
          let needsAdjustment = false;

          // Phase 1 - Lets set the scrollHeight
          // Get the total scope of the adjustments to the default height..
          let adjustments = this.getCustomSizeAdjustments(0, itemsLength - 1, itemsLength);
          if (adjustments.adjustmentBefore !== 0 || adjustments.adjustmentAfter !== 0) {
              needsAdjustment = true;
          }
          this.scrollHeight = (d.childHeight * itemsLength / d.itemsPerRow) + adjustments.adjustmentBefore + adjustments.adjustmentAfter;
          this.totalHeight.nativeElement.style.height = `${this.scrollHeight}px`;
          if (this.elRef.nativeElement.scrollTop > this.scrollHeight) {
              this.elRef.nativeElement.scrollTop = this.scrollHeight;
          }

          // Phase 2 - now lets work out the start and end indexes
          let indexSeekDone = false;
          let scrollTop = el.scrollTop;
          let end = -1;
          let start = -1;
          adjustments = { adjustmentBefore: 0, beforeCount: 0, adjustmentStart: 0, startCount: 0, adjustmentAfter: 0, afterCount: 0 };

          while (!indexSeekDone) {
              // const indexByScrollTop = Math.max(0, scrollTop) / this.scrollHeight * itemsLength / d.itemsPerRow;
              const indexByScrollTop = scrollTop / d.childHeight;
              end = Math.min(itemsLength, Math.ceil(indexByScrollTop) * d.itemsPerRow + d.itemsPerRow * (d.itemsPerCol + 1));

              let maxStartEnd = end;
              const modEnd = end % d.itemsPerRow;
              if (modEnd) {
                  maxStartEnd = end + d.itemsPerRow - modEnd;
              }
              const maxStart = Math.max(0, maxStartEnd - d.itemsPerCol * d.itemsPerRow - d.itemsPerRow);
              start = Math.min(maxStart, Math.floor(indexByScrollTop) * d.itemsPerRow);

              start = !isNaN(start) ? start : -1;
              end = !isNaN(end) ? end : -1;


              if (!needsAdjustment) {
                  // There are no adjustments required
                  indexSeekDone = true;
              } else {
                  if (visited['' + start] !== undefined) {
                      indexSeekDone = true;
                  } else {
                      visited['' + start] = start;
                  }
                  const newAdjustments = this.getCustomSizeAdjustments(start, end - start, itemsLength);
                  newAdjustments.adjustmentBefore -= newAdjustments.beforeCount * d.childHeight;
                  newAdjustments.adjustmentStart -= newAdjustments.startCount * d.childHeight;
                  newAdjustments.adjustmentAfter -= newAdjustments.afterCount * d.childHeight;
                  const diff = newAdjustments.adjustmentBefore - adjustments.adjustmentBefore;

                  if (newAdjustments.adjustmentBefore === 0 || indexSeekDone) {
                      indexSeekDone = true;
                  } else {
                      // We need to do an adjustment, so adjust the scrollTop and go again..
                      scrollTop -= diff;
                  }
                  adjustments = newAdjustments;
              }
          }

          // Phase 3 - start and end adjusted, now do the gets

          if (start !== this.previousStart || end !== this.previousEnd || newItems) {
              this.previousStart = start;
              this.previousEnd = end;

              // update the scroll position
              const topPosition = Math.max(0, d.childHeight * Math.ceil(start / d.itemsPerRow) + adjustments.adjustmentBefore);

              // update the scroll list
              setTimeout(() => {
                //console.log("ViewPort: " + topPosition + " : " + start + " - " + end);
                this.vrItems.setTargetViewPort(topPosition, start, end);
              }, 20);
          }

      }
  }
}
