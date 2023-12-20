import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DonationsComponent } from "./donations.component";

describe('Donations', () => {
  let fixture: ComponentFixture<DonationsComponent>;
  let component: DonationsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonationsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should contain the expected sections of text', () => {
    const menuEntries: HTMLElement[] = fixture.nativeElement.querySelectorAll('h4');

    expect(menuEntries.length).toEqual(3);

    let sectionHeaderText: Array<string> = new Array<string>(3);

    menuEntries.forEach(sectionHeader => {
      sectionHeaderText.push(sectionHeader.innerText);
    })

    expect(sectionHeaderText).toContain('Recommended Minimum Donation:');
    expect(sectionHeaderText).toContain('How to Submit Your Donation via PayPal (preferred):');
    expect(sectionHeaderText).toContain('How to Submit Your Donation via Check:');

  });

})
