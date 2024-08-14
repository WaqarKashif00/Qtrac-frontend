import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { debounceTime } from 'rxjs/operators';
import { getTimeStampSplitedFileName, updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { DesignerPanelControl } from '../../../models/controls/designer-panel.control';
import { SnapGridSizes } from 'src/app/models/constants/snap-grid-sizes';
import { HomeInterfaceTemplateService } from '../../home-interface-template.service';

@Component({
  selector: 'lavi-home-interface-layout-control-property',
  templateUrl: './home-interface-layout-control-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeInterfaceLayoutControlPropertyComponent extends AbstractComponent {
  @Input() DesignerPanel: DesignerPanelControl;

  url: string;
  FileName: string;
  LayoutName: string;
  Sizes: number[] = SnapGridSizes;

  constructor(private templateService: HomeInterfaceTemplateService,
              private changeDetector: ChangeDetectorRef) {
    super();
  }
  Init() {
    this.subs.sink = this.DesignerPanel.form.valueChanges
      .pipe(debounceTime(300))
      .subscribe((x) => {
        this.DesignerPanel.showGrid = this.DesignerPanel.form.controls.showGrid.value;
        updatePropertiesWithForm2(this.DesignerPanel, this.DesignerPanel.form);
        this.templateService.ChangeDesignerPanel(this.DesignerPanel);
        this.UpdateBackgroundImgFileName();
        this.UpdateFileName();
      });
  }

  private UpdateFileName() {
    if (this.DesignerPanel.backgroundImage && this.DesignerPanel.backgroundImage.includes('://')) {
      this.FileName = getTimeStampSplitedFileName(this.DesignerPanel.backgroundImage.split('//')[1].split('/')[2]);
      this.changeDetector.detectChanges();
    }
  }

  UpdateBackgroundImgFileName() {
    if (
      this.DesignerPanel.backgroundImage &&
      this.DesignerPanel.backgroundImage.includes('://')
    ) {
      this.FileName = getTimeStampSplitedFileName(this.DesignerPanel.backgroundImage
        .split('//')[1]
        .split('/')[2]);
    }
  }

  GetFileURL(event) {
    if (event.target.files && event.target.files[0]) {
      if (
        this.templateService.formService.IsValidImageFile(event.target.files[0])
      ) {
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
