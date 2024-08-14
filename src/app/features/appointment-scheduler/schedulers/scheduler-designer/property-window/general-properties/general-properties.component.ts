import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { getTimeStampSplitedFileName } from 'src/app/core/utilities/core-utilities';
import { DesignerPanel } from 'src/app/features/appointment-scheduler/models/controls/designer-panel.control';
import {
  ShowIconInFooterItems,
  EnableMultiVerificationItems,
  SchedulerTypeItems,
} from 'src/app/models/constants/general-properties.constant';
import { PropertyWindowService } from '../property-window.service';

@Component({
  selector: 'lavi-general-properties',
  templateUrl: './general-properties.component.html',
  styleUrls: ['./general-properties.component.scss'],
})
export class GeneralPropertiesComponent extends AbstractComponent {
  FileName: string;

  ShowIconInFooter: Array<string> = ShowIconInFooterItems;
  EnableMultiVerification: Array<string> = EnableMultiVerificationItems;
  SchedulerType: Array<string> = SchedulerTypeItems;

  TranslatedTexts: {}
  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  IsTranslated = false;
  modelHeaderText: string;
  updatedItem: string

  @Input() DesignerPanel: DesignerPanel;
  @Output()
  OnUpdateDesignerData: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output()
  OnWorkFlowChangeClick: EventEmitter<void> = new EventEmitter<void>();

  @Output() OnDataChange: EventEmitter<DesignerPanel> = new EventEmitter();

  get TranslateTextsObj() {
    return this.propertiesService.TranslatedTexts;
  }

