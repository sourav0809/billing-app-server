export interface AddSubjectsToDepartmentDTO {
  elective?: boolean;
  subjectIds: string[];
}

export interface AddUsersToDepartmentDTO {
  userIds: string[];
}

export interface BulkDepartmentData {
  code: string;
  name: string;
  shortName?: string;
}

export interface BulkDepartmentUploadResult {
  createdDepartments: Array<{
    code: string;
    departmentId: string;
    name: string;
    shortName?: string;
  }>;
  errors: Array<{
    data: BulkDepartmentData;
    error: string;
    row: number;
  }>;
  failed: number;
  successful: number;
}

export interface CreateDepartmentDTO {
  code: string;
  instituteId: string;
  name: string;
  shortName?: string;
}

export interface DepartmentSubjectWithDetails {
  createdAt: Date;
  department: {
    code: string;
    id: string;
    name: string;
    shortName: null | string;
  };
  departmentId: string;
  elective: boolean;
  id: string;
  subject: {
    code: null | string;
    id: string;
    name: string;
    shortName: null | string;
  };
  subjectId: string;
  updatedAt: Date;
}

export interface DepartmentWithInstitute {
  _count?: {
    enrolledSubjects: number;
    sections: number;
    subjects: number;
  };
  code: string;
  createdAt: Date;
  id: string;
  institute: {
    email?: string;
    id: string;
    name: string;
    phoneNumber?: string;
  };
  instituteId: string;
  name: string;
  shortName?: string;
  updatedAt: Date;
}

export interface UpdateDepartmentDTO {
  code?: string;
  name?: string;
  shortName?: string;
}
