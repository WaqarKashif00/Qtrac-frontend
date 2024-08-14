import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/features/home/home.component';
import { StoreCurrentPageViewNameGuard } from '../core/guards/store-current-page-view-name.guard';

export const HomeRoutes: Routes = [
  {
    path: '', 
    canActivateChild: [StoreCurrentPageViewNameGuard],
    component: HomeComponent,
  },
];
