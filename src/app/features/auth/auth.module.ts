import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';
import { BaseLayoutModule } from './base-layout/base-layout.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    BaseLayoutModule,
  ],
  exports: [AuthComponent,
    BaseLayoutModule],
  declarations: [AuthComponent],
})
export class AuthModule {}
