import { Inject, Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { LOCATION } from '../tokens/location.token';

@Injectable()
export class ShortURLHandlerService extends AbstractComponentService {
  constructor(@Inject(LOCATION) private readonly location: Location) {
    super();
  }
  HandlerShortURLs() {
    const apiURL = this.appConfigService.config.DynamicVariablesAPIUrl;
    const pathName = location.pathname;
    const newPath = '/api/external/dynamic-processor' + pathName;
    location.href = apiURL + newPath;
  }
}
