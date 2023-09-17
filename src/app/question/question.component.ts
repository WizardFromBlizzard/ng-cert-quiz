import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SkipSelf,
} from '@angular/core';
import { Question } from '../data.models';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent {
  @Input({ required: true })
  question!: Question;
  @Input()
  correctAnswer?: string;
  @Input()
  userAnswer?: string;

  @Output() emitChangeQuestion = new EventEmitter();

  constructor(@SkipSelf() protected quizService: QuizService) {}
  getButtonClass(answer: string): string {
    if (!this.userAnswer) {
      if (this.currentSelection === answer) return 'tertiary';
    } else {
      if (this.userAnswer === this.correctAnswer && this.userAnswer === answer)
        return 'tertiary';
      if (answer === this.correctAnswer) return 'secondary';
    }
    return 'primary';
  }

  @Output()
  change = new EventEmitter<string>();

  currentSelection!: string;

  buttonClicked(answer: string): void {
    this.currentSelection = answer;
    this.change.emit(answer);
  }

  changeQuestion(): void {
    this.quizService.isChangeQuestionUsed.set(true);
    this.emitChangeQuestion.emit();
  }
}
