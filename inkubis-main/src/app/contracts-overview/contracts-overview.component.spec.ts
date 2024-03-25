import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsOverviewComponent } from './contracts-overview.component';

describe('ContractsOverviewComponent', () => {
  let component: ContractsOverviewComponent;
  let fixture: ComponentFixture<ContractsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractsOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
