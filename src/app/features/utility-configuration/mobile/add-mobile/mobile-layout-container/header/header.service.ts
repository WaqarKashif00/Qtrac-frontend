import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IMobileDropdown } from '../../../models/mobile-drop-down-Item';
import { IMobileSupportedLanguage } from '../../../models/mobile-supported-language.interface';
import { MobileLayoutContainerService } from '../mobile-layout-container.service';

@Injectable()
export class HeaderService extends AbstractComponentService {


  PageList$: Observable<IMobileDropdown[]>;
  LanguageList$: Observable<IMobileSupportedLanguage[]>;


  constructor(private layoutService: MobileLayoutContainerService) {
    super();
    this.PageList$ = this.layoutService.PageList$;
    this.LanguageList$ = this.layoutService.LanguageList$;
  }

  Save() {
    this.layoutService.Save();
  }
  SaveAsDraft() {
    this.layoutService.SaveAsDraft();
  }

  ChangeLayoutLanguage(value: string) {
    this.layoutService.ChangeLayoutLanguage(value);
  }

  GetModifiedLayoutDetails() {
    return this.layoutService.GetModifiedLayoutDetails();
  }
  GetWorkFlowData() {
    return this.layoutService.WorkFlowData;
  }
  SetCurrentPage(value: string) {
    this.layoutService.SetCurrentPage(value);
  }

  ChangePage(pageNumber) {
   this.layoutService.ChangePage(pageNumber);
  }
}
