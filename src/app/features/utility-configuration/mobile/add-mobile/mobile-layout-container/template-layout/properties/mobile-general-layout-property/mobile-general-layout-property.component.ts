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
import { DesignerPanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/designer-panel.control';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'lavi-mobile-general-layout-properties',
  templateUrl: 'mobile-general-layout-property.component.html',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileGeneralLayoutPropertyComponent extends AbstractComponent {
  @Input() DesignerPanel: DesignerPanelControl;
  @Output()
  OnSendUpdatedDesignerPanelDetail: EventEmitter<DesignerPanelControl> = new EventEmitter();
  FileName: string;
  constructor(
    private propertiesService: PropertiesService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
  }
  Init() {
    this.subs.sink = this.DesignerPanel.form.valueChanges
      .pipe(debounceTime(300))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.DesignerPanel, this.DesignerPanel.form);
        this.OnSendUpdatedDesignerPanelDetail.emit(this.DesignerPanel);
        this.UpdateFileName();
      });
  }
  private UpdateFileName() {
    if (
      this.DesignerPanel.backgroundImage &&
      this.DesignerPanel.backgroundImage.includes('://')
    ) {
      this.FileName = getTimeStampSplitedFileName(this.DesignerPanel.backgroundImage
        .split('//')[1]
        .split('/')[2]);
      this.changeDetector.detectChanges();
    }
  }

  GetFileURL(event) {
    if (event.target.files && event.target.files[0]) {
      if (this.propertiesService.formService.IsValidImageFile(event.target.files[0])) {
        const reader = new FileReader();
        reader.onload = (event1: any) => {
          this.DesignerPanel.form.patchValue({
            backgroundImage: event1.target.result,
            backgroundImageFile: event.target.files[0],
          });
        };
        reader.readAsDataURL(event.target.files[0]);
        this.FileName = event.target.files[0].name;
      }
    }
  }


  Remove() {
    this.DesignerPanel.form.patchValue({
      backgroundImage: null,
      backgroundImageFile: null,
    });
    this.FileName = '';
  }
}
