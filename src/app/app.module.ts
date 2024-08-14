import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CoreServiceModule } from './core/core.service.module';
import { restrictSingleImport } from './core/utilities/core-utilities';
import { ErrorModule } from './features/error/error.module';
import { InvalidPathModule } from './features/invalid-path/invalid-path.module';
import { LoginModule } from './features/login/login.module';
import { UnauthorizeModule } from './features/unauthorize/unauthorize.module';
import { AuthModule } from './features/auth/auth.module';
import { LoadingModule } from './features/loading/loading.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appRoutes } from './routes/app.routes';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { GridModule } from '@progress/kendo-angular-grid';
import { TbauthComponent } from './features/tbauth/tbauth.component';
@NgModule({
  declarations: [
    AppComponent,
    TbauthComponent,
    ],
  imports: [
    BrowserAnimationsModule,
    CoreServiceModule,
    LoginModule,
    ErrorModule,
    InvalidPathModule,
    UnauthorizeModule,
    LoadingModule,
    AuthModule,
    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' }),
    DialogsModule,
    TooltipModule,
    GridModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Optional() @SkipSelf() parentModule: AppModule) {
    restrictSingleImport(parentModule, 'AppModule');
  }
}
