import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';
import { ICountryDropdownList } from '../../models/common/country-dropdown-list.interface';
import { IStateDropdownList } from '../../models/common/state-dropdown-list.interface';
import { GoogleTimezoneResponse } from '../api-models/google-models/timezone-response';

@Injectable({ providedIn: 'root' })
export class LocationAPIService {

  get BaseAPIUrl() {
    return this.appConfigService.config.locationBaseAPIUrl;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  GetCountries(): Observable<ICountryDropdownList[]> {
    return this.formService.GetAPICall<ICountryDropdownList[]>(`${this.BaseAPIUrl}/api/countries`);
  }

  GetStates(countryCode: string): Observable<IStateDropdownList[]> {
    return this.formService.GetAPICall<IStateDropdownList[]>(`${this.BaseAPIUrl}/api/states?countryCode=${countryCode}`);
  }

  async GetTimezoneByLatitudeAndLongitude(
    latitude: number,
    longitude: number
  ): Promise<GoogleTimezoneResponse> {
    try {
      let url = `${this.appConfigService.config.GoogleAPIUrl}/maps/api/timezone/json?location=${latitude}%2C${longitude}&timestamp=1331161200&key=${this.appConfigService.config.GoogleApiKey}`;
      let response = await fetch(url);
      let toJson = await response.json();
      return Promise.resolve(toJson);
    } catch (error) {
      console.error(error);
    }
  }
}
