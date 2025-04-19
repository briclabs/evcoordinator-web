import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ErrorMessageComponent {
  @Input() errorMessages?: Map<string, string>;
  @Input() fieldName!: string;
}
