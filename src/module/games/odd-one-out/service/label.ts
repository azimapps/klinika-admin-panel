export enum QuestionsType {
  WORD = 'word',
  IMAGE = 'image',
}

export const QuestionsTypeLabels: Record<QuestionsType, string> = {
  [QuestionsType.WORD]: "So'z",
  [QuestionsType.IMAGE]: 'Rasm',
};
