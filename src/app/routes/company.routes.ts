import { Routes } from '@angular/router';
import { CompanyComponent } from '../features/company/company.component';
import { AddOrEditCompanyComponent } from '../features/company/components/add-company/add-or-edit-company.component';

export const CompanyRoutes: Routes = [
    { path: '', component: CompanyComponent },
    { path: 'add-company', component: AddOrEditCompanyComponent  },
    { path: 'edit-company', component: AddOrEditCompanyComponent  },
];
