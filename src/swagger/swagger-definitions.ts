/**
 * Swagger API definitions for Auth Service
 * This file contains all the OpenAPI/Swagger definitions for the API endpoints
 */

export const swaggerDefinitions = {
  paths: {
    '/auth/login': {
      post: {
        description: 'Authenticate user with email and password, returns JWT token',
        requestBody: {
          content: {
            'application/json': {
              example: {
                email: 'john.doe@example.com',
                password: 'password123'
              },
              schema: {
                $ref: '#/components/schemas/LoginRequest'
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            content: {
              'application/json': {
                example: {
                  data: {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    user: {
                      createdAt: '2024-01-01T00:00:00.000Z',
                      email: 'john.doe@example.com',
                      id: 'uuid-string-here',
                      name: 'John Doe',
                      phoneNumber: '+1234567890',
                      updatedAt: '2024-01-01T00:00:00.000Z'
                    }
                  },
                  message: 'Login successful',
                  success: true
                },
                schema: {
                  $ref: '#/components/schemas/LoginResponse'
                }
              }
            },
            description: 'Login successful'
          },
          401: {
            content: {
              'application/json': {
                examples: {
                  invalid_credentials: {
                    value: {
                      message: 'Invalid email or password',
                      success: false
                    }
                  }
                },
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            },
            description: 'Invalid credentials'
          },
          500: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            },
            description: 'Internal server error'
          }
        },
        security: [],
        summary: 'User Login',
        tags: ['Authentication']
      }
    }
  }
};
