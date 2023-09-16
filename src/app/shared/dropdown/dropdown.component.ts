import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownItem } from 'src/app/data.models';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent<T extends DropdownItem> {
  @Input() placeholder!: string;
  @Input({ required: true })
  items!: T[];
  @Output() emitdropDownValue: EventEmitter<T> = new EventEmitter();

  dropDownControl = new FormControl<string>('');

  trackItemId(index: number, item: T) {
    return item.id;
  }

  dropdownValueChange(event: any) {
    const name = event.target.value;
    const item = this.items.find((item: any) => item.name === name);
    if (item) {
      this.emitdropDownValue.emit(item);
      this.dropDownControl.setValue(name);
    } else {
      this.emitdropDownValue.emit({} as T);
    }
  }
}
