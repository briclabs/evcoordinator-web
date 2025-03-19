import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantAssociationComponent } from './participant-association.component';

describe('ParticipantAssociationComponent', () => {
  let component: ParticipantAssociationComponent;
  let fixture: ComponentFixture<ParticipantAssociationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantAssociationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
