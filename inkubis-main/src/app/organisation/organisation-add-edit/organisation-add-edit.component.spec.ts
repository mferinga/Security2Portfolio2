import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationAddEditComponent } from './organisation-add-edit.component';

describe('OrganisationAddEditComponent', () => {
  let component: OrganisationAddEditComponent;
  let fixture: ComponentFixture<OrganisationAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
