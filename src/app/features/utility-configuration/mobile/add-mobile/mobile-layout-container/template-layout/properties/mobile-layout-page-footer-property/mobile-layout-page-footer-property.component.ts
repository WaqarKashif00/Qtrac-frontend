import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { getTimeStampSplitedFileName, updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { FooterControl } from 'src/app/features/utility-configuration/mobile/models/controls/footer.control';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'lavi-mobile-layout-page-footer-property-control',
  templateUrl: 'mobile-layout-page-footer-property.component.html',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileLayoutPageFooterProperty extends AbstractComponent {
  @OnChange('OnIsControlSelectedPropertyChange')
  @Input()
  IsControlSelected: boolean;
  @Input() FooterControl: FooterControl;
  @Output() IsControlSelectedChange: EventEmitter<boolean> = new EventEmitter();
  @Output() OnSendUpdatedFooterControlDetail: EventEmitter<FooterControl> =
    new EventEmitter();

  FooterTextFormArray$: Observable<FormArray>;
  FileName = '';
  LogoFileName = '';
  OpenModal = false;

  constructor(
    private propertiesService: PropertiesService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
    this.FooterTextFormArray$ = this.propertiesService.FooterTextFormArray$;
  }

  Init() {
    this.UpdateFileName();
    this.subs.sink = this.FooterControl.form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.FooterControl, this.FooterControl.form);
        this.OnSendUpdatedFooterControlDetail.emit(this.FooterControl);
      });
  }

  private UpdateFileName() {
    if (
      this.FooterControl.footerImage &&
      this.FooterControl.footerImage.includes('://')
    ) {
      this.FileName = getTimeStampSplitedFileName(
        this.FooterControl.footerImage.split('//')[1].split('/')[2]
      );
    }
    if(this.FooterControl.footerLogo && this.FooterControl.footerLogo.includes('://')){
      this.LogoFileName = getTimeStampSplitedFileName(
        this.FooterControl.footerLogo.split('//')[1].split('/')[2]
      );
    }
    this.changeDetector.detectChanges();
  }

  GetFileURL(event) {
    if (event.target.files && event.target.files[0]) {
      if (
        this.propertiesService.formService.IsValidImageFile(
          event.target.files[0]
        )
      ) {
        const reader = new FileReader();
        reader.onload = (event1: any) => {
          this.UpdateFormGroupValues(event1, event);
        };
        reader.readAsDataURL(event.target.files[0]);
        this.FileName = event.target.files[0].name;
      }
    }
  }

  private UpdateFormGroupValues(event1: any, event: any) {
    this.FooterControl.form.patchValue({
      footerImage: event1.target.result,
      footerImageFile: event.target.files[0],
    });
    this.FooterControl.footerImageFile = event.target.files[0];
  }
  
  Remove() {
    this.FooterControl.form.patchValue({
      footerImage: '../../../../../../../../../assets/back-button.png',
      footerImageFile: null,
    });
    this.FileName = '';
  }

  OpenTranslateDialog() {
    this.OpenModal = true;
    this.propertiesService.SetFooterTextFormArray(this.FooterControl.text);
  }

  UpdateTranslatedTexts(event) {
    this.propertiesService.UpdateFooterTranslatedText(
      event,
      this.FooterControl
    );
    this.CloseFooterTranslateDialog();
  }
  OnIsControlSelectedPropertyChange() {
    this.IsControlSelectedChange.emit(this.IsControlSelected);
  }
  CloseFooterTranslateDialog() {
    this.OpenModal = false;
  }

  Translate(event) {
    this.propertiesService.TranslateText(event, true);
  }
}
