import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ContractComponent } from './contract/contract.component';
import { Step1Component } from './contract/step1/step1.component';
import { Step2Component } from './contract/step2/step2.component';
import { Step3Component } from './contract/step3/step3.component';
import { FieldComponent } from './field/field.component';
import { LoginComponent } from './login/login.component';
import { OrganisationAddEditComponent } from './organisation/organisation-add-edit/organisation-add-edit.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { TemplateAddEditComponent } from './template/template-add-edit/template-add-edit.component';
import { TemplateComponent } from './template/template.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CategoryAddEditComponent } from './category/category-add-edit/category-add-edit.component';
import { CategoryComponent } from './category/category.component';
import { FieldAddEditComponent } from './field/field-add-edit/field-add-edit.component';
import { ContractsOverviewComponent } from './contracts-overview/contracts-overview.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { AuthGuardService } from './infrastructure/auth-guard.service';
import { ContractEditComponent } from './contract-edit/contract-edit.component';
import { UserOverviewComponent } from "./user-overview/user-overview.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  {
    path: 'organisations',
    pathMatch: 'full',
    component: OrganisationComponent,
  },
  {
    path: 'organisations/create',
    pathMatch: 'full',
    component: OrganisationAddEditComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'organisations/:id',
    pathMatch: 'full',
    component: ContractsOverviewComponent,
  },
  {
    path: 'organisations/edit/:id',
    pathMatch: 'full',
    component: OrganisationAddEditComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'template',
    pathMatch: 'full',
    component: TemplateComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'template/edit/:id',
    pathMatch: 'full',
    component: TemplateAddEditComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'template/create',
    pathMatch: 'full',
    component: TemplateAddEditComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'account',
    pathMatch: 'full',
    component: AccountComponent,
  },
  {
    path: 'contracts/create',
    pathMatch: 'prefix',
    component: ContractComponent,

    children: [
      {
        path: '',
        pathMatch: 'full',
        component: Step1Component,
      },
      {
        path: 'step1',
        component: Step1Component,
      },
      {
        path: 'step2',
        component: Step2Component,
      },
      {
        path: 'step3',
        component: Step3Component,
      },
    ],
  },
  {
    path: 'fields',
    pathMatch: 'full',
    component: FieldComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'contract/detail/:id',
    pathMatch: 'full',
    component: ContractDetailComponent,
  },
  {
    path: 'contract/detail/:id/edit',
    pathMatch: 'full',
    component: ContractEditComponent,
  },
  {
    path: 'fields/create',
    pathMatch: 'full',
    component: FieldAddEditComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'fields/edit/:id',
    pathMatch: 'full',
    component: FieldAddEditComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'categories',
    pathMatch: 'full',
    component: CategoryComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'categories/create',
    pathMatch: 'full',
    component: CategoryAddEditComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'categories/edit/:id',
    pathMatch: 'full',
    component: CategoryAddEditComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'users',
    pathMatch: 'full',
    component: UserOverviewComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'users/create',
    pathMatch: 'full',
    component: AddEditUserComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'users/edit/:id',
    pathMatch: 'full',
    component: AddEditUserComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
