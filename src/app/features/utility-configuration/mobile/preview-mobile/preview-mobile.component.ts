import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMobilePreviewData } from '../models/mobile-preview-data.interface';
import { IMobileSupportedLanguage } from '../models/mobile-supported-language.interface';
import { IMobilePageDetails } from '../models/pages.interface';
import { MobilePreviewService } from './preview-mobile.service';

@Component({
  selector: 'lavi-mobile-preview',
  templateUrl: './preview-mobile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MobilePreviewService],
})
export class MobilePreviewComponent extends AbstractComponent {
  MobilePreviewData$: Observable<IMobilePreviewData>;
  CurrentPage$: Observable<IMobilePageDetails>;
  LanguageList$: Observable<IMobileSupportedLanguage[]>;
  SelectedLanguageId$: Observable<string>;
  CompanyName: string;
  Count: number;

  get DefaultLanguageCode(){
    return this.previewService.DefaultLanguageId;
  }

  constructor(
    private previewService: MobilePreviewService
  ) {
    super();
    this.InitializeObservables();
    this.previewService.InitializeProperties();
    this.Count = 0;
  }

  private InitializeObservables() {
    this.MobilePreviewData$ = this.previewService.MobilePreviewData$;
    this.CurrentPage$ = this.previewService.CurrentPage$;
    this.LanguageList$ = this.previewService.LanguageList$;
    this.SelectedLanguageId$ = this.previewService.SelectedLanguageId$;
  }

  Init() {
    this.CompanyName = this.previewService.authService.CompanyName;
  }

  ShowNextPage(data) {
    this.previewService.ShowNextPage(data);
    this.PositionToTop();
  }

  ShowPreviousPage(){
    this.previewService.ShowPreviousPage();
    this.PositionToTop();
  }

  PositionToTop(){
    let divId: HTMLElement = document.getElementById('divContentContainer');
    divId.scrollTop = 0;
  }

  ShowBackButtonInFooter(){
    const currentPage = this.previewService.CurrentPageSubject.value.IsWelcomePage ||
    this.previewService.CurrentPageSubject.value.IsServicePage ||
    this.previewService.CurrentPageSubject.value.IsServiceQuestionPage ||
    this.previewService.CurrentPageSubject.value.IsGlobalQuestionPage;
    if (this.previewService.IsOnlyOneLanguage() && currentPage && this.Count === 0){
      this.Count ++;
      return false;
    }else{
      return (currentPage);
    }
  }

  ExitButtonClick(){
    this.previewService.ExitButtonClick();
  }
}
