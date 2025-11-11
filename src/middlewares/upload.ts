import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

import ApiError from '../utils/ApiError';
import { response } from '../utils/response';

/**
 * Memory storage configuration for multer
 * Files are stored in memory as Buffer objects for S3 upload
 */
const storage = multer.memoryStorage();

/**
 * File filter for PDF files only
 */
const pdfFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is a PDF
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only PDF files are allowed'));
  }
};

/**
 * File filter for general file uploads (PDF, images, etc.)
 */
const generalFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'File type not allowed'));
  }
};

/**
 * File filter for Excel files only
 */
const excelFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only Excel files (.xlsx, .xls, .xlsm) are allowed'));
  }
};

/**
 * Limits configuration for PDF uploads (20MB)
 */
const pdfLimits = {
  files: 1, // Only 1 file per request for individual uploads
  fileSize: 40 * 1024 * 1024 // 20MB limit for PDF files
};

/**
 * Limits configuration for general uploads
 */
const limits = {
  files: 10, // Maximum 10 files per request
  fileSize: 10 * 1024 * 1024 // 10MB limit for other files
};

/**
 * Multer instance for single PDF file upload (20MB limit)
 */
export const uploadSinglePDF = multer({
  fileFilter: pdfFileFilter,
  limits: pdfLimits,
  storage
});

/**
 * Multer instance for multiple PDF files
 */
export const uploadMultiplePDFs = multer({
  fileFilter: pdfFileFilter,
  limits,
  storage
});

/**
 * Multer instance for general file uploads
 */
export const uploadGeneral = multer({
  fileFilter: generalFileFilter,
  limits,
  storage
});

/**
 * Middleware to handle multer errors
 */
export const handleMulterError = (error: any, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return response(res, 400, 'File size too large. Maximum size is 20MB for PDF files');
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return response(res, 400, 'Too many files uploaded. Only one file allowed per request');
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return response(res, 400, 'Unexpected field in file upload');
    }
  }

  if (error instanceof ApiError) {
    return response(res, error.statusCode, error.message);
  }

  return response(res, 500, 'File upload error');
};

/**
 * Middleware to handle multer errors for general uploads (10MB)
 */
export const handleGeneralMulterError = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return response(res, 400, 'File size too large. Maximum size is 10MB');
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return response(res, 400, 'Too many files uploaded');
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return response(res, 400, 'Unexpected field in file upload');
    }
  }

  if (error instanceof ApiError) {
    return response(res, error.statusCode, error.message);
  }

  return response(res, 500, 'File upload error');
};

/**
 * Field names for question paper and answer key uploads
 */
export const QUESTION_PAPER_FIELD = 'questionPaper';
export const ANSWER_KEY_FIELD = 'answerKey';

/**
 * Middleware for uploading question paper and answer key files
 */
export const uploadQuestionPaperAndAnswerKey = multer({
  fileFilter: pdfFileFilter,
  limits: {
    files: 2, // Exactly 2 files: question paper and answer key
    fileSize: 10 * 1024 * 1024 // 10MB limit per file
  },
  storage
}).fields([
  { maxCount: 1, name: QUESTION_PAPER_FIELD },
  { maxCount: 1, name: ANSWER_KEY_FIELD }
]);

/**
 * Middleware to validate that both question paper and answer key files are uploaded
 */
export const validateQuestionPaperAndAnswerKeyFiles = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files) {
    return response(res, 400, 'No files uploaded');
  }

  if (!files[QUESTION_PAPER_FIELD] || files[QUESTION_PAPER_FIELD].length === 0) {
    return response(res, 400, 'Question paper file is required');
  }

  if (!files[ANSWER_KEY_FIELD] || files[ANSWER_KEY_FIELD].length === 0) {
    return response(res, 400, 'Answer key file is required');
  }

  return next();
};

/**
 * Limits configuration for Excel uploads (20MB)
 */
const excelLimits = {
  files: 1, // Only 1 Excel file per request
  fileSize: 20 * 1024 * 1024 // 20MB limit for Excel files
};

/**
 * Multer instance for single Excel file upload (20MB limit)
 */
export const uploadSingleExcel = multer({
  fileFilter: excelFileFilter,
  limits: excelLimits,
  storage
});

/**
 * Field name for student bulk upload Excel file
 */
export const STUDENT_BULK_UPLOAD_FIELD = 'studentsFile';

/**
 * Middleware for uploading student bulk upload Excel file
 */
export const uploadStudentBulkFile = multer({
  fileFilter: excelFileFilter,
  limits: excelLimits,
  storage
}).single(STUDENT_BULK_UPLOAD_FIELD);

/**
 * Middleware to validate that student bulk upload file is uploaded
 */
export const validateStudentBulkUploadFile = (req: Request, res: Response, next: NextFunction) => {
  const file = req.file;

  if (!file) {
    return response(res, 400, 'Student bulk upload Excel file is required');
  }

  return next();
};

/**
 * Field name for department bulk upload Excel file
 */
export const DEPARTMENT_BULK_UPLOAD_FIELD = 'departmentsFile';

/**
 * Middleware for uploading department bulk upload Excel file
 */
export const uploadDepartmentBulkFile = multer({
  fileFilter: excelFileFilter,
  limits: excelLimits,
  storage
}).single(DEPARTMENT_BULK_UPLOAD_FIELD);

/**
 * Middleware to validate that department bulk upload file is uploaded
 */
export const validateDepartmentBulkUploadFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;

  if (!file) {
    return response(res, 400, 'Department bulk upload Excel file is required');
  }

  return next();
};
