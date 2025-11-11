export interface CreateExamDTO {
  creatorId: string;
  description?: string;
  durationMinutes: number;
  name: string;
  scheduledDate: Date | string;
  subjectId: string;
}

export interface QuestionEvaluationResponse {
  createdAt?: Date;
  examId?: string;
  feedback?: null | string;
  flagged?: boolean;
  id?: string;
  itemCategory: null | string;
  itemDescription: null | string;
  itemId: null | string;
  itemNumber: null | string;
  itemText: null | string;
  parentId?: null | string;
  resultId?: string;
  status?: string;
  studentAnswerId: string;
  studentAnswerText: null | string;
  studentNumber: null | string;
  totalMarks: null | number;
  type?: null | string;
  updatedAt?: Date;
}

export interface UpdateExamDTO {
  description?: string;
  durationMinutes?: number;
  finalizedAt?: Date | string;
  name?: string;
  scheduledDate?: Date | string;
  subjectId?: string;
}
