import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { debounceTime, delay } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { getTimeStampSplitedFileName, updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { HeaderControl } from 'src/app/features/utility-configuration/mobile/models/controls/header.control';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';
import { Alignments } from '../../../../../../../../models/constants/font.constant';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'lavi-mobile-layout-page-header-property-control',
  templateUrl: 'mobile-layout-page-header-property.component.html',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileLayoutPageHeaderProperty extends AbstractComponent {
  @OnChange('OnIsControlSelectedPropertyChange')
  @Input() IsControlSelected: boolean;
  @Input() HeaderControl: HeaderControl;
  @Output() IsControlSelectedChange: EventEmitter<boolean> = new EventEmitter();

  @Output()
  OnSendUpdatedHeaderControlDetail: EventEmitter<HeaderControl> = new EventEmitter();
  FileName: string;
  Alignments = Alignments;

  constructor(private propertiesService: PropertiesService, private changeDetector: ChangeDetectorRef) {
    super();
  }

  Init() {
    this.UpdateFileName();
    this.subs.sink = this.HeaderControl.form.valueChanges
      .subscribe((x) => {
        updatePropertiesWithForm2(this.HeaderControl, this.HeaderControl.form);
        this.OnSendUpdatedHeaderControlDetail.emit(this.HeaderControl);
      });
  }

  private UpdateFileName() {
    if (
      this.HeaderControl.backgroundImage &&
      this.HeaderControl.backgroundImage.includes('://')
    ) {
      this.FileName = getTimeStampSplitedFileName(this.HeaderControl.backgroundImage
        .split('//')[1]
        .split('/')[2]);
      this.changeDetector.detectChanges();
    }
  }

  GetFileURL(event) {
    if (event.target.files && event.target.files[0]) {
      if (this.propertiesService.formService.IsValidImageFile(event.target.files[0])){
      const reader = new FileReader();
      reader.onload = (event1: any) => {
        this.UpdateFormGroupValues(event1, event);
      };
      reader.readAsDataURL(event.target.files[0]);
      this.FileName = event.target.files[0].name;
    }
  }

  }
  OnIsControlSelectedPropertyChange(){
    this.IsControlSelectedChange.emit(this.IsControlSelected);
  }
  private UpdateFormGroupValues(event1: any, event: any) {
    this.HeaderControl.form.patchValue({
      backgroundImage: event1.target.result,
      backgroundImageFile: event.target.files[0],
    });
  }

  ChangeColorPicker() {
    this.changeDetector.detectChanges();
  }

  Remove() {
    this.HeaderControl.form.patchValue({
      backgroundImage: '../../../../../../assets/img/qtracvr.png',
      backgroundImageFile: null,
    });
    this.FileName = '';
  }
}
