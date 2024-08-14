import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ElementRef,
  ErrorHandler,
  Injector,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  NotificationModule,
  NOTIFICATION_CONTAINER
} from '@progress/kendo-angular-notification';
import { AppServerErrorsHandler } from './error-handlers/app-server-error-handler';
import { AppendAzureFunctionAPIKeyInterceptor } from './interceptors/append-azure-function-api-key.interceptor';
import { AppendCurrentPageNameInterceptor } from './interceptors/append-current-page-name.interceptor';
import { AppendTokenInterceptor } from './interceptors/append-token.interceptor';
import { AppendURLInterceptor } from './interceptors/append-url.interceptor';
import { HandleIEGETRequestCacheInterceptor } from './interceptors/handle-ie-get-request-cache.interceptor';
import { HttpMockInterceptor } from './interceptors/http-mock.interceptor';
import { UnAuthorizedInterceptor } from './interceptors/unauthorised.interceptor';
import { AppConfigService } from './services/app-config.service';
import { ThirdPartyScriptsDirective } from './third-party-scripts/third-party-scripts.directive';
import {
  initializeApp,
  restrictSingleImport,
  setRootInjector
} from './utilities/core-utilities';

@NgModule({
  declarations:[ThirdPartyScriptsDirective],
  exports:[ThirdPartyScriptsDirective],
  imports: [
    BrowserModule,
    HttpClientModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService],
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: AppServerErrorsHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HandleIEGETRequestCacheInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppendURLInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppendAzureFunctionAPIKeyInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppendTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpMockInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnAuthorizedInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppendCurrentPageNameInterceptor,
      multi: true
    },
    {
      provide: NOTIFICATION_CONTAINER,
      useFactory: () => {
        return { nativeElement: document.body } as ElementRef;
      },
    },
  ],
})
export class CoreServiceModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreServiceModule,
    private injector: Injector
  ) {
    restrictSingleImport(parentModule, 'CoreServiceModule');
    setRootInjector(injector);
  }
}
