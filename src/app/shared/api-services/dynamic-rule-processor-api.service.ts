import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';
import { EvaluateConditionalRouteRequest } from '../api-models/dynamic-processor/conditional-route-request';
import { ConditionalRoutingResponse } from '../api-models/dynamic-processor/conditional-routing-response';

@Injectable({ providedIn: 'root' })
export class DynamicRuleProcessorAPIService {
  get BaseAPIUrl() {
    return this.appConfigService.config.DynamicVariablesAPIUrl;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  EvaluateConditionalRoute(
    requestDocument: EvaluateConditionalRouteRequest,
    isLoaderRequired = true
  ): Observable<ConditionalRoutingResponse[]> {
    return this.formService.PostAPICall<
      ConditionalRoutingResponse[],
      EvaluateConditionalRouteRequest
    >(
      `${this.BaseAPIUrl}/api/external/dynamic-processor/evaluate-conditional-rule`,
      requestDocument,
      isLoaderRequired
    )
  }
}


