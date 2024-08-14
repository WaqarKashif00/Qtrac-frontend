import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { first } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-image-video-slider',
  templateUrl: './image-video-slider.component.html',
  styleUrls: ['./image-video-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageVideoSliderComponent
  extends AbstractComponent
  implements OnChanges {
  // Input properties
  // tslint:disable-next-line: no-input-rename
  @Input('AfterImageInterval') AfterImageInterval = 15000;
  // tslint:disable-next-line: no-input-rename
  @Input('Width') Width = 650;
  // tslint:disable-next-line: no-input-rename
  @Input('Height') Height = 350;
  // tslint:disable-next-line: no-input-rename
  @Input('Direction') Direction = Direction.RIGHT_TO_LEFT;
  // tslint:disable-next-line: no-input-rename
  @Input('IsFirstImageSlideNeeded') IsFirstImageSlideNeeded = false;
  // tslint:disable-next-line: no-input-rename
  @Input('AutoSlidingNeeded') AutoSlidingNeeded = true;
  // tslint:disable-next-line: no-input-rename
  @Input('ManualSliderNeeded') ManualSliderNeeded = false;
  // tslint:disable-next-line: no-input-rename
  @Input('Items') Items = [];
  // tslint:disable-next-line: no-input-rename
  @Input('ImageHeight') ImageHeight = 0;
  // tslint:disable-next-line: no-input-rename
  @Input('ImageWidth') ImageWidth = 0;
  // tslint:disable-next-line: no-input-rename
  @Input('BeforeImageInterval') BeforeImageInterval = 1;

  @ViewChildren('videoplayer') VideoPlayer: QueryList<ElementRef>;

  left = 0;
  SliderContentHeight = 0;
  SlidingIntervalObject: any;
  IsFirstIteration = true;
  VideoPlayerIndex: number;
  VideoItemIndexInArray: number;
  IsVideoControlEnabled = false;
  SlideItemsFromOnePlaceToAnotherTimeout;
  SlideFirstItemTimeout;
  VideoPlayTimeout;
  IsCurrentlyAnyVideoPlaying = false;
  IsSlidingRightNow = false;

  FnSetupDimensionWhenImageSlideNeeded: () => void;
  FnSetupDimensionWhenImageSlideNotNeeded: () => void;
  FnDimensionChangerOnSliding: () => void;
  FnFirstElementShifter: () => void;

  constructor(private cd: ChangeDetectorRef) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.SetElementDimensions();
  }

  Init() {
    this.setTimeout(() => {
      this.SetElementDimensions();
      this.SetupSliding();
    }, 0);
  }

  Destroy() {
    this.ClearAllTimers();
  }

  SetElementDimensions() {
    this.ImageHeight = this.Height;
    this.ImageWidth = this.Width;
    this.SliderContentHeight = this.Height;
  }

  SetupSliding() {
    if (this.AutoSlidingNeeded) {
      this.SetupAutoSliding();
    } else {
      this.SetupSliderForPureManualSliding();
    }
  }
  private SetupAutoSliding() {
    this.SetupLeftOrRightAutoSliding();
    this.SetupAndStartAutoSliderBasedOnIfFirstItemNeedSliding();
  }

  private SetupLeftOrRightAutoSliding() {
    if (this.Direction === Direction.RIGHT_TO_LEFT) {
      this.SetupRightToLeftSliding();
    } else {
      this.SetupLeftToRightSliding();
    }
  }

  private SetupLeftToRightSliding() {
    this.VideoPlayerIndex = this.VideoPlayer.toArray().length - 1;
    this.VideoItemIndexInArray = this.Items.length - 1;
    this.FnSetupDimensionWhenImageSlideNeeded = () => {
      this.left = this.Width * -1 * this.Items.length;
    };
    this.FnSetupDimensionWhenImageSlideNotNeeded = () => {
      this.left = this.Width * -1 * (this.Items.length - 1);
    };
    this.FnDimensionChangerOnSliding = () => {
      this.left = this.left + 1;
    };
    this.FnFirstElementShifter = () => {
      this.left = this.Width * -1 * (this.Items.length - 1);
      this.ShiftAllElementsToEndToCurrent();
    };
  }

  private SetupRightToLeftSliding() {
    this.VideoPlayerIndex = 0;
    this.VideoItemIndexInArray = 0;
    this.FnSetupDimensionWhenImageSlideNeeded = () => {
      this.left = this.Width;
    };
    this.FnSetupDimensionWhenImageSlideNotNeeded = () => {
      this.left = 0;
    };
    this.FnDimensionChangerOnSliding = () => {
      this.left = this.left - 1;
    };
    this.FnFirstElementShifter = () => {
      this.left = 0;
      this.ShiftAllElementsToBeginningToCurrent();
    };
  }

  private SetupAndStartAutoSliderBasedOnIfFirstItemNeedSliding() {
    if (this.IsFirstImageSlideNeeded) {
      this.SetupAndStartAutoSlidingConsideringFirstItemNeedSliding();
    } else {
      this.SetupAndStartAutoSlidingConsideringFirstItemDontNeedSliding();
    }
  }

  private SetupAndStartAutoSlidingConsideringFirstItemDontNeedSliding() {
    this.FnSetupDimensionWhenImageSlideNotNeeded();
    if (this.IsCurrentItemVideo()) {
      this.PlayCurrentVideo(() => {
        this.SlideItemsFromOnePlaceToAnother(false);
      });
    } else {
      this.SlideItemsFromOnePlaceToAnother(false);
    }
  }

  IsCurrentItemVideo() {
    return this.Items[this.VideoItemIndexInArray]?.type === 'video';
  }

  PlayCurrentVideo(afterPlay) {
    this.IsVideoControlEnabled = true;
    this.VideoPlayer.toArray()[this.VideoPlayerIndex].nativeElement.play();
    this.HandleVideoPlayerEvents(afterPlay);
  }

  private HandleVideoPlayerEvents(afterPlay: any) {
    fromEvent(
      this.VideoPlayer.toArray()[this.VideoPlayerIndex].nativeElement,
      'ended'
    )
      .pipe(first())
      .subscribe(() => {
        this.IsCurrentlyAnyVideoPlaying = false;
        afterPlay();
      });
  }

  private SetupAndStartAutoSlidingConsideringFirstItemNeedSliding() {
    this.FnSetupDimensionWhenImageSlideNeeded();
    this.SlideItemsFromOnePlaceToAnother(true);
  }

  private SlideItemsFromOnePlaceToAnother(IsFirstElement) {
    this.SlideItemsFromOnePlaceToAnotherWithInterval(
      IsFirstElement,
      this.AfterImageInterval
    );
  }

  private SlideItemsFromOnePlaceToAnotherWithInterval(
    IsFirstElement: boolean,
    interval: number,
    fnAfterSlide = null
  ) {
    this.ClearAllTimers();
    this.SlideItemsFromOnePlaceToAnotherTimeout = this.setTimeout(() => {
      this.IsVideoControlEnabled = false;
      this.SlideFirstItem(IsFirstElement, () => {
        if (fnAfterSlide != null) {
          fnAfterSlide();
        } else {
          this.SetupLeftOrRightAutoSliding();
          this.SlideItemsFromOnePlaceToAnother(false);
        }
      });
    }, interval);
  }

  private ClearAllTimers() {
    clearTimeout(this.SlideItemsFromOnePlaceToAnotherTimeout);
    clearTimeout(this.SlideFirstItemTimeout);
    clearTimeout(this.VideoPlayTimeout);
  }

  SlideFirstItem(IsFirstElement, afterSlide) {
   
    this.SlideFirstItemTimeout = this.setTimeout(() => {
      this.FnDimensionChangerOnSliding();
      let stringWidth: string = this.Width.toString();
      if(stringWidth.includes(',')){
        this.Width = parseFloat(stringWidth.replace(',', ''))
      }
      if (this.left % this.Width === 0) {
        if (!IsFirstElement) {
          this.FnFirstElementShifter();
        }
        this.VideoPlayTimeout = this.setTimeout(() => {
          if (this.IsCurrentItemVideo()) {
            this.PlayCurrentVideo(() => {
              afterSlide();
            });
          } else {
            afterSlide();
          }
        });
      } else {
        this.SlideFirstItem(IsFirstElement, afterSlide);
      }
    }, this.BeforeImageInterval);
  }

  private SetupSliderForPureManualSliding() {
    this.SetupSlidederForPureLeftToRightManualSliding();
  }

  private SetupSlidederForPureLeftToRightManualSliding() {
    this.Direction = Direction.LEFT_TO_RIGHT;
    this.SetupLeftToRightSliding();
    this.SetupManualSlidingConsideringFirstItemDontNeedSliding();
  }

  private SetupManualSlidingConsideringFirstItemDontNeedSliding() {
    this.FnSetupDimensionWhenImageSlideNotNeeded();
  }

  private SetupSlidederForPureRightToLeftManualSliding() {
    this.Direction = Direction.RIGHT_TO_LEFT;
    this.SetupRightToLeftSliding();
    this.SetupManualSlidingConsideringFirstItemDontNeedSliding();
  }

  OnVideoPause() {
    this.IsCurrentlyAnyVideoPlaying = false;
    this.IsSlidingRightNow = false;
  }

  OnVideoPlaying() {
    this.IsCurrentlyAnyVideoPlaying = true;
  }

  ManuallyScrollFromLeftToRight() {
    if (!this.IsSlidingRightNow) {
      this.IsSlidingRightNow = true;
      let fn = null;
      if (!this.AutoSlidingNeeded) {
        fn = () => {
          this.IsSlidingRightNow = false;
        };
      }
      if (this.Direction === Direction.RIGHT_TO_LEFT) {
        // Means current element right now in beginning, make it to end
        this.ShiftAllElementsToBeginningToCurrent();
      }
      this.SetupSlidederForPureLeftToRightManualSliding();
      this.SlideItemsFromOnePlaceToAnotherWithInterval(false, 0, fn);
    }
  }

  ShiftAllElementsToBeginningToCurrent() {
    const c = this.Items.shift();
    if (c) {
      this.Items.push(c);
    }
  }

  MakeCurrentItemInArrayLastItem() {
    this.ShiftAllElementsToEndToCurrent();
  }

  ManuallyScrollFromRightToLeft() {
    if (!this.IsSlidingRightNow) {
      this.IsSlidingRightNow = true;
      let fn = null;
      if (!this.AutoSlidingNeeded) {
        fn = () => {
          this.IsSlidingRightNow = false;
        };
      }
      if (this.Direction === Direction.LEFT_TO_RIGHT) {
        // Means current element right now in end, make it to beginning
        this.ShiftAllElementsToEndToCurrent();
      }

      this.SetupSlidederForPureRightToLeftManualSliding();
      this.SlideItemsFromOnePlaceToAnotherWithInterval(false, 0, fn);
    }
  }

  ShiftAllElementsToEndToCurrent() {
    const c = this.Items.pop();
    if (c) {
      this.Items.unshift(c);
    }
  }

  setTimeout(fn, interval = undefined) {
    return setTimeout(() => {
      fn();
      this.cd.detectChanges();
    }, interval);
  }
}

export enum Direction {
  LEFT_TO_RIGHT = 'Left to Right',
  // It indicates always last item is displayed and left is set to the longest value
  RIGHT_TO_LEFT = 'Right to Left',
  // It indicates always first item is displayed and left is set to 0
}
