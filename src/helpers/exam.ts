import { PrismaTypes } from '../config/prisma';

export const calculateGrade = (percentage: number) => {
  return percentage >= 90
    ? 'A'
    : percentage >= 80
    ? 'B'
    : percentage >= 70
    ? 'C'
    : percentage >= 60
    ? 'D'
    : 'F';
};

export async function calculateResult(
  studentAnswer: PrismaTypes.StudentAnswerGetPayload<Record<string, never>> & {
    extractedData: PrismaTypes.StudentAnswerGetPayload<Record<string, never>>['extractedData'];
  }
): Promise<{
  grade: string;
  percentage: number;
  remarks: string;
  totalMarksObtained: number;
  totalMaxMarks: number;
}> {
  let totalMarksObtained = 0;
  let totalMaxMarks = 0;

  const responseDetails = studentAnswer.extractedData;

  // Use the already computed totals from the hierarchical data structure
  totalMarksObtained = (responseDetails as any)?.totalMarksScored || 0;
  totalMaxMarks = (responseDetails as any)?.totalMarks || 0;

  const percentage = totalMaxMarks > 0 ? Math.round((totalMarksObtained / totalMaxMarks) * 100) : 0;

  const grade = calculateGrade(percentage);

  const remarks = `Student scored ${totalMarksObtained} out of ${totalMaxMarks} marks (${percentage}%)`;

  return { grade, percentage, remarks, totalMarksObtained, totalMaxMarks };
}
