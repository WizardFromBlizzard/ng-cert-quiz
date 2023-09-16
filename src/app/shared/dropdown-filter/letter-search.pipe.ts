import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'letterSearch',
  standalone: true,
})
export class LetterSearchPipe implements PipeTransform {
  transform(value: string = '', strToHighlight: string = ''): string {
    const index = value.toLowerCase().indexOf(strToHighlight.toLowerCase());
    if (index >= 0) {
      return (
        value.substring(0, index) +
        '<b>' +
        value.substring(index, strToHighlight.length + index) +
        '</b>' +
        value.substring(strToHighlight.length + index)
      );
    }
    return value;
  }
}
