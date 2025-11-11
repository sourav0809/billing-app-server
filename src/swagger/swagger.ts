import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { swaggerDefinitions } from './swagger-definitions';

const options = {
  apis: [], // No need for file scanning since we're defining everything here
  definition: {
    components: {
      schemas: {
        AttachQuestionPaperRequest: {
          properties: {
            setName: {
              example: 'Set A',
              maxLength: 255,
              minLength: 1,
              type: 'string'
            }
          },
          required: ['setName'],
          type: 'object'
        },
        AttachQuestionPaperResponse: {
          properties: {
            data: {
              properties: {
                answerKey: {
                  properties: {
                    finalizedAt: {
                      format: 'date-time',
                      nullable: true,
                      type: 'string'
                    },
                    id: {
                      format: 'uuid',
                      type: 'string'
                    },
                    setName: {
                      type: 'string'
                    }
                  },
                  type: 'object'
                },
                questionPaper: {
                  properties: {
                    finalizedAt: {
                      format: 'date-time',
                      nullable: true,
                      type: 'string'
                    },
                    id: {
                      format: 'uuid',
                      type: 'string'
                    },
                    setName: {
                      type: 'string'
                    }
                  },
                  type: 'object'
                }
              },
              type: 'object'
            },
            message: {
              example: 'Question paper and answer key attached successfully',
              type: 'string'
            },
            success: {
              example: true,
              type: 'boolean'
            }
          },
          type: 'object'
        },
        CreateExamRequest: {
          properties: {
            creatorId: {
              example: '550e8400-e29b-41d4-a716-446655440002',
              format: 'uuid',
              type: 'string'
            },
            description: {
              example: 'Comprehensive final examination for Mathematics',
              maxLength: 1000,
              type: 'string'
            },
            durationMinutes: {
              example: 120,
              minimum: 1,
              type: 'integer'
            },
            name: {
              example: 'Mathematics Final Exam',
              maxLength: 255,
              minLength: 1,
              type: 'string'
            },
            scheduledDate: {
              example: '2024-12-31T10:00:00.000Z',
              format: 'date-time',
              type: 'string'
            },
            subjectId: {
              example: '550e8400-e29b-41d4-a716-446655440000',
              format: 'uuid',
              type: 'string'
            }
          },
          required: ['name', 'scheduledDate'],
          type: 'object'
        },
        ErrorResponse: {
          properties: {
            message: {
              example: 'Error message',
              type: 'string'
            },
            success: {
              example: false,
              type: 'boolean'
            }
          },
          type: 'object'
        },
        Exam: {
          properties: {
            _count: {
              properties: {
                answerKeys: {
                  example: 2,
                  type: 'integer'
                },
                questionPapers: {
                  example: 2,
                  type: 'integer'
                },
                results: {
                  example: 45,
                  type: 'integer'
                },
                studentAnswers: {
                  example: 45,
                  type: 'integer'
                }
              },
              type: 'object'
            },
            createdAt: {
              format: 'date-time',
              type: 'string'
            },
            creator: {
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
            creatorId: {
              example: '550e8400-e29b-41d4-a716-446655440002',
              format: 'uuid',
              type: 'string'
            },
            description: {
              example: 'Comprehensive final examination for Mathematics',
              type: 'string'
            },
            durationMinutes: {
              example: 120,
              type: 'integer'
            },
            id: {
              example: '550e8400-e29b-41d4-a716-446655440001',
              format: 'uuid',
              type: 'string'
            },
            name: {
              example: 'Mathematics Final Exam',
              type: 'string'
            },
            scheduledDate: {
              example: '2024-12-31T10:00:00.000Z',
              format: 'date-time',
              type: 'string'
            },
            subject: {
              $ref: '#/components/schemas/Subject'
            },
            subjectId: {
              example: '550e8400-e29b-41d4-a716-446655440000',
              format: 'uuid',
              type: 'string'
            },
            updatedAt: {
              format: 'date-time',
              type: 'string'
            }
          },
          type: 'object'
        },
        ExamListResponse: {
          properties: {
            data: {
              properties: {
                exams: {
                  items: {
                    $ref: '#/components/schemas/Exam'
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
              example: 'Exams fetched successfully',
              type: 'string'
            },
            success: {
              example: true,
              type: 'boolean'
            }
          },
          type: 'object'
        },
        ExamResponse: {
          properties: {
            data: {
              $ref: '#/components/schemas/Exam'
            },
            message: {
              example: 'Exam fetched successfully',
              type: 'string'
            },
            success: {
              example: true,
              type: 'boolean'
            }
          },
          type: 'object'
        },
        LoginRequest: {
          properties: {
            email: {
              example: 'john.doe@example.com',
              format: 'email',
              type: 'string'
            },
            password: {
              example: 'password123',
              format: 'password',
              type: 'string'
            }
          },
          required: ['email', 'password'],
          type: 'object'
        },
        LoginResponse: {
          properties: {
            data: {
              properties: {
                token: {
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  type: 'string'
                },
                user: {
                  $ref: '#/components/schemas/User'
                }
              },
              type: 'object'
            },
            message: {
              example: 'Login successful',
              type: 'string'
            },
            success: {
              example: true,
              type: 'boolean'
            }
          },
          type: 'object'
        },
        // Exam-related schemas
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
              example: '550e8400-e29b-41d4-a716-446655440000',
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
        UpdateExamRequest: {
          properties: {
            description: {
              example: 'Updated description for Mathematics exam',
              maxLength: 1000,
              type: 'string'
            },
            durationMinutes: {
              example: 150,
              minimum: 1,
              type: 'integer'
            },
            name: {
              example: 'Updated Mathematics Final Exam',
              maxLength: 255,
              minLength: 1,
              type: 'string'
            },
            scheduledDate: {
              example: '2024-12-31T11:00:00.000Z',
              format: 'date-time',
              type: 'string'
            },
            subjectId: {
              example: '550e8400-e29b-41d4-a716-446655440000',
              format: 'uuid',
              type: 'string'
            }
          },
          type: 'object'
        },
        User: {
          properties: {
            createdAt: {
              format: 'date-time',
              type: 'string'
            },
            email: {
              example: 'john.doe@example.com',
              format: 'email',
              type: 'string'
            },
            id: {
              example: 'uuid-string-here',
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
              format: 'date-time',
              type: 'string'
            }
          },
          type: 'object'
        }
      },
      securitySchemes: {
        bearerAuth: {
          bearerFormat: 'JWT',
          scheme: 'bearer',
          type: 'http'
        }
      }
    },
    info: {
      description: 'Comprehensive API for AI-powered exam management system',
      title: 'Exam Portal API',
      version: '1.0.0'
    },
    openapi: '3.0.0',
    // Include the paths from our definitions file
    paths: swaggerDefinitions.paths,
    security: [
      {
        bearerAuth: []
      }
    ],
    servers: [
      {
        description: 'Development server',
        url: 'http://localhost:8001'
      },
      {
        description: 'Production server',
        url: 'https://api.yourdomain.com'
      }
    ]
  }
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
