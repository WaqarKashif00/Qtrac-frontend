import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { TranslateResponse } from '../../features/work-flow/models/translate-response.interface';
import { AuthStateService } from './auth-state.service';


@Injectable({ providedIn: 'root' })
export class TranslateService extends AbstractComponentService {

  constructor(private authStateService: AuthStateService){
    super();
  }

  GetTranslatedTexts(text: string, ruleDocument?: any): Observable<TranslateResponse[]> {
    const url = `${this.appConfigService.config.LanguageTranslateBaseAPIUrl}/api/companies/${this.authStateService.CompanyId}/translate`;
    return this.formService.PostAPICall<TranslateResponse[], { text: string , ruleDocument: any }>(url, { text  , ruleDocument});
  }

  TranslateMultipleTexts(textsToTranslate: Array<object>, languageId: string, companyId: string, loading): Observable<object> {
    const url = `${this.appConfigService.config.LanguageTranslateBaseAPIUrl}/api/external/companies/${companyId}/translate/multiple-text`;
    return this.formService.PostAPICall<object, { textsToTranslate  , languageId}>(url, { textsToTranslate  , languageId}, loading);
  }

  GetExternalTranslatedTexts(text: string, companyId?: any): Observable<TranslateResponse[]> {
    const url = `${this.appConfigService.config.LanguageTranslateBaseAPIUrl}/api/external/companies/${companyId ||this.authStateService.CompanyId }/translate`;
    return this.formService.PostAPICall<TranslateResponse[], { text: string}>(url, { text });
  }
}
