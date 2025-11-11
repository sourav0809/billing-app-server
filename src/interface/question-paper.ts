export interface InsertQuestionPayload {
  delete?: boolean;
  examId: string;
  flag?: boolean;
  insertAfterQuestionId?: string;
  modelAnswerText?: string;
  questionId: string;
  questionNumber?: string;
  questionsToConsiderForMarking?: number;
  questionText?: string;
  sectionId?: string;
  setName: string;
  stepMarking?: Array<{
    stepDetail: string;
    stepMark: number | string;
  }>;
  totalMarks?: number;
}
export interface UpdateQuestionPayload {
  examId: string;
  flag?: boolean;
  modelAnswerText?: string;
  questionId: string;
  questionNumber?: string;
  questionsToConsiderForMarking?: number;
  questionText?: string;
  stepMarking?: Array<{
    stepDetail: string;
    stepMark: number | string;
  }>;
  totalMarks?: number;
}
