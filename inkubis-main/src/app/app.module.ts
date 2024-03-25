import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login/login.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { HttpClientModule } from '@angular/common/http';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { AccountComponent } from './account/account.component';
import { OrganisationAddEditComponent } from './organisation/organisation-add-edit/organisation-add-edit.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { ContractComponent } from './contract/contract.component';
import { Step1Component } from './contract/step1/step1.component';
import { Step2Component } from './contract/step2/step2.component';
import { Step3Component } from './contract/step3/step3.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { FieldComponent } from './field/field.component';
import { FieldAddEditComponent } from './field/field-add-edit/field-add-edit.component';
import { TemplateComponent } from './template/template.component';
import { TemplateAddEditComponent } from './template/template-add-edit/template-add-edit.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CategoryComponent } from './category/category.component';
import { CategoryAddEditComponent } from './category/category-add-edit/category-add-edit.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ContractsOverviewComponent } from './contracts-overview/contracts-overview.component';
import { ContractGenerateButtonComponent } from './shared/contract-generate-button/contract-generate-button.component';
import { ConfirmationPromptComponent } from './shared/confirmation-prompt/confirmation-prompt.component';
import { AuthGuardService } from './infrastructure/auth-guard.service';
import { ContractEditComponent } from './contract-edit/contract-edit.component';
import { UserOverviewComponent } from './user-overview/user-overview.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AddEditUserComponent,
    AccountComponent,
    SidebarComponent,
    OrganisationComponent,
    OrganisationAddEditComponent,
    ContractComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    ContractDetailComponent,
    FieldComponent,
    FieldAddEditComponent,
    TemplateComponent,
    TemplateAddEditComponent,
    CategoryComponent,
    CategoryAddEditComponent,
    NotFoundComponent,
    ContractsOverviewComponent,
    ContractGenerateButtonComponent,
    ConfirmationPromptComponent,
    ContractEditComponent,
    UserOverviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    EditorModule
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent],
})
export class AppModule { }
