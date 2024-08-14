import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ChartsModule } from "@progress/kendo-angular-charts";
import { ChatModule } from '@progress/kendo-angular-conversational-ui';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import {
  DropDownsModule,
  MultiSelectModule
} from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IconsModule } from '@progress/kendo-angular-icons';
import {
  CheckBoxModule,
  InputsModule,
  MaskedTextBoxModule,
  TextBoxModule
} from '@progress/kendo-angular-inputs';
import {
  FloatingLabelModule,
  LabelModule
} from '@progress/kendo-angular-label';
import { ContextMenuModule, MenusModule } from '@progress/kendo-angular-menu';
import { PopupModule } from '@progress/kendo-angular-popup';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { UploadModule, UploadsModule } from '@progress/kendo-angular-upload';
import { TextInputAutocompleteModule } from 'angular-text-input-autocomplete';
import 'hammerjs';
import { polyfill as keyboardEventKeyPolyfill } from 'keyboardevent-key-polyfill';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { FileUploadModule } from '../features/file-upload/file-upload.module';
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';
import { FormModule } from './components/form/form.module';
import { ImageVideoSliderComponent } from './components/image-video-slider/image-video-slider.component';
import { CustomLayoutsModule } from './components/layouts/layouts.module';
import { ListDetailExpanderComponent } from './components/lists/list-detail-expander/list-detail-expander.component';
import { ListMenuComponent } from './components/lists/list-menu/list-menu.component';
import { AddUrlModalComponent } from './components/modal/add-url-modal/add-url-modal.component';
import { LaviAppointmentModalComponent } from './components/modal/appointment-modal/appointment-modal.component';
import { CompanySMTPConfigurationModalComponent } from './components/modal/company-smtp-configuration-modal/company-smtp-configuration-modal.component';
import { LanguageImageModalComponent } from './components/modal/language-image-modal/language-image-modal.component';
import { LanguageSliderModalComponent } from './components/modal/language-slider-modal/language-slider-modal.component';
import { LanguageTranslateModalComponent } from './components/modal/language-translate-modal/language-translate-modal.component';
import { LanguageVideoModalComponent } from './components/modal/language-video-modal/language-video-modal.component';
import { ModalModule } from './components/modal/modal.module';
import { NgGUDItemsControlComponent } from './components/ng-guditems-control/ng-guditems-control.component';
import { LaviPhoneNumberComponent } from './components/phone-number/phone-number.component';
import { LaviPhoneNumberModule } from './components/phone-number/phone-number.module';
import { FilterBaseComponent } from './components/search/components/filter-base/filter-base.component';
import { FilterWithTagsComponent } from './components/search/components/filter-with-tags/filter-with-tags.component';
import { TagDisplayComponent } from './components/tags/tag-display/tag-display.component';
import { AppValidationListComponent } from './components/validations/app-validation-list/app-validation-list.component';
import { AppValidationComponent } from './components/validations/app-validation/app-validation.component';
import { ValidationModule } from './components/validations/validation.module';
import { LaviVideoComponent } from './components/video/video.component';
import { AutoFocusModule } from './directives/auto-focus/auto-focus.module';
import { AutoscrollerModule } from './directives/auto-scroller/auto-scroller.module';
import { ClickOutsideModule } from './directives/click-outside/click-outside.module';
import { ControlClickModule } from './directives/ctrl-click/ctrl-click.module';
import { DebounceClickDirective } from './directives/debounce-click/debounce-click.directive';
import { DebounceClickModule } from './directives/debounce-click/debounce-click.module';
import { DocumentClickModule } from './directives/document-click/document-click.module';
import { DraggableModule } from './directives/draggable/draggable.module';
import { DropDownEventsModule } from './directives/drop-down-events/drop-down-events.module';
import { FillHeightDirective } from './directives/fill-height/fill-height.directive';
import { FillHeightModule } from './directives/fill-height/fill-height.module';
import { SelectFirstInputDirective } from './directives/focus-first-input/focus-first-input.directive';
import { GooglePlaceModule } from './directives/google-address-auto-complete/ngx-google-places-autocomplete.module';
import { LaviHasRoleAccessModule } from './directives/has-role-access/has-role-access.module';
import { HelpButtonVisibilityModule } from './directives/help-button-visibility/help-button-visibility.module';
import { MatchHeightDirective } from './directives/match-height/match-height.directive';
import { MatchHeightModule } from './directives/match-height/match-height.module';
import { MouseDownSelectableDirective } from './directives/mouse-down-selectable/mouse-down-selectable.directives';
import { NumberModule } from './directives/only-number/only-number.module';
import { PasswordModule } from './directives/password/password.module';
import { SkipKeyDirective } from './directives/SkipKey/skip-key.directives';
import { TextFieldLoaderModule } from './directives/textfield-loader/text-field-loader.module';
import { LaviTrimValueModule } from './directives/trim-value/trim-value.module';
import { VideoLoaderModule } from './directives/video-loader/video-loader.module';
import { NgVForContainerDirective } from './directives/virtual/ng-for-container.directive';
import { NgVForDirective } from './directives/virtual/ng-vfor-directive';
import { LaviAnswerFormatterPipeModule } from './pipes/answer-formatter/answer-formatter.module';
import { DefaultPipeModule } from './pipes/default/default.module';
import { LaviEmptyStringIfNullOrUndefinedPipeModule } from './pipes/empty-string-if-null-or-undefined/empty-string-if-null-or-undefined.module';
import { ExtractInitialsPipe } from './pipes/extract-initials.pipe';
import { LaviNameFromIdPipeModule } from './pipes/lavi-value-by-id/lavi-name-from-id.module';
import { LaviListFilterPipeModule } from './pipes/list-filter.module';
import { LaviSortByPipeModule } from './pipes/list-sort/lavi-sort-list.module';
import { NoOfDigitToTicketNumberingFormatPipe } from './pipes/no-of-digit-to-no-of-zero.pipe';
import { LaviPhoneNumberFormatPipeModule } from './pipes/phone-number-formatter/phone-number-formatter.pipe.module';
import { QuoteStringPipeModule } from './pipes/quote-string/quote-string.module';
import { FilterWithTagsPipeModule } from './pipes/search-filter/search-filter.module';
import { UniqueFilterPipeModule } from './pipes/unique-filter/unique-filter.module';

