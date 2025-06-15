# Advanced Todo App - Backend

This is the backend part of the Advanced Todo Application, a feature-rich task management app built with Express, Prisma, and PostgreSQL.

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework for building the REST API
- **Prisma**: Next-generation ORM for database operations
- **PostgreSQL**: Relational database for data storage
- **Express Validator**: Middleware for request validation
- **dotenv**: Environment variable management

## Features

- **RESTful API** for todo management
  - Create, read, update, and delete todos
  - Filter todos by multiple criteria
  - Search functionality

- **Database Integration**
  - Prisma ORM for type-safe database queries
  - PostgreSQL database with optimized schema
  - Database migrations for version control

- **Input Validation**
  - Request validation with Express Validator
  - Comprehensive error handling
  - Consistent error responses

- **Advanced Todo Properties**
  - Priority levels (LOW, MEDIUM, HIGH, URGENT)
  - Categories with dynamic management
  - Tags support
  - Timestamps for creation and updates

## API Documentation

### Endpoints

#### Get All Todos
```
GET /api/todos
```

Query Parameters:
- `filter`: (optional) Filter by status - 'all', 'done', 'upcoming'
- `search`: (optional) Search term for name and description
- `category`: (optional) Filter by category
- `priority`: (optional) Filter by priority - 'LOW', 'MEDIUM', 'HIGH', 'URGENT'

Response:
```json
[
  {
    "id": 1,
    "name": "Example Todo",
    "shortDescription": "This is an example todo",
    "dateTime": "2023-06-15T10:00:00.000Z",
    "isDone": false,
    "priority": "MEDIUM",
    "category": "General",
    "tags": ["example", "todo"],
    "createdAt": "2023-06-14T10:00:00.000Z",
    "updatedAt": "2023-06-14T10:00:00.000Z"
  }
]
```

#### Get All Categories
```
GET /api/categories
```

Response:
```json
["General", "Work", "Personal"]
```

#### Create a Todo
```
POST /api/todos
```

Request Body:
```json
{
  "name": "New Todo",
  "shortDescription": "Description of the new todo",
  "dateTime": "2023-06-15T10:00:00.000Z",
  "priority": "HIGH",
  "category": "Work",
  "tags": ["important", "meeting"]
}
```

Response:
```json
{
  "id": 2,
  "name": "New Todo",
  "shortDescription": "Description of the new todo",
  "dateTime": "2023-06-15T10:00:00.000Z",
  "isDone": false,
  "priority": "HIGH",
  "category": "Work",
  "tags": ["important", "meeting"],
  "createdAt": "2023-06-14T10:00:00.000Z",
  "updatedAt": "2023-06-14T10:00:00.000Z"
}
```

#### Update a Todo
```
PUT /api/todos/:id
```

Request Body (all fields optional):
```json
{
  "name": "Updated Todo",
  "shortDescription": "Updated description",
  "dateTime": "2023-06-16T10:00:00.000Z",
  "isDone": true,
  "priority": "MEDIUM",
  "category": "Work",
  "tags": ["important", "updated"]
}
```

Response:
```json
{
  "id": 2,
  "name": "Updated Todo",
  "shortDescription": "Updated description",
  "dateTime": "2023-06-16T10:00:00.000Z",
  "isDone": true,
  "priority": "MEDIUM",
  "category": "Work",
  "tags": ["important", "updated"],
  "createdAt": "2023-06-14T10:00:00.000Z",
  "updatedAt": "2023-06-14T11:00:00.000Z"
}
```

#### Delete a Todo
```
DELETE /api/todos/:id
```

Response:
```json
{
  "success": true
}
```

## Project Structure

```
server/
├── prisma/                # Prisma schema and migrations
│   ├── migrations/       # Database migrations
│   └── schema.prisma     # Prisma schema definition
├── generated/            # Generated Prisma client
├── index.js              # Main application entry point
├── package.json          # Dependencies and scripts
└── .env                  # Environment variables
```

## Database Schema

```prisma
model Todo {
  id               Int      @id @default(autoincrement())
  name             String
  shortDescription String
  dateTime         DateTime
  isDone           Boolean  @default(false)
  priority         Priority @default(MEDIUM)
  category         String   @default("General")
  tags             String[]
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

## Setup and Installation

1. **Prerequisites**:
   - Node.js (v14+)
   - PostgreSQL database
   - npm or yarn

2. **Install dependencies**:

```bash
npm install
# or
yarn install
```

3. **Environment setup**:

Create a `.env` file in the server directory with the following content:

```
DATABASE_URL="postgresql://username:password@localhost:5432/tododb?schema=public"
PORT=4000
```

Replace `username`, `password`, and other values as appropriate for your PostgreSQL setup.

4. **Database setup**:

```bash
npx prisma migrate dev
```

This will create the necessary tables in your database.

5. **Start the server**:

```bash
npm run dev
# or
yarn dev
```

The server will start on port 4000 (or the port specified in your `.env` file).

## Development Guidelines

- Follow Express best practices
- Use Prisma for all database operations
- Validate all input with Express Validator
- Handle errors appropriately
- Document all API endpoints
- Write clean, maintainable code

## Error Handling

The API uses consistent error responses:

- 400: Bad Request (invalid input)
- 404: Not Found (resource not found)
- 500: Internal Server Error

Example error response:
```json
{
  "error": "Name is required"
}
```

## Performance Considerations

- The API includes appropriate indexes on the database
- Pagination can be implemented for large datasets
- Filters are applied at the database level for efficiency

## Security Considerations

- Input validation for all requests
- Environment variables for sensitive information
- CORS middleware for cross-origin requests
- No sensitive data in responses

## Future Enhancements

- User authentication and authorization
- Rate limiting
- Request logging
- Advanced query options
- Websocket notifications
- File attachments for todos

## License

MIT 