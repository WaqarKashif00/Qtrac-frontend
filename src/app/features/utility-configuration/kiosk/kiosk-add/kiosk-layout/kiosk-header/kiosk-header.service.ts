import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { KioskLayoutService } from '../kiosk-layout.service';
import { IDropdown } from '../Models/drop-down-Item';
import { ISupportedLanguage } from '../Models/supported-language.interface';

@Injectable()
export class KioskHeaderService extends AbstractComponentService {
  PageList$: Observable<IDropdown[]>;
  LanguageList$: Observable<ISupportedLanguage[]>;
  get WorkFlow() {
    return this.layoutService.WorkFlow;
  }
  get KioskData() {
    return this.layoutService.KioskData;
  }
  constructor(private layoutService: KioskLayoutService) {
    super();
    this.PageList$ = this.layoutService.PageList$;
    this.LanguageList$ = this.layoutService.LanguageList$;
  }
  GetKioskData() {
    throw new Error('Method not implemented.');
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

  SetCurrentPage(value: string) {
    this.layoutService.SetCurrentPage(value);
  }
}
