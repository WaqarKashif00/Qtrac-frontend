import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ButtonControl } from 'src/app/features/utility-configuration/mobile/models/controls/button.control';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IMobileControlSelection } from 'src/app/features/utility-configuration/mobile/models/mobile-control-selection.interface';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { BorderSizes } from '../../../../../../../../../models/constants/font.constant';
import { IMobileQuestionSetData } from '../../../../../../models/mobile-layout-data.interface';
import { SurveyQuestionService } from '../survey-question.service';

@Component({
    selector: 'lavi-survey-question-property-control',
    templateUrl: 'survey-question-property-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyQuestionPropertyControlComponent extends AbstractComponent {
    Panel$: Observable<PanelControl>;
    SelectedLanguage$: Observable<ICurrentLanguage>;
    CurrentPage$: Observable<IMobilePageDetails>;
    QuestionSet$: Observable<IMobileQuestionSetData[]>;

    OpenDialog$: Observable<boolean>;
    TextFormArray$: Observable<FormArray>;
    OpenButtonImageDialog$: Observable<boolean>;
    ButtonImageFormArray$: Observable<FormArray>;
    ControlSelection$: Observable<IMobileControlSelection>;
    PrimaryButton = true;
    BorderSizes = BorderSizes;

    constructor(private service: SurveyQuestionService) {
        super();
        this.InitializeObservables();
    }

    private InitializeObservables() {
        this.Panel$ = this.service.SurveyQuestionPanel$;
        this.CurrentPage$ = this.service.CurrentPage$;
        this.SelectedLanguage$ = this.service.SelectedLanguage$;
        this.QuestionSet$ = this.service.SurveyQuestionSetList$;
        this.OpenDialog$ = this.service.OpenTranslateDialog$;
        this.TextFormArray$ = this.service.LabelTextFormArray$;
        this.OpenButtonImageDialog$ = this.service.OpenButtonImageDialog$;
        this.ButtonImageFormArray$ = this.service.ButtonImageFormArray$;
        this.ControlSelection$ = this.service.ControlSelection$;
    }

    UpdatePanelData(panelData: PanelControl) {
        this.service.UpdatePanelData(panelData);
    }

    OnButtonDataChange(buttonData: ButtonControl) {
        this.service.UpdateButtonData(buttonData);
    }

    OnItemChange(event) {
        this.service.SetPanelItemsOnQuestionSet(event);
    }

    OnItemsDropDownChange(value: string) {
        this.PrimaryButton = (value === 'primary');
        this.service.SetPrimaryButtonSelectedProperty(this.PrimaryButton);
    }

    OpenTranslateDialog() {
        this.service.OpenDialog(this.PrimaryButton);
    }

    CloseTranslateDialog() {
        this.service.CloseDialog();
    }

    Translate(event) {
        this.service.TranslateText(event);
    }

    UpdateTranslatedTexts(event) {
        this.service.UpdateTranslatedTexts(event, this.PrimaryButton);
    }

    OpenImageDialog() {
        this.service.OpenImageDialog(this.PrimaryButton);
    }

    Save(event) {
        this.service.Save(event, this.PrimaryButton);
    }

    CloseImageDialog() {
        this.service.CloseImageDialog();
    }

}
