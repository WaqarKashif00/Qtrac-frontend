import { Injectable } from '@angular/core';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';

@Injectable({ providedIn: 'root' })
export class DynamicVariablesApiService {
    get BaseAPIUrl() {
        return this.appConfigService.config.DynamicVariablesAPIUrl;
    }
    constructor(
        private readonly formService: FormService,
        private readonly appConfigService: AppConfigService,
      ) { }

    GetVariables<T, P>(data: T, includeQuestion: boolean | string, includeDynamics: boolean){
        return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/dynamic-processor/get-available-dynamic-variables/${includeQuestion}/${includeDynamics}`, data);
    }

    ReplaceDynamicVariables<T, P>(data: T){
      return this.formService.PostAPICall<P, T>
      (`${this.BaseAPIUrl}/api/external/dynamic-processor/replace-multiple-variables-in-strings`, data);
    }

    GetCalledAndWaitingCustomerVairaibles<T, P>(data: T) {
      return this.formService.PostAPICall<P, T>
      (`${this.BaseAPIUrl}/api/external/dynamic-processor/GetCustomersInQueueAndFields`, data);
    }

    GetServedVairaibles<T, P>(data: T) {
      return this.formService.PostAPICall<P, T>
      (`${this.BaseAPIUrl}/api/external/dynamic-processor/GetCustomersInServing`, data);
    }
}
