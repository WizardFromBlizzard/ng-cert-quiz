import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  signal,
} from '@angular/core';
import { Question } from '../data.models';
import { QuizService } from '../quiz.service';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { swapElements } from '@shared/utility/utility';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('1000ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class QuizComponent {
  @Input()
  questions: Question[] | null = [];

  userAnswers: string[] = ['', '', '', '', '', ''];
  quizService = inject(QuizService);
  router = inject(Router);
  isEverythingSelected = signal(false);
  isChangedQuestionClicked = signal(false);

  submit(): void {
    this.questions = this.questions?.slice(0, 5) ?? null;
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.quizService.isChangeQuestionUsed.set(true);
    this.router.navigateByUrl('/result');
  }

  trackQuestionId(index: number, question: Question): string {
    return question.question;
  }

  selectAnswer(index: number, answer: string) {
    this.userAnswers[index] = answer;
    this.isEverythingSelected.set(
      this.userAnswers.slice(0, 5).includes('') ? false : true
    );
  }

  changeQuestion(index: number): void {
    this.questions = this.changeSet<Question>(this.questions ?? [], index);
    this.userAnswers = this.changeSet<string>(this.userAnswers, index);
    this.isChangedQuestionClicked.set(true);
    this.isEverythingSelected.set(false);
  }

  private changeSet<T>(items: T[], index: number): T[] {
    items = swapElements(items ?? [], index);
    return items.slice(0, 5);
  }
}