  constructor(
    private changeDetector: ChangeDetectorRef,
    private propertiesService: PropertyWindowService
  ) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.OpenDialog$ = this.propertiesService.OpenTranslateDialog$;
    this.TextFormArray$ = this.propertiesService.LabelTextFormArray$;
    this.IsTranslated = this.propertiesService.isTranslated;
  }

  Init() {
    this.subs.sink = this.DesignerPanel.form.valueChanges
      .pipe(debounceTime(300))
      .subscribe((data) => {
        this.OnUpdateDesignerData.emit(this.DesignerPanel.form);
        this.UpdateFileName();
      });
    this.UpdateFileName();
  }

  ChangeColorPicker() {
    this.changeDetector.detectChanges();
  }
  ChangeWorkFlow() {
    this.OnWorkFlowChangeClick.emit();
  }
  OnSchedulerTypeChange(event) {
    this.propertiesService.ChangeSchedulerType(event.target.value);
  }

  OpenTranslateDialog(text: string, type: string) {
    this.modelHeaderText = text;
    this.updatedItem = type;
    this.propertiesService.OpenDialog(this.DesignerPanel, type);
  }

  private UpdateFileName() {
    if (
      this.DesignerPanel.imageFileURL &&
      this.DesignerPanel.imageFileURL.includes('://')
    ) {
      this.FileName = getTimeStampSplitedFileName(
        this.DesignerPanel.imageFileURL.split('//')[1].split('/')[2]
      );
      this.changeDetector.detectChanges();
    }
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
          this.DesignerPanel.form.patchValue({
            imageFileURL: event1.target.result,
            imageFile: event.target.files[0],
          });
        };
        reader.readAsDataURL(event.target.files[0]);
        this.FileName = event.target.files[0].name;
      }
    }
  }

  Remove() {
    this.DesignerPanel.form.patchValue({
      imageFileURL: null,
      imageFile: null,
    });
    this.FileName = '';
  }

  CloseTranslateDialog(type) {
    this.propertiesService.CloseDialog(type);
  }

  UpdateTranslatedTexts(event) {
    this.UpdateTextsWithoutTranslation(event);
    this.TranslatedTexts = this.IsTranslated ? this.TranslateTextsObj : this.TranslatedTexts;
    if (this.updatedItem === 'primary') {
      this.DesignerPanel.primaryButtonText = this.TranslatedTexts;
      this.DesignerPanel.form.get('primaryButtonText').setValue(this.TranslatedTexts);
    } else if (this.updatedItem === 'secondary') {
      this.DesignerPanel.secondaryButtonText = this.TranslatedTexts;
      this.DesignerPanel.form.get('secondaryButtonText').setValue(this.TranslatedTexts);
    } else if (this.updatedItem === 'service') {
      this.DesignerPanel.serviceTabText = this.TranslatedTexts;
      this.propertiesService.updateStepLabel(this.TranslatedTexts, 'AvailableServiceSelectionPage');
      this.DesignerPanel.form.get('serviceTabText').setValue(this.TranslatedTexts);
    } else if (this.updatedItem === 'information') {
      this.DesignerPanel.informationTabText = this.TranslatedTexts;
      this.propertiesService.updateStepLabel(this.TranslatedTexts, 'InformationGatheringPage');
      this.DesignerPanel.form.get('informationTabText').setValue(this.TranslatedTexts);
    } else if (this.updatedItem === 'location') {
      this.DesignerPanel.locationTabText = this.TranslatedTexts;
      this.propertiesService.updateStepLabel(this.TranslatedTexts, 'NearestBranchSelectionPage');
      this.DesignerPanel.form.get('locationTabText').setValue(this.TranslatedTexts);
    } else if (this.updatedItem === 'appointment') {
      this.DesignerPanel.appointmentTabText = this.TranslatedTexts;
      this.propertiesService.updateStepLabel(this.TranslatedTexts, 'AppointmentSchedulePage');
      this.DesignerPanel.form.get('appointmentTabText').setValue(this.TranslatedTexts);
    } else if (this.updatedItem === 'review') {
      this.DesignerPanel.reviewTabText = this.TranslatedTexts;
      this.propertiesService.updateStepLabel(this.TranslatedTexts, 'AppointmentNotificationPreferencePage');
      this.DesignerPanel.form.get('reviewTabText').setValue(this.TranslatedTexts);
    }else if (this.updatedItem === 'serviceHeading') {
      this.DesignerPanel.serviceHeadingText = this.TranslatedTexts;
      this.DesignerPanel.form.get('serviceHeadingText').setValue(this.TranslatedTexts);
    } else if (this.updatedItem === 'informationHeading') {
      this.DesignerPanel.informationHeadingText = this.TranslatedTexts;
      this.DesignerPanel.form.get('informationHeadingText').setValue(this.TranslatedTexts);
    } else if (this.updatedItem === 'locationHeading') {
      this.DesignerPanel.locationHeadingText = this.TranslatedTexts;
      this.DesignerPanel.form.get('locationHeadingText').setValue(this.TranslatedTexts);
    } else if (this.updatedItem === 'appointmentHeading') {
      this.DesignerPanel.appointmentHeadingText = this.TranslatedTexts;
      this.DesignerPanel.form.get('appointmentHeadingText').setValue(this.TranslatedTexts);
    } else if (this.updatedItem === 'reviewHeading') {
      this.DesignerPanel.reviewHeadingText = this.TranslatedTexts;
      this.propertiesService.updateStepLabel(this.TranslatedTexts, 'AppointmentNotificationPreferencePage');
      this.DesignerPanel.form.get('reviewHeadingText').setValue(this.TranslatedTexts);
    }
    this.OnUpdateDesignerData.emit(this.DesignerPanel.form);
    this.CloseTranslateDialog(this.updatedItem);
    this.updatedItem = '';
    this.IsTranslated = false;
  }

  private UpdateTextsWithoutTranslation(event: any) {
    if (event.length > 0 && (!this.IsTranslated)) {
      const labelTexts = [];
      for (const e of event) {
        labelTexts.push({
          languageId: e.value.languageCode,
          translatedText: e.value.text
        });
      }
      this.TranslatedTexts = this.propertiesService.GetConvertedLangArrayToObject(labelTexts)
    }
  }

  Translate(event) {
    this.propertiesService.TranslateText(event);
  }
}
