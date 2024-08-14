import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { Announcement } from '../../../models/controls/announcement.control';
import { Control } from '../../../models/controls/control';
import { DesignerPanel } from '../../../models/controls/designer-panel.control';
import { TicketProperty } from '../../../models/controls/ticket-property.control';
import { AppointmentSchedulerService } from '../scheduler-designer.service';
import { TranslateService } from '../../../../../core/services/translate.service';
import { ICurrentLanguage } from '../../../models/current-language.interface';
import { FooterProperties } from '../../../models/controls/footer.control';

@Injectable()
export class PropertyWindowService extends AbstractComponentService {
  SelectedPage$: Observable<string>;

  DesignerPanel$: Observable<DesignerPanel>;
  private DesignerPanelSubject: BehaviorSubject<DesignerPanel>;

  TicketPropertyPanel$: Observable<TicketProperty>;
  private TicketPropertyPanelSubject: BehaviorSubject<TicketProperty>;

  Announcement$: Observable<Announcement>;
  private AnnouncementSubject: BehaviorSubject<Announcement>;

  private OpenTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenTranslateDialog$: Observable<boolean>;

  private OpenAnnouncementTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenAnnouncementTranslateDialog$: Observable<boolean>;

  private OpenFooterTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenFooterTranslateDialog$: Observable<boolean>;

  private LabelTextFormArraySubject: BehaviorSubject<FormArray>;
  LabelTextFormArray$: Observable<FormArray>;

  SelectedLanguage$: Observable<ICurrentLanguage>;

  FooterDetail$: Observable<FooterProperties>;
  private FooterDetailSubject: BehaviorSubject<FooterProperties>;

  TranslatedTexts = {};
  isTranslated = false;
  Languages = [];

  constructor(private service: AppointmentSchedulerService, private translateService: TranslateService) {
    super();
    this.InitializeObservables();
    this.InitializeSubjects();
    this.SubscribeObservable();
  }
  private InitializeSubjects() {
    this.DesignerPanelSubject = new BehaviorSubject<DesignerPanel>(null);
    this.DesignerPanel$ = this.DesignerPanelSubject.asObservable();
    this.TicketPropertyPanelSubject = new BehaviorSubject<TicketProperty>(null);
    this.TicketPropertyPanel$ = this.TicketPropertyPanelSubject.asObservable();
    this.AnnouncementSubject = new BehaviorSubject<Announcement>(null);
    this.Announcement$ = this.AnnouncementSubject.asObservable();
    this.OpenTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenTranslateDialog$ = this.OpenTranslateDialogSubject.asObservable();
    this.OpenAnnouncementTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenAnnouncementTranslateDialog$ = this.OpenAnnouncementTranslateDialogSubject.asObservable();
    this.LabelTextFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.LabelTextFormArray$ = this.LabelTextFormArraySubject.asObservable();
    this.FooterDetailSubject = new BehaviorSubject<FooterProperties>(null);
    this.FooterDetail$ = this.FooterDetailSubject.asObservable();
    this.OpenFooterTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenFooterTranslateDialog$ = this.OpenFooterTranslateDialogSubject.asObservable()
  }

  private InitializeObservables() {
    this.SelectedPage$ = this.service.SelectedPage$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
  }

  private SubscribeObservable() {
    this.subs.sink = this.service.SchedulerControlsData$.subscribe((data) => {
      this.DesignerPanelSubject.next(data.designerPanel);
      this.TicketPropertyPanelSubject.next(data.ticketProperties);
      this.AnnouncementSubject.next(data.announcement);
      this.FooterDetailSubject.next(data.footerProperties);
    });
    this.subs.sink = this.service.Languages$.subscribe(lang => {
      this.Languages = lang;
    });
  }

  ChangeWorkFlow() {
    this.service.ChangeWorkFlow();
  }

  UpdateDesignerData(form: FormGroup) {
    this.UpdateControlProperties(this.DesignerPanelSubject.value, form);
    this.service.UpdateDesignerData(this.DesignerPanelSubject.value);
  }

