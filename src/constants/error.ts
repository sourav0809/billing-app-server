const EXAM = {
  COPY_FAILED: 'Failed to copy exam',
  COUNT_FAILED: 'Failed to count exams',
  CREATE_FAILED: 'Failed to create exam',
  DELETE_FAILED: 'Failed to delete exam',
  DELETE_SET_FAILED: 'Failed to delete set',
  DOUBLE_CHECK_STUDENTS: 'Double check if all students are added to the exam',
  EVALUATION_FAILED: 'Failed to start exam evaluation',
  EXTRACTION_NOT_COMPLETED: 'Extraction is not completed',
  FETCH_FAILED: 'Failed to fetch exams',
  FETCH_SET_DOCUMENTS_FAILED: 'Failed to fetch exam sets details',
  FETCH_SINGLE_FAILED: 'Failed to fetch exam',
  GET_EXAM_SETS_DETAILS_FAILED: 'Failed to get exam sets details',
  NO_PENDING_STUDENT_ANSWERS: 'No pending student answers to publish results for',
  NO_QUESTION_PAPER_OR_ANSWER_KEY_FOUND:
    'No question paper or answer key found with the specified set name',
  NO_QUESTIONS_FOUND: 'No questions found for the specified set name',
  NO_RESPONSE_FOUND: 'No response found for the student',
  NO_STUDENT_ANSWERS_FOUND: 'No student answers found for evaluation',
  NOT_FOUND: 'Exam not found',
  RESULTS_PUBLISH_FAILED: 'Failed to publish results',
  REVIEW_FAILED: 'Failed to process exam review',
  UNRESOLVED_ISSUES:
    'You have some unresolved issues. Please upload the documents for the set again',
  UPDATE_FAILED: 'Failed to update exam'
};

const ANALYTICS = {
  CALCULATE_FAILED: 'Failed to calculate analytics',
  FETCH_FAILED: 'Failed to fetch analytics',
  RESET_FAILED: 'Failed to reset analytics'
};

const ANSWER_KEY = {
  CONFLICT: 'An answer key with this set name already exists for this exam',
  CREATE_FAILED: 'Failed to create answer key',
  DELETE_FAILED: 'Failed to delete answer key',
  EXTRACTED_DATA_NOT_FOUND: 'The answer key extraction is in progress',
  FETCH_FAILED: 'Failed to fetch answer keys',
  FETCH_SINGLE_FAILED: 'Failed to fetch answer key',
  FILE_REQUIRED: 'Answer key PDF file is required',
  GET_FAILED: 'Failed to get answer key',
  NOT_BELONG_TO_QUESTION_PAPER: 'Answer key does not belong to the specified question paper',
  NOT_FOUND: 'Answer key not found',
  UPDATE_FAILED: 'Failed to update answer key',
  UPLOAD_FAILED: 'Failed to upload answer key'
};
const QUESTION_PAPER = {
  ALREADY_EXISTS: 'A question paper with this set name already exists for this exam',

  CHECK_FOR_UNRESOLVED_MODEL_ANSWER_ISSUES_FAILED:
    'Failed to check for unresolved model answer issues',
  COUNT_FAILED: 'Failed to count question papers',
  CREATE_FAILED: 'Failed to create question paper',
  DELETE_FAILED: 'Failed to delete question paper',
  DOES_NOT_BELONG_TO_EXAM: 'Question paper does not belong to the specified exam',
  FETCH_FAILED: 'Failed to fetch question papers',
  FETCH_QUESTION_RESPONSE_DETAILS_FAILED: 'Failed to get question response details',
  FETCH_SINGLE_FAILED: 'Failed to fetch question paper',
  INSERT_FAILED: 'Failed to insert question',
  INVALID_RESPONSE_DETAILS_STRUCTURE: 'Invalid response details structure',
  NOT_BELONG_TO_EXAM: 'Question paper does not belong to the specified exam',
  NOT_FOUND: 'Question paper not found',
  UPDATE_ANOMALY_STATUS_FAILED: 'Failed to update anomaly status',
  UPDATE_FAILED: 'Failed to update question paper',
  UPLOAD_FAILED: 'Failed to upload question paper'
};
const FILE = {
  FILE_REQUIRED: 'File is required',
  NO_FILE_UPLOADED: 'No file uploaded',
  ONLY_PDF_ALLOWED: 'Only PDF files are allowed for answer keys',
  SIZE_EXCEEDED: 'File size exceeds the maximum limit'
};
const AUTH = {
  FORBIDDEN: "You don't have permission to access this resource.",
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_TOKEN: 'Unauthorized: Invalid token',
  LOGIN_FAILED: 'Login failed',
  NOT_FOUND: 'User not found',
  PASSWORD_NOT_SET: 'Password not set for this user',
  PASSWORD_UPDATED: 'Password updated successfully',
  TOKEN_EXPIRED: 'Unauthorized: Token expired',
  UNAUTHORIZED: 'Unauthorized: Missing or invalid authorization header'
};

