import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import {
  Category,
  Difficulties,
  Question,
  SubcategoryType,
} from '../data.models';
import { Observable, map, tap } from 'rxjs';
import { QuizService } from '../quiz.service';
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizMakerComponent implements OnInit {
  categories$: Observable<Category[]>;
  questions$!: Observable<Question[]>;
  difficultOptions: Difficulties[] = [
    {
      id: 1,
      name: 'Easy',
    },
    {
      id: 2,
      name: 'Medium',
    },
    {
      id: 3,
      name: 'Hard',
    },
  ];

  difficult = signal('');
  category = signal('');
  subcategory!: Category | null;
  scienceSubcategory: Category[] = [];
  entertainmentSubcategory: Category[] = [];
  subType!: SubcategoryType | undefined;
  quizFormGroup!: FormGroup;
  quizForm$!: Observable<string>;

  constructor(
    protected quizService: QuizService,
    private fb: UntypedFormBuilder
  ) {
    this.categories$ = quizService.getAllCategories().pipe(
      map((res) => this.filterCategories(res)),
      tap(console.log)
    );
  }

  ngOnInit(): void {
    this.quizFormGroup = this.fb.group({
      categoryControl: new FormControl(null, [Validators.required]),
      difficultControl: new FormControl(null, [Validators.required]),
      subcategoryControl: new FormControl(null, [Validators.required]),
    });

    this.quizForm$ = this.quizFormGroup.valueChanges.pipe(
      map((res) =>
        res.categoryControl?.hasSubCategories
          ? res.categoryControl?.name
          : 'None'
      )
    );
  }

  createQuiz(): void {
    this.quizService.isChangeQuestionUsed.set(false);
    const category = this.quizFormGroup.controls['categoryControl']?.value;
    const difficult = this.quizFormGroup.controls['difficultControl']?.value;
    const subcategory =
      this.quizFormGroup.controls['subcategoryControl']?.value;
    this.questions$ = this.quizService.createQuiz(
      subcategory ? subcategory.id : category?.id,
      difficult?.name
    );
  }

  getCategoryValue(categoryItem: Category): void {
    if (categoryItem.hasSubCategories) {
      this.subType = categoryItem.subcategoryType;
      this.category.set('');
      return;
    }
    this.category.set(categoryItem?.id.toString());
    this.subType = 'None';
  }

  difficultyValue(event: Difficulties): void {
    this.difficult.set(this.difficultName(event.id));
  }

  getSubcategoryValue(event: Category): void {
    this.subcategory = event;
  }

  private difficultName(event: number): string {
    switch (event) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      default:
        return '';
    }
  }

  private returnSubcategory(item: Category): string {
    return item.name.split(':')[1].trim();
  }

  private filterCategories(res: Category[]): Category[] {
    const categoryValues: Category[] = [];
    const uniqueNames = new Set<string>();
    res.forEach((item) => {
      if (!item.name.includes(':')) {
        categoryValues.push(item);
      } else {
        this.filterSubcategory(item, categoryValues, uniqueNames);
      }
    });
    return categoryValues;
  }

  private filterSubcategory(
    item: Category,
    categoryValues: Category[],
    uniqueNames: Set<string>
  ): void {
    if (item.name.includes('Science')) {
      this.scienceSubcategory.push({
        id: item.id,
        name: this.returnSubcategory(item),
      });
    } else {
      this.entertainmentSubcategory.push({
        id: item.id,
        name: this.returnSubcategory(item),
      });
    }
    // Needed to remove duplicates in main categories if category has subcategories
    item.name = item.name.split(':')[0];
    if (!uniqueNames.has(item.name)) {
      categoryValues.push({
        id: item.id,
        name: item.name,
        hasSubCategories: true,
        subcategoryType: item.name as SubcategoryType,
      });
      uniqueNames.add(item.name);
    }
  }
}
