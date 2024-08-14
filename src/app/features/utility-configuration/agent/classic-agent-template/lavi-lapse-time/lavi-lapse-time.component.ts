import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';

export interface IEntry {
  created: Date;
  id: string;
}

export interface ITimeSpan {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'lavi-lapse-time',
  templateUrl: './lavi-lapse-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaviLapseTimeComponent extends AbstractComponent {
  @Input() TimeString: string;
  @Input() CustomStyle: any;
  @Input() TimeZone: string;
  @Input() ShowSeconds: boolean;
  Time: Date;

  private destroyed$ = new Subject();

  get CustomStyleGet(): any {
    if (this.CustomStyle) {
      return this.CustomStyle;
    } else {
      return {
        fontSize: '15px',
        fontWeight: 'bold',
      };
    }
  }

  constructor(private changeDetector: ChangeDetectorRef) {
    super();
    this.ShowSeconds = false;
    this.Time = new Date();
  }

  Init() {
    this.Time = new Date(this.TimeString);
    this.subs.sink = interval(1000)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        if (!this.changeDetector['destroyed']) {
          this.changeDetector.detectChanges();
        }
      });
    this.changeDetector.detectChanges();
  }

  Destroy() {
    super.Destroy();
    this.destroyed$.next();
    this.destroyed$.complete();
    if (this.subs.sink) {
      this.subs.sink.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }


  GetElapsedTime(entry: Date): ITimeSpan {
    let totalSeconds = Math.floor(
      (new Date().getTime() - entry.getTime()) / 1000
    );

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let days = 0;

    if (totalSeconds >= 3600) {
      hours = Math.floor(totalSeconds / 3600);
      totalSeconds -= 3600 * hours;
    }

    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      totalSeconds -= 60 * minutes;
    }
    if (hours >= 24) {
      days = Math.floor(hours / 24);
      hours -= days * 24;
    }
    seconds = totalSeconds;

    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }
}
