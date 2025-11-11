export interface CreateStudentDTO {
  name: string;
  registrationNumber: string;
  userId: string;
}

export interface StudentWithUser {
  createdAt: Date;
  id: string;
  name: string;
  registrationNumber: string;
  updatedAt: Date;
  user: {
    email: string;
    id: string;
    name: string;
    phoneNumber?: string;
    role: string;
  };
  userId: string;
}

export interface UpdateStudentDTO {
  name?: string;
  registrationNumber?: string;
  userId?: string;
}
