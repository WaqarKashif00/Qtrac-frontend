import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IndexDBService } from 'src/app/core/services/index-db.service';
import {
  IndexDBLayoutDataKeys,
  IndexDBStoreNames,
} from 'src/app/models/constants/index-db.constant';
import { IMobileDropdown } from '../../../models/mobile-drop-down-Item';
import { IMobileSupportedLanguage } from '../../../models/mobile-supported-language.interface';
import { HeaderService } from './header.service';

@Component({
  selector: 'lavi-mobile-header',
  templateUrl: 'header.component.html',
  providers: [HeaderService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends AbstractComponent {
  PageList$: Observable<IMobileDropdown[]>;
  LanguageList$: Observable<IMobileSupportedLanguage[]>;
  LanguageList: IMobileSupportedLanguage[];
  SelectedLanguage: IMobileSupportedLanguage;
  SelectedPage: IMobileDropdown;
  constructor(
    private headerService: HeaderService,
    private idbService: IndexDBService
  ) {
    super();
    this.PageList$ = this.headerService.PageList$.pipe(
      tap((x) => {
        if(x.length>0){
          this.SelectedPage=x[0];
        }
      })
    );;
    this.LanguageList$ = this.headerService.LanguageList$.pipe(
      tap((x) => {
        this.LanguageList = x;
        if(x.length>0){
          this.SelectedLanguage=x[0];
        }
      })
    );
  }

  Init() {}

  OnLanguageChange(event) {
    this.headerService.ChangeLayoutLanguage(event.languageCode);
  }

  OnPageListChange(event) {
    this.headerService.ChangePage(event.value);
  }

  async OpenPreviewWindow() {
    const data = this.headerService.GetModifiedLayoutDetails();
    window.open(
      `${window.location.origin}/mobile-preview`,
      'winname',
      'resizable=no,width = ' +
        331 +
        ',height = ' +
        588 +
        ',left = ' +
        300 +
        ',top = ' +
        200 +
        ',screenX = ' +
        200 +
        ',screenY = ' +
        300
    );
    await this.idbService.Put(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.MobileLayoutData,
      data
    );
    await this.idbService.Put(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.MobileWorkFlowData,
      this.headerService.GetWorkFlowData()
    );
    await this.idbService.Put(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.CompanySupportLanguages,
      this.LanguageList
    );
  }

  OnSaveAsDraftClick() {
    this.headerService.SaveAsDraft();
  }

  OnSaveClick() {
    this.headerService.Save();
  }
}
