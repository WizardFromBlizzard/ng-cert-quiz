export function swapElements<T>(questions: T[], i: number): T[] {
  if (!questions.length) {
    // Array doesn't have enough elements
    return [];
  }
  const arrLenght = questions?.length ?? 0;
  const temp = questions[i];
  questions[i] = questions[arrLenght - 1];
  questions[arrLenght - 1] = temp;
  return questions.filter((item, index) => index !== arrLenght) as T[];
}
