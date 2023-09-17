import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { DropdownItem } from 'src/app/data.models';
import { LetterSearchPipe } from './letter-search.pipe';

@Component({
  selector: 'app-dropdown-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LetterSearchPipe],
  templateUrl: './dropdown-filter.component.html',
  styleUrls: ['./dropdown-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownFilterComponent<DropdownItem>),
      multi: true,
    },
  ],
})
export class DropdownFilterComponent<T extends DropdownItem>
  implements ControlValueAccessor, OnInit
{
  @Input({ required: true }) placeholder!: string;
  @Input({ required: true }) items!: T[];
  ngOnInit(): void {
    this.filteredOptions = this.items;
  }
  value!: T;
  selectedValue!: string;
  options: string[] = [];
  filteredOptions: T[] = [];
  onChange = (item: T) => {};
  onTouched = () => {};
  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  filterOptions(event: any): void {
    const query = event.target.value;
    this.filteredOptions = this.items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  newSelection(item: T): void {
    this.selectedValue = item.name;
    this.value = item;
    this.onChange(item);
    this.onTouched();
  }
}
