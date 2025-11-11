/**
 * Common schemas shared across multiple Swagger documentation files
 * This file contains all the shared data models and schemas used by different controllers
 */

export const commonSchemas = {
  // Answer Key schemas
  AnswerKey: {
    properties: {
      createdAt: {
        format: 'date-time',
        type: 'string'
      },
      examId: {
        format: 'uuid',
        type: 'string'
      },
      fileId: {
        format: 'uuid',
        nullable: true,
        type: 'string'
      },
      finalizedAt: {
        format: 'date-time',
        nullable: true,
        type: 'string'
      },
      finalizedBy: {
        nullable: true,
        properties: {
          email: {
            format: 'email',
            type: 'string'
          },
          id: {
            format: 'uuid',
            type: 'string'
          },
          name: {
            type: 'string'
          }
        },
        type: 'object'
      },
      id: {
        example: '550e8400-e29b-41d4-a716-446655440003',
        format: 'uuid',
        type: 'string'
      },
      questionPaperId: {
        format: 'uuid',
        type: 'string'
      },
      setName: {
        example: 'Set A',
        type: 'string'
      },
      status: {
        enum: ['PENDING', 'PROCESSING', 'FINALIZED', 'FAILED'],
        example: 'FINALIZED',
        type: 'string'
      },
      updatedAt: {
        format: 'date-time',
        type: 'string'
      }
    },
    type: 'object'
  },

  CreateStudentRequest: {
    properties: {
      registrationNumber: {
        description: 'Unique registration number for the student',
        example: 'STU2024001',
        type: 'string'
      },
      userId: {
        description: 'ID of the user with STUDENT role',
        example: '550e8400-e29b-41d4-a716-446655440005',
        format: 'uuid',
        type: 'string'
      }
    },
    required: ['registrationNumber', 'userId'],
    type: 'object'
  },

  // Download URL Response
  DownloadUrlResponse: {
    properties: {
      data: {
        properties: {
          downloadUrl: {
            example:
              'https://bucket.s3.amazonaws.com/documents/exam-123/question-paper-set-a.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&...',
            format: 'uri',
            type: 'string'
          },
          expiresIn: {
            description: 'URL expiration time in seconds',
            example: 3600,
            type: 'integer'
          }
        },
        type: 'object'
      },
      message: {
        example: 'Download URL generated successfully',
        type: 'string'
      },
      success: {
        example: true,
        type: 'boolean'
      }
    },
    type: 'object'
  },

  ErrorResponse: {
    properties: {
      message: {
        example: 'An error occurred',
        type: 'string'
      },
      success: {
        example: false,
        type: 'boolean'
      }
    },
    type: 'object'
  },

  // File/Document schemas
  FileInfo: {
    properties: {
      createdAt: {
        format: 'date-time',
        type: 'string'
      },
      id: {
        format: 'uuid',
        type: 'string'
      },
      mimeType: {
        example: 'application/pdf',
        type: 'string'
      },
      originalName: {
        example: 'math_exam_set_a.pdf',
        type: 'string'
      },
      s3Key: {
        example: 'documents/exam-123/question-paper-set-a.pdf',
        type: 'string'
      },
      s3Url: {
        example: 'https://bucket.s3.amazonaws.com/documents/exam-123/question-paper-set-a.pdf',
        format: 'uri',
        type: 'string'
      },
      size: {
        example: 2048576,
        type: 'integer'
      },
      uploadedBy: {
        format: 'uuid',
        type: 'string'
      }
    },
    type: 'object'
  },

  // File Info Response
  FileInfoResponse: {
    properties: {
      data: {
        $ref: '#/components/schemas/FileInfo'
      },
      message: {
        example: 'File information retrieved successfully',
        type: 'string'
      },
      success: {
        example: true,
        type: 'boolean'
      }
    },
    type: 'object'
  },

  // Pagination schemas
  PaginationInfo: {
    properties: {
      hasMore: {
        example: true,
        type: 'boolean'
      },
      page: {
        example: 0,
        type: 'integer'
      },
      size: {
        example: 10,
        type: 'integer'
      },
      total: {
        example: 25,
        type: 'integer'
      }
    },
    type: 'object'
  },

  // Processing Status enum
  ProcessingStatus: {
    enum: ['SUCCESS', 'FAILURE', 'IN_PROGRESS', 'PENDING_PROCESSING'],
    example: 'SUCCESS',
    type: 'string'
  },

  // Question Paper schemas
  QuestionPaper: {
    properties: {
      createdAt: {
        format: 'date-time',
        type: 'string'
      },
      examId: {
        format: 'uuid',
        type: 'string'
      },
      fileId: {
        format: 'uuid',
        nullable: true,
        type: 'string'
      },
      finalizedAt: {
        format: 'date-time',
        nullable: true,
        type: 'string'
      },
      finalizedBy: {
        nullable: true,
        properties: {
          email: {
            format: 'email',
            type: 'string'
          },
          id: {
            format: 'uuid',
            type: 'string'
          },
          name: {
            type: 'string'
          }
        },
        type: 'object'
      },
      id: {
        example: '550e8400-e29b-41d4-a716-446655440002',
        format: 'uuid',
        type: 'string'
      },
      setName: {
        example: 'Set A',
        type: 'string'
      },
      status: {
        enum: ['PENDING', 'PROCESSING', 'FINALIZED', 'FAILED'],
        example: 'FINALIZED',
        type: 'string'
      },
      updatedAt: {
        format: 'date-time',
        type: 'string'
      }
    },
    type: 'object'
  },

  // Student-related schemas
  Student: {
    properties: {
      _count: {
        properties: {
          studentAnswers: {
            example: 5,
            type: 'integer'
          }
        },
        type: 'object'
      },
      createdAt: {
        example: '2024-01-01T00:00:00.000Z',
        format: 'date-time',
        type: 'string'
      },
      id: {
        example: '550e8400-e29b-41d4-a716-446655440004',
        format: 'uuid',
        type: 'string'
      },
      registrationNumber: {
        example: 'STU2024001',
        type: 'string'
      },
      updatedAt: {
        example: '2024-01-01T00:00:00.000Z',
        format: 'date-time',
        type: 'string'
      },
      user: {
        properties: {
          email: {
            example: 'john.doe@example.com',
            format: 'email',
            type: 'string'
          },
          id: {
            format: 'uuid',
            type: 'string'
          },
          name: {
            example: 'John Doe',
            type: 'string'
          },
          phoneNumber: {
            example: '+1234567890',
            nullable: true,
            type: 'string'
          },
          role: {
            enum: ['STUDENT', 'TEACHER'],
            example: 'STUDENT',
            type: 'string'
          }
        },
        type: 'object'
      },
      userId: {
        example: '550e8400-e29b-41d4-a716-446655440005',
        format: 'uuid',
        type: 'string'
      }
    },
    type: 'object'
  },

  StudentsListResponse: {
    properties: {
      data: {
        properties: {
          data: {
            items: {
              $ref: '#/components/schemas/Student'
            },
            type: 'array'
          },
          pagination: {
            properties: {
              hasMore: {
                example: true,
                type: 'boolean'
              },
              page: {
                example: 0,
                type: 'integer'
              },
              size: {
                example: 10,
                type: 'integer'
              },
              total: {
                example: 25,
                type: 'integer'
              }
            },
            type: 'object'
          }
        },
        type: 'object'
      },
      message: {
        example: 'Students fetched successfully',
        type: 'string'
      },
      success: {
        example: true,
        type: 'boolean'
      }
    },
    type: 'object'
  },

  // Subject-related schemas
  Subject: {
    properties: {
      code: {
        example: 'MATH101',
        type: 'string'
      },
      createdAt: {
        format: 'date-time',
        type: 'string'
      },
      id: {
        example: '550e8400-e29b-41d4-a716-446655440001',
        format: 'uuid',
        type: 'string'
      },
      name: {
        example: 'Mathematics',
        type: 'string'
      },
      updatedAt: {
        format: 'date-time',
        type: 'string'
      }
    },
    type: 'object'
  },

  // Response schemas
  SuccessResponse: {
    properties: {
      message: {
        example: 'Operation completed successfully',
        type: 'string'
      },
      success: {
        example: true,
        type: 'boolean'
      }
    },
    type: 'object'
  },

  UpdateStudentRequest: {
    properties: {
      registrationNumber: {
        description: 'Updated registration number for the student',
        example: 'STU2024002',
        type: 'string'
      },
      userId: {
        description: 'Updated user ID for the student',
        example: '550e8400-e29b-41d4-a716-446655440006',
        format: 'uuid',
        type: 'string'
      }
    },
    type: 'object'
  },

  // Upload Response
  UploadResponse: {
    properties: {
      data: {
        properties: {
          file: {
            $ref: '#/components/schemas/FileInfo'
          },
          recordId: {
            description: 'ID of the created question paper or answer key record',
            format: 'uuid',
            type: 'string'
          }
        },
        type: 'object'
      },
      message: {
        example: 'File uploaded successfully',
        type: 'string'
      },
      success: {
        example: true,
        type: 'boolean'
      }
    },
    type: 'object'
  },

  // User-related schemas
  User: {
    properties: {
      createdAt: {
        example: '2024-01-01T00:00:00.000Z',
        format: 'date-time',
        type: 'string'
      },
      email: {
        example: 'john.doe@example.com',
        format: 'email',
        type: 'string'
      },
      id: {
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
        type: 'string'
      },
      name: {
        example: 'John Doe',
        type: 'string'
      },
      phoneNumber: {
        example: '+1234567890',
        type: 'string'
      },
      updatedAt: {
        example: '2024-01-01T00:00:00.000Z',
        format: 'date-time',
        type: 'string'
      }
    },
    type: 'object'
  }
};
