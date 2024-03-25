import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractGenerateButtonComponent } from './contract-generate-button.component';

describe('ContractGenerateButtonComponent', () => {
  let component: ContractGenerateButtonComponent;
  let fixture: ComponentFixture<ContractGenerateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractGenerateButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractGenerateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
