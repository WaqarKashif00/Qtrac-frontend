import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FooterModule } from '../../footer/footer.module';
import { HeaderModule } from '../../header/header.module';
import { AuthService } from '../auth.service';
import { BaseLayoutComponent } from './base-layout.component';

@NgModule({
  imports: [HeaderModule, FooterModule, SharedModule, RouterModule],
  exports: [BaseLayoutComponent],
  declarations: [BaseLayoutComponent],
  providers: [AuthService]
})
export class BaseLayoutModule {}