const SUBJECT = {
  NOT_FOUND: 'Subject not found'
};

const COMMON = {
  AT_LEAST_ONE_FIELD_REQUIRED: 'At least one field must be provided for update',
  EXAM_ID_AND_SET_NAME_REQUIRED: 'Exam ID and set name are required',
  NO_VALID_FIELDS_TO_UPDATE: 'No valid fields to update'
};

const RESULT = {
  ALREADY_EXISTS: 'Result already exists for this student answer',
  CREATE_FAILED: 'Failed to create result',
  FETCH_FAILED: 'Failed to fetch results',
  FETCH_SINGLE_FAILED: 'Failed to fetch result',
  NOT_FINALIZED: 'All the questions must be finalized before finalizing the exam',
  NOT_FOUND: 'Result not found',
  UPDATE_FAILED: 'Failed to update result'
};

const STUDENT = {
  NOT_FOUND: 'Student not found',
  ROLE_CONFLICT: 'User must have STUDENT role to create a student profile'
};

const STUDENT_ANSWER = {
  CREATE_FAILED: 'Failed to create student answer',
  DELETE_FAILED: 'Failed to delete student answer',
  DOES_NOT_HAVE_RESPONSE_DETAILS_TO_UPDATE:
    'Student answer does not have responseDetails to update',
  FETCH_FAILED: 'Failed to fetch attended exams',
  FETCH_SINGLE_FAILED: 'Failed to fetch student answer',
  FINALIZE_FAILED: 'Failed to finalize student answer',
  GET_ATTENDED_EXAMS_FAILED: 'Failed to get attended exams',
  GET_ATTENDED_EXAMS_FOR_STUDENT_FAILED: 'Failed to get attended exams for student',
  GET_STUDENT_ANSWERS_WITH_DETAILS_FAILED: 'Failed to get student answers with details',
  NO_VALID_FIELDS_TO_UPDATE: 'No valid fields to update',
  NOT_FOUND: 'Student answer not found',
  QUESTION_NOT_FOUND_IN_RESPONSE_DETAILS: 'Question not found in responseDetails',
  RESPONSE_NOT_FOUND: 'Student answer response not found',
  UPDATE_FAILED: 'Failed to update student answer'
};

const BATCH_EVALUATION = {
  CREATE_FAILED: 'Failed to create batch evaluation',
  DELETE_FAILED: 'Failed to delete batch evaluation',
  FETCH_FAILED: 'Failed to fetch batch evaluations',
  FETCH_SINGLE_FAILED: 'Failed to fetch batch evaluation',
  NOT_FOUND: 'Batch evaluation not found',
  STATUS_UPDATE_FAILED: 'Failed to update batch evaluation status',
  UPDATE_FAILED: 'Failed to update batch evaluation'
};

const ERROR_MESSAGES = {
  ANALYTICS,
  ANSWER_KEY,
  AUTH,
  BATCH_EVALUATION,
  COMMON,
  EXAM,
  FILE,
  QUESTION_PAPER,
  RESULT,
  STUDENT,
  STUDENT_ANSWER,
  SUBJECT
};
export default ERROR_MESSAGES;
