import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SliderComponent } from './slider.component';
export const QueryRoutes: Routes = [
  { path: '', component: SliderComponent },
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(QueryRoutes),
  ],
  declarations: [SliderComponent],
})
export class SliderModule {}
