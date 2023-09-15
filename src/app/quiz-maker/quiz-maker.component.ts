import { Component, signal } from '@angular/core';
import {
  Category,
  Difficulties,
  Difficulty,
  Question,
  SubcategoryType,
} from '../data.models';
import { Observable, map, tap } from 'rxjs';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css'],
})
export class QuizMakerComponent {
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

  constructor(protected quizService: QuizService) {
    this.categories$ = quizService.getAllCategories().pipe(
      map((res) => this.filterCategories(res)),
      tap(console.log)
    );
  }

  createQuiz(): void {
    this.questions$ = this.quizService.createQuiz(
      this.subcategory ? this.subcategory?.id?.toString() : this.category(),
      this.difficult() as Difficulty
    );
  }

  getCategoryValue(categoryItem: Category): void {
    // this.subcategory = event.hasSubCategories ? event : null;
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
    /*
    TODO:
     if subcategory is not selected it remember previous subcategory and make quiz out of it
     FIX: when subcategory is not selected don't allow button to be clicked or make some error message
     NOTE: same thing is happening with difficult dropdown 
     */
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