keyboardEventKeyPolyfill();
@NgModule({
  declarations: [
    ImageVideoSliderComponent,
    LanguageTranslateModalComponent,
    ListDetailExpanderComponent,
    ListMenuComponent,
    FilterBaseComponent,
    FilterWithTagsComponent,
    TagDisplayComponent,
    LanguageImageModalComponent,
    LanguageVideoModalComponent,
    LanguageSliderModalComponent,
    NoOfDigitToTicketNumberingFormatPipe,
    ExtractInitialsPipe,
    LaviVideoComponent,
    LaviAppointmentModalComponent,
    AddUrlModalComponent,
    CompanySMTPConfigurationModalComponent,
    LineChartComponent,
    MouseDownSelectableDirective,
    SkipKeyDirective,
    NgGUDItemsControlComponent,
    NgVForDirective,
    NgVForContainerDirective
  ],
  imports: [
    ButtonsModule,
    RippleModule,
    InputsModule,
    IconsModule,
    TextBoxModule,
    CheckBoxModule,
    PopupModule,
    MaskedTextBoxModule,
    DropDownsModule,
    CustomLayoutsModule,
    FormModule,
    FormsModule,
    MenusModule,
    ValidationModule,
    DebounceClickModule,
    DraggableModule,
    FillHeightModule,
    MatchHeightModule,
    DialogsModule,
    UploadsModule,
    UploadModule,
    DateInputsModule,
    MultiSelectModule,
    FormsModule,
    FileUploadModule,
    FloatingLabelModule,
    LabelModule,
    PasswordModule,
    NumberModule,
    DialogsModule,
    ModalModule,
    AutoFocusModule,
    GridModule,
    ChatModule,
    ControlClickModule,
    LaviListFilterPipeModule,
    DocumentClickModule,
    LaviSortByPipeModule,
    LaviNameFromIdPipeModule,
    LaviTrimValueModule,
    ContextMenuModule,
    AutoscrollerModule,
    LaviPhoneNumberFormatPipeModule,
    FilterWithTagsPipeModule,
    TextFieldLoaderModule,
    DropDownEventsModule,
    LaviHasRoleAccessModule,
    SchedulerModule,
    LaviPhoneNumberModule,
    LaviEmptyStringIfNullOrUndefinedPipeModule,
    TextInputAutocompleteModule,
    ClickOutsideModule,
    VideoLoaderModule,
    DefaultPipeModule,
    ChartsModule,
    GooglePlaceModule,
    NgMultiSelectDropDownModule,
    UniqueFilterPipeModule,
    QuoteStringPipeModule,
    AngularEditorModule,
    HelpButtonVisibilityModule,
    NgxPaginationModule

  ],
  exports: [
    DebounceClickDirective,
    FillHeightDirective,
    MatchHeightDirective,
    AppValidationComponent,
    AppValidationListComponent,
    SelectFirstInputDirective,
    RippleModule,
    ButtonsModule,
    DraggableModule,
    InputsModule,
    IconsModule,
    TextBoxModule,
    CheckBoxModule,
    PopupModule,
    MaskedTextBoxModule,
    DropDownsModule,
    CustomLayoutsModule,
    FormModule,
    FormsModule,
    ValidationModule,
    DebounceClickModule,
    FillHeightModule,
    MatchHeightModule,
    DialogsModule,
    UploadModule,
    UploadsModule,
    DateInputsModule,
    FileUploadModule,
    FloatingLabelModule,
    LabelModule,
    ImageVideoSliderComponent,
    MultiSelectModule,
    FormModule,
    PasswordModule,
    NumberModule,
    ChatModule,
    ControlClickModule,
    LaviListFilterPipeModule,
    DocumentClickModule,
    LaviSortByPipeModule,
    ModalModule,
    AutoFocusModule,
    NoOfDigitToTicketNumberingFormatPipe,
    ExtractInitialsPipe,
    GridModule,
    UploadModule,
    DialogsModule,
    NoOfDigitToTicketNumberingFormatPipe,
    LaviNameFromIdPipeModule,
    LaviTrimValueModule,
    MenusModule,
    ContextMenuModule,
    LanguageTranslateModalComponent,
    ListDetailExpanderComponent,
    ListMenuComponent,
    FilterBaseComponent,
    FilterWithTagsComponent,
    TagDisplayComponent,
    LanguageImageModalComponent,
    LanguageVideoModalComponent,
    LanguageSliderModalComponent,
    AutoscrollerModule,
    LaviPhoneNumberFormatPipeModule,
    FilterWithTagsPipeModule,
    LaviAnswerFormatterPipeModule,
    TextFieldLoaderModule,
    DropDownEventsModule,
    LaviVideoComponent,
    LaviHasRoleAccessModule,
    LaviAppointmentModalComponent,
    LaviPhoneNumberComponent,
    SchedulerModule,
    LaviEmptyStringIfNullOrUndefinedPipeModule,
    TextInputAutocompleteModule,
    ClickOutsideModule,
    AddUrlModalComponent,
    VideoLoaderModule,
    CompanySMTPConfigurationModalComponent,
    DefaultPipeModule,
    ChartsModule,
    LineChartComponent,
    GooglePlaceModule,
    NgMultiSelectDropDownModule,
    UniqueFilterPipeModule,
    QuoteStringPipeModule,
    AngularEditorModule,
    MouseDownSelectableDirective,
    SkipKeyDirective,
    NgGUDItemsControlComponent,
    NgVForDirective,
    NgVForContainerDirective,
    MatchHeightModule,
    HelpButtonVisibilityModule,
    NgxPaginationModule
  ]
})
export class SharedModule {}
