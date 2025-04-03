import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GuidelinesComponent } from "./guidelines.component";

describe('Guidelines', () => {
  let fixture: ComponentFixture<GuidelinesComponent>;
  let component: GuidelinesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuidelinesComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should contain the expected sections of text', () => {
    const menuEntries: HTMLElement[] = fixture.nativeElement.querySelectorAll('h4');

    expect(menuEntries.length).toEqual(4);

    let sectionHeaderText: Array<string> = new Array<string>(4);

    menuEntries.forEach(sectionHeader => {
      sectionHeaderText.push(sectionHeader.innerText);
    })

    expect(sectionHeaderText).toContain('Appreciate the Land');
    expect(sectionHeaderText).toContain('Appreciate the Community');
    expect(sectionHeaderText).toContain('Appreciate the Food');
    expect(sectionHeaderText).toContain('Appreciate the Coordinators');

  });

})
