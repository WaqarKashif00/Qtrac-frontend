import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutes } from 'src/app/routes/home.routes';
import { DefaultHomePageComponent } from './default-home-page/default-home-page.component';
import { HomeInterfacePreviewExecutionSharedModule } from '../utility-configuration/home-interface/preview-execution-shared/preview-execution-shared.module';
import { DesignedHomePageComponent } from './designed-home-page/designed-home-page.component';

@NgModule({
  imports: [SharedModule, HomeInterfacePreviewExecutionSharedModule, RouterModule.forChild(HomeRoutes)],
  declarations: [HomeComponent, DefaultHomePageComponent, DesignedHomePageComponent],
  exports: [HomeInterfacePreviewExecutionSharedModule],
})
export class HomeModule { }
