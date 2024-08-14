import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { WorkingDay } from 'src/app/features/appointment-scheduler/models/working-day';

@Component({
  selector: 'lavi-default-hours',
  templateUrl: './default-hours.component.html',
  styleUrls: ['./default-hours.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultHoursComponent extends AbstractComponent {
  @Input() workingHour: WorkingDay;

  get workingTime() {
    if (this.workingHour.availableTimeFrames.length > 0) {
      return (
        (this.workingHour.availableTimeFrames[0]?.fromTime?.hours / 10 == 0
          ? '0'
          : '') +
        this.workingHour.availableTimeFrames[0]?.fromTime?.hours +
        ':' +
        (this.workingHour.availableTimeFrames[0]?.fromTime?.minutes / 10 == 0
          ? '0'
          : '') +
        this.workingHour.availableTimeFrames[0]?.fromTime.minutes +
        '-' +
        (this.workingHour.availableTimeFrames[
          this.workingHour.availableTimeFrames.length - 1
        ]?.toTime?.hours /
          10 ==
        0
          ? '0'
          : '') +
        this.workingHour.availableTimeFrames[
          this.workingHour.availableTimeFrames.length - 1
        ]?.toTime?.hours +
        ':' +
        (this.workingHour.availableTimeFrames[
          this.workingHour.availableTimeFrames.length - 1
        ]?.toTime?.minutes /
          10 ==
        0
          ? '0'
          : '') +
        this.workingHour.availableTimeFrames[
          this.workingHour.availableTimeFrames.length - 1
        ]?.toTime?.minutes
      );
    } else {
      return '24 Hours';
    }
  }
}
