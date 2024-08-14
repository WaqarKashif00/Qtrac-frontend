import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';
import { IMiles } from '../../../models/selection-item.interface';
import { NearestBranchDisplayData } from '../../../models/nearest-branch-display-data.interface';
import { ITime } from 'src/app/features/scheduler/hours-of-operations/hours-of-operation.interface';
import { ILocation } from '../../../models/text-search.interface';
import { ICurrentLanguage } from '../../../models/current-language.interface';
import { AppointmentTextInterface } from '../../../models/appointment-text.interface';

@Component({
  selector: 'lavi-branch-map',
  templateUrl: './branch-map.component.html',
  styleUrls: [
    './branch-map.component.scss',
    './../../../scheduler-execution/scheduler-execution.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchMapComponent extends AbstractComponent {
  @Input() ActiveTextColor: string;
  @Input() InActiveTextColor: string;
  @Input() ActiveBackColor: string;
  @Input() InActiveBackColor: string;
  @Input() PrimaryTextColor: string;
  @Input() PrimaryBackColor: string;
  @Input() SecondaryTextColor: string;
  @Input() SecondaryBackColor: string;
  @Input() SelectedLanguage: ICurrentLanguage;
  @Input() headerText: string;
  @OnChange('UpdateMaPMarkers')
  @Input()
  NearestBranchList: NearestBranchDisplayData[];
  @Input() Miles: IMiles[];
  @Input() AppointmentTexts: AppointmentTextInterface;
  @Input() TranslatedDays: any;


  @Output() OnChangingMile: EventEmitter<number> = new EventEmitter<number>();
  @Output() OnSelectingBranch: EventEmitter<string> =
    new EventEmitter<string>();

  Markers = [];
  googleMapDefaultIcon = '../../../../../../assets/img/bullet-icon.png';

  zoom = 12;
  @Input() currentMapLocation: ILocation;

  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
  };

  GetConvertedTime(hours, min) {
    return this.ConvertTime12to24(
      this.GetTimeInString({
        hours,
        minutes: min
      })
    );
  }
  constructor() {
    super();
  }
  UpdateMaPMarkers(changes: SimpleChanges): void {
    this.Markers = [];
    this.NearestBranchList.forEach((x) => {
      this.Markers.push({
        position: {
          lat: x.branchLatitude,
          lng: x.branchLongitude,
        },
        label: {
          color: 'black',
          text: x.branchName,
        },
        title: x.branchName,
        options: { animation: google.maps.Animation.BOUNCE },
        branchId: x.branchId,
      });

    });
    this.Markers = [].concat(this.Markers);
  }

  OnSelectingTheMiles(miles) {
    this.OnChangingMile.emit(miles);
  }

  openInfo(data) {
    this.OnSelectingBranch.emit(data);
  }

  OnBranchSelectionChange(branchId) {
    this.currentMapLocation = {
      lat: this.NearestBranchList.find(x => x.branchId == branchId).branchLatitude,
      lng: this.NearestBranchList.find(x => x.branchId == branchId).branchLongitude,
    };
    this.OnSelectingBranch.emit(branchId);
  }
  // Need to make function centralize
  private GetTimeInString(timeFrame: ITime) {
    const format = timeFrame.hours >= 12 ? 'PM' : 'AM';
    return timeFrame.hours + ':' + timeFrame.minutes + ' ' + format;
  }

  public ConvertTime12to24(fromAndToTime) {
    const [time, modifier] = fromAndToTime.split(' ');
    let [hours, minutes] = time.split(':');

    minutes = minutes === '0' ? '00' : minutes;

    if (hours === '12') {
      return `${hours}:${minutes} ${modifier}`;
    }

    if (modifier === 'PM') {
      if (hours > 12) {
        hours = parseInt(hours, 10) - 12;
      } else {
        hours = parseInt(hours, 10) + 12;
      }
    }

    if (modifier === 'AM' && hours === '0') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes} ${modifier}`;
  }
}
