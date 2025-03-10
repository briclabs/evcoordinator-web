import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase',
  standalone: true,
})
export class TitleCasePipe implements PipeTransform {
  transform(value: string): string {
    return value
      .replace(/([A-Z])/g, ' $1') // Space before camelCase capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .trim() // Remove leading/trailing spaces
      .toLowerCase() // Convert to lowercase for consistency
      .split(' ') // Split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join(' '); // Join the words back with spaces
  }
}
