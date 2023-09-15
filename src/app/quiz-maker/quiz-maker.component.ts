import { Component } from '@angular/core';
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
  subCategorys: Category[] = [];
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

  difficult!: string;
  category!: string;
  subcategory!: Category | null;
  scienceSubcategory: Category[] = [];
  entertainmentSubcategory: Category[] = [];
  subType!: SubcategoryType | undefined;
  /*
  TODO:
  1. Add sub-categories
  2. Create private method for implementation
  3. Create logic for third dropdown
  4. Copy component from workspace autodropdronw (maybe make it with control value accessor)
  */
  constructor(protected quizService: QuizService) {
    this.categories$ = quizService.getAllCategories().pipe(
      map((res) => {
        const transforValues: Category[] = [];
        const uniqueNames = new Set();
        res.forEach((item) => {
          if (!item.name.includes(':')) {
            transforValues.push(item);
          } else {
            if (item.name.includes('Science')) {
              this.scienceSubcategory.push({
                id: item.id,
                name: item.name.split(':')[1].trim(),
              });
            } else {
              this.entertainmentSubcategory.push({
                id: item.id,
                name: item.name.split(':')[1].trim(),
              });
            }
            // this.subCategorys.push({
            //   id: item.id,
            //   name: item.name.split(':')[1],
            // });
            item.name = item.name.split(':')[0];

            if (!uniqueNames.has(item.name)) {
              transforValues.push({
                id: item.id,
                name: item.name,
                hasSubCategories: true,
                subcategoryType: item.name as SubcategoryType,
              });
              uniqueNames.add(item.name);
            }
          }
        });
        return transforValues;
      }),
      tap(console.log)
    );
  }

  createQuiz(): void {
    this.questions$ = this.quizService.createQuiz(
      this.subcategory ? this.subcategory.id.toString() : this.category,
      this.difficult as Difficulty
    );
  }

  categoryValue(event: Category): void {
    this.subcategory = event.hasSubCategories ? event : null;
    if (this.subcategory) {
      this.subType = this.subcategory.subcategoryType;
      return;
    }
    this.category = event?.id.toString();
    this.subType = 'None';
  }

  difficultyValue(event: Difficulties): void {
    this.difficult = this.difficultName(event.id);
  }

  subcategoryValue(event: Category): void {
    // this.quizService.getAllCategories().subscribe((data) => console.log(data));

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
}
