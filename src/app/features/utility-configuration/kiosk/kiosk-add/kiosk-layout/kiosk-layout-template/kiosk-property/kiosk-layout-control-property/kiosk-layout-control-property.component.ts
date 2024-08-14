import {
  ChangeDetectionStrategy,
  ChangeDetectorRef, Component,
  Input
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { getTimeStampSplitedFileName, updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { SnapGridSizes } from 'src/app/models/constants/snap-grid-sizes';
import { KioskTemplateService } from '../../kiosk-template.service';

@Component({
  selector: 'lavi-kiosk-layout-control-property',
  templateUrl: './kiosk-layout-control-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskLayoutControlPropertyComponent extends AbstractComponent {
  @Input() DesignerPanel;

  FileName: string;
  LayoutName: string;
  Sizes: number[] = SnapGridSizes;

  constructor(
    private kioskPropertyService: KioskTemplateService,
    private changeDetector: ChangeDetectorRef,
  ) {
    super();
  }

  Init() {
    this.subs.sink = this.DesignerPanel.form.valueChanges
      .pipe()
      .subscribe((x) => {
        updatePropertiesWithForm2(this.DesignerPanel, this.DesignerPanel.form);
        this.DesignerPanel.showGrid = this.DesignerPanel.form.controls.showGrid.value;
        this.kioskPropertyService.ChangeDesignerPanel(this.DesignerPanel);
        this.UpdateFileName();
      });
  }

  private UpdateFileName() {
    if (this.DesignerPanel.backgroundImage && this.DesignerPanel.backgroundImage.includes('://')) {
      this.FileName = getTimeStampSplitedFileName(this.DesignerPanel.backgroundImage.split('//')[1].split('/')[2]);
      this.changeDetector.detectChanges();
    }
  }

  GetFileURL(event) {
    if (event.target.files && event.target.files[0]) {
      if (this.kioskPropertyService.formService.IsValidImageFile(event.target.files[0])) {
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

  ChangeColorPicker() {
    this.changeDetector.detectChanges();
  }

  Remove() {
    this.DesignerPanel.form.patchValue({
      backgroundImage: null,
      backgroundImageFile: null,
    });
    this.FileName = '';
  }

  RemoveLayoutName() {
    this.LayoutName = '';
  }

}
