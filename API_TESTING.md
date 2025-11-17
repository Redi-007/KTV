# API Testing Guide

This document provides examples for testing the KTV Workflow API endpoints.

## Base URL
```
http://localhost:5028/api
```

## Authentication
Currently, the API does not require authentication. In production, you should implement JWT-based authentication.

## Endpoints

### Institutions

#### Create Institution
```bash
curl -X POST http://localhost:5028/api/institutions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "description": "A sample organization",
    "address": "123 Main St"
  }'
```

#### Get All Institutions
```bash
curl http://localhost:5028/api/institutions
```

### Roles

#### Create Role
```bash
curl -X POST http://localhost:5028/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manager",
    "description": "Manager role"
  }'
```

### Users

#### Create User
```bash
curl -X POST http://localhost:5028/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "institutionId": 1,
    "roleIds": [1]
  }'
```

#### Get All Users
```bash
curl http://localhost:5028/api/users
```

### Workflows

#### Create Workflow
```bash
curl -X POST http://localhost:5028/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marketing Campaign",
    "description": "Marketing workflow",
    "institutionId": 1
  }'
```

#### Get All Workflows
```bash
curl http://localhost:5028/api/workflows
```

### Workflow Steps

#### Create Workflow Step
```bash
curl -X POST http://localhost:5028/api/workflowsteps \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Planning",
    "description": "Planning phase",
    "order": 1,
    "workflowId": 1
  }'
```

### Labels

#### Create Label
```bash
curl -X POST http://localhost:5028/api/labels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priority",
    "color": "#ff0000"
  }'
```

### Tasks

#### Create Task
```bash
curl -X POST http://localhost:5028/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "priority": 1,
    "workflowId": 1,
    "currentStepId": 1,
    "assignedToUserId": 1,
    "labelIds": [1, 2]
  }'
```

#### Get All Tasks
```bash
curl http://localhost:5028/api/tasks
```

#### Get Single Task
```bash
curl http://localhost:5028/api/tasks/1
```

#### Update Task
```bash
curl -X PUT http://localhost:5028/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task Title",
    "priority": 2
  }'
```

#### Move Task Between Steps
```bash
curl -X POST http://localhost:5028/api/tasks/1/move \
  -H "Content-Type: application/json" \
  -d '{
    "toStepId": 2,
    "comment": "Moving to next step",
    "changedByUserId": 1
  }'
```

#### Assign Task to User
```bash
curl -X POST http://localhost:5028/api/tasks/1/assign \
  -H "Content-Type: application/json" \
  -d '{
    "assignedToUserId": 2
  }'
```

#### Get Task History
```bash
curl http://localhost:5028/api/tasks/1/history
```

#### Delete Task
```bash
curl -X DELETE http://localhost:5028/api/tasks/1
```

## Using Swagger UI

For interactive API testing, navigate to:
```
http://localhost:5028/swagger
```

The Swagger UI provides:
- Interactive API documentation
- Ability to test endpoints directly in the browser
- Request/response examples
- Schema definitions

## Sample Workflow

1. Create an institution
2. Create roles (Admin, User, etc.)
3. Create users and assign them roles and institutions
4. Create a workflow for your institution
5. Create workflow steps (To Do, In Progress, Review, Done)
6. Create labels for categorization
7. Create tasks and assign them to users
8. Move tasks between workflow steps
9. View task history to see the audit trail

## Response Examples

### Successful Task Creation
```json
{
  "id": 1,
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication",
  "priority": 1,
  "dueDate": null,
  "workflowId": 1,
  "workflowName": "Software Development",
  "currentStepId": 1,
  "currentStepName": "To Do",
  "assignedToUserId": 1,
  "assignedToUserName": "john_doe",
  "createdAt": "2025-11-17T15:34:03.122Z",
  "updatedAt": null,
  "labels": [
    {
      "id": 2,
      "name": "Feature",
      "color": "#00ff00",
      "createdAt": "2025-11-17T15:34:03.104Z"
    }
  ]
}
```

### Task History
```json
[
  {
    "id": 1,
    "taskId": 1,
    "fromStepId": 1,
    "fromStepName": "To Do",
    "toStepId": 2,
    "toStepName": "In Progress",
    "changedByUserId": 1,
    "changedByUserName": "john_doe",
    "comment": "Moving to In Progress",
    "changedAt": "2025-11-17T15:40:16.724Z"
  }
]
```

## Error Responses

### 404 Not Found
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404
}
```

### 400 Bad Request
When validation fails, you'll receive details about what went wrong.

## Notes

- All timestamps are in UTC
- IDs are auto-generated integers
- Passwords are automatically hashed using BCrypt
- Many-to-many relationships (like Tasks-Labels) are handled automatically
- The API supports partial updates for PUT endpoints (only send fields you want to update)
