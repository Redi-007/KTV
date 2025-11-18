# ✨ Welcome to Your Spark Template!
You've just launched your brand-new Spark Template Codespace — everything’s fired up and ready for you to explore, build, and create with Spark!

This template is your blank canvas. It comes with a minimal setup to help you get started quickly with Spark development.

🚀 What's Inside?
- A clean, minimal Spark environment
- Pre-configured for local development
- Ready to scale with your ideas
  
🧠 What Can You Do?

Right now, this is just a starting point — the perfect place to begin building and testing your Spark applications.

🧹 Just Exploring?
No problem! If you were just checking things out and don’t need to keep this code:

- Simply delete your Spark.
- Everything will be cleaned up — no traces left behind.

📄 License For Spark Template Resources 

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
# KTV Workflow Application

A Trello-like workflow management application built with ASP.NET Core Web API and React.

## Features

- **Complete CRUD operations** for all entities (Users, Roles, Institutions, Workflows, WorkflowSteps, Tasks, TaskStatusHistory, Labels)
- **Specialized endpoints** for task management:
  - Move tasks between workflow steps
  - Assign tasks to users
  - View task history
- **Entity Framework Core** with SQL Server
- **React web client** with Kanban board interface
- **RESTful API** with reusable DTOs designed for future React Native mobile app

## Project Structure

```
KTV/
├── src/
│   └── KTV.API/              # ASP.NET Core Web API
│       ├── Models/            # Entity models
│       ├── DTOs/              # Data Transfer Objects
│       ├── Data/              # DbContext
│       ├── Controllers/       # API Controllers
│       └── Migrations/        # EF Core Migrations
└── client/                    # React web client
    └── src/
        ├── components/        # React components
        └── services/          # API client
```

## Entities

- **User**: User accounts with roles and institution association
- **Role**: User roles for permissions
- **Institution**: Organizations/institutions managing workflows
- **Workflow**: Workflow definitions with multiple steps
- **WorkflowStep**: Individual steps in a workflow (ordered)
- **Task**: Tasks that move through workflow steps
- **TaskStatusHistory**: Audit trail of task movements
- **Label**: Tags for categorizing tasks

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `POST /api/tasks/{id}/move` - Move task to another workflow step
- `POST /api/tasks/{id}/assign` - Assign task to a user
- `GET /api/tasks/{id}/history` - Get task status history

### Workflows
- `GET /api/workflows` - Get all workflows
- `GET /api/workflows/{id}` - Get workflow by ID with steps
- `POST /api/workflows` - Create workflow
- `PUT /api/workflows/{id}` - Update workflow
- `DELETE /api/workflows/{id}` - Delete workflow

### WorkflowSteps
- `GET /api/workflowsteps` - Get all workflow steps
- `GET /api/workflowsteps/{id}` - Get workflow step by ID
- `POST /api/workflowsteps` - Create workflow step
- `PUT /api/workflowsteps/{id}` - Update workflow step
- `DELETE /api/workflowsteps/{id}` - Delete workflow step

### Labels
- `GET /api/labels` - Get all labels
- `GET /api/labels/{id}` - Get label by ID
- `POST /api/labels` - Create label
- `PUT /api/labels/{id}` - Update label
- `DELETE /api/labels/{id}` - Delete label

### Institutions
- `GET /api/institutions` - Get all institutions
- `GET /api/institutions/{id}` - Get institution by ID
- `POST /api/institutions` - Create institution
- `PUT /api/institutions/{id}` - Update institution
- `DELETE /api/institutions/{id}` - Delete institution

### Roles
- `GET /api/roles` - Get all roles
- `GET /api/roles/{id}` - Get role by ID
- `POST /api/roles` - Create role
- `PUT /api/roles/{id}` - Update role
- `DELETE /api/roles/{id}` - Delete role

## Prerequisites

- .NET 8.0 SDK
- SQL Server or SQL Server LocalDB (or SQLite for development)
- Node.js 18+ and npm

## Setup Instructions

### Backend (API)

1. Navigate to the API project:
   ```bash
   cd src/KTV.API
   ```

2. **Database Configuration**:
   
   The project is configured to use SQLite by default for development/testing. To use SQL Server in production:
   
   - Update `appsettings.json` connection string:
     ```json
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=KTVWorkflowDb;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
     ```
   
   - Update `Program.cs` to use SQL Server:
     ```csharp
     builder.Services.AddDbContext<ApplicationDbContext>(options =>
         options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
     ```

3. Apply database migrations:
   ```bash
   dotnet ef database update
   ```

4. Run the API:
   ```bash
   dotnet run
   ```

The API will be available at `http://localhost:5028` (or the port shown in console)

### Frontend (React Client)

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API URL in `src/services/api.js` if needed (default: `http://localhost:5028/api`)

4. Run the development server:
   ```bash
   npm run dev
   ```

The client will be available at `http://localhost:5173`

## Using the Application

1. Start the backend API first
2. Start the frontend React client
3. Open your browser to `http://localhost:5173`

### Sample Workflow

1. Create an Institution (using API or Swagger)
2. Create a Workflow linked to the Institution
3. Create WorkflowSteps for the Workflow (e.g., "To Do", "In Progress", "Done")
4. Create Users
5. Create Tasks and manage them using the Kanban board

## Testing with Swagger

The API includes Swagger UI for testing endpoints:
- Navigate to `http://localhost:5000/swagger` when the API is running
- Use the interactive UI to test all endpoints

## Future Mobile App

The API is designed with reusable DTOs that can be easily consumed by a React Native mobile application. The DTOs provide:
- Consistent data structures across platforms
- Clean separation between API models and business logic
- Easy serialization/deserialization
- Type-safe data transfer

## Technologies Used

- **Backend**: ASP.NET Core 8.0, Entity Framework Core 8.0, SQL Server
- **Frontend**: React 18, Vite
- **Authentication**: BCrypt.Net for password hashing
- **API Documentation**: Swagger/OpenAPI

## License

MIT