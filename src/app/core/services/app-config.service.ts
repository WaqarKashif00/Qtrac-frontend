import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AbstractService } from '../../base/abstract-service';
import { IAppConfig } from '../../models/common/app-config.interface';

@Injectable({ providedIn: 'root' })
export class AppConfigService extends AbstractService {

  config: IAppConfig;

  constructor(private http: HttpClient) {
    super();
  }

  load() {
    const jsonFile = `assets/config/app-config.${environment.name}.json`;
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then((response: IAppConfig) => {
        this.config = (response as IAppConfig);
        resolve();
      }).catch((response: any) => {
        reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });
  }

}


