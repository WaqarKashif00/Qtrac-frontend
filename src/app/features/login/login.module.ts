import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login.component';
import { PkceService } from './pkce.service';

@NgModule({
  declarations: [
    LoginComponent,
    LandingPageComponent
  ],
  imports: [
    SharedModule,
    RouterModule
  ],
  exports: [],
  providers: [PkceService]
})
export class LoginModule { }