  UpdateTicketPropertyData(form: FormGroup) {
    this.UpdateControlProperties(this.TicketPropertyPanelSubject.value, form);
    this.service.UpdateTicketPropertyData(
      this.TicketPropertyPanelSubject.value
    );
  }

  UpdateAnnouncementPropertyData(form: FormGroup) {
    this.UpdateControlProperties(this.AnnouncementSubject.value, form);
    this.service.UpdateAnnouncementData(
      this.AnnouncementSubject.value
    );
  }

  UpdateControlProperties(control: Control, form: FormGroup) {
    for (const formControl in form.value) {
      if (control[formControl] !== undefined) {
        control[formControl] = form.value[formControl];
      }
    }
  }

  UpdateFooterData(form: FormGroup) {
    this.UpdateControlProperties(this.FooterDetailSubject.value, form);
    this.service.UpdateFooterData(
      this.FooterDetailSubject.value
    );
  }

  ChangeSchedulerType(value: string) {
    this.service.ChangeSchedulerSteps(value);
  }

  //open primary button text model

  OpenDialog(control, type) {
    this.SetTextInModal(control, type);
    if (type === 'announcement') {
      this.OpenAnnouncementTranslateDialogSubject.next(true);
    } else if (type === 'footer') {
      this.OpenFooterTranslateDialogSubject.next(true);
    } else {
      this.OpenTranslateDialogSubject.next(true);
    }

  }

  public SetTextInModal(control: any, type) {
    if (type === 'primary') {
      this.TranslatedTexts = control.primaryButtonText;
    } else if (type === 'secondary') {
      this.TranslatedTexts = control.secondaryButtonText;
    } else if (type === 'announcement') {
      this.TranslatedTexts = control.text;
    } else if (type === 'footer') {
      this.TranslatedTexts = control.text
    } else if (type === 'service') {
      this.TranslatedTexts = control.serviceTabText
    } else if (type === 'information') {
      this.TranslatedTexts = control.informationTabText;
    } else if (type === 'location') {
      this.TranslatedTexts = control.locationTabText;
    } else if (type === 'appointment') {
      this.TranslatedTexts = control.appointmentTabText;
    } else if (type === 'review') {
      this.TranslatedTexts = control.reviewHeadingText;
    }   else if (type === 'serviceHeading') {
      this.TranslatedTexts = control.serviceHeadingText
    } else if (type === 'informationHeading') {
      this.TranslatedTexts = control.informationHeadingText;
    } else if (type === 'locationHeading') {
      this.TranslatedTexts = control.locationHeadingText;
    } else if (type === 'appointmentHeading') {
      this.TranslatedTexts = control.appointmentHeadingText;
    } else if (type === 'reviewHeading') {
      this.TranslatedTexts = control.reviewHeadingText;
    }

    this.SetTextFormArray(this.TranslatedTexts);
  }

  CloseDialog(type) {
    if (type === 'announcement') {
      this.OpenAnnouncementTranslateDialogSubject.next(false);
    } else if (type === 'footer') {
      this.OpenFooterTranslateDialogSubject.next(false);
    } else {
      this.OpenTranslateDialogSubject.next(false);
    }

  }

  private SetTextFormArray(text: object) {
    this.LabelTextFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach(ele => {
        this.LabelTextFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          text: text[ele.languageCode] || ''
        }));
      });
    }
  }

  public GetConvertedLangArrayToObject(TranslateResponses): {} {
    return this.service.ConvertLanguageArrayToObject(TranslateResponses);
  }

  TranslateText(textToTranslate: string) {
    if (textToTranslate) {
      this.subs.sink = this.translateService
        .GetTranslatedTexts(textToTranslate)
        .subscribe((TranslateResponses) => {
          if (TranslateResponses && TranslateResponses.length !== 0) {
            this.isTranslated = true;
            this.TranslatedTexts = this.GetConvertedLangArrayToObject(TranslateResponses);
            this.SetTextFormArray(this.TranslatedTexts);
          }
        });
    }
  }

  public updateStepLabel(text: any, type: string) {
    this.service.updateStepLabel(text, type);
  }
}
