# Advanced Todo Application

A full-stack, feature-rich task management application built with modern technologies. This project demonstrates advanced frontend and backend implementation with TypeScript, React, Node.js, Express, and Prisma.

![Todo App](https://via.placeholder.com/800x400?text=Advanced+Todo+App)

## Features

- **Task Management**
  - Create, read, update, and delete tasks
  - Mark tasks as complete/incomplete
  - Set task priorities (LOW, MEDIUM, HIGH, URGENT)
  - Add task categories and tags
  - Set due dates and times for tasks

- **Advanced Filtering & Search**
  - Filter by status (all, completed, upcoming)
  - Filter by categories and priority
  - Full-text search for task names and descriptions

- **Modern UI/UX**
  - Responsive design for all devices
  - Dark/light mode toggle
  - Dashboard with statistics
  - Animated components and transitions
  - Material Design principles
  - Drag and drop interface

- **User Experience**
  - Overdue task notifications
  - Completion rate statistics
  - Category management
  - Intuitive navigation

## Technology Stack

### Backend
- **Node.js & Express**: RESTful API framework
- **Prisma**: ORM for database operations
- **PostgreSQL**: Database
- **TypeScript**: Type safety for JavaScript
- **Express Validator**: Input validation

### Frontend
- **React**: UI library
- **TypeScript**: Type-safe code
- **Material UI**: Component library
- **Vite**: Build tool
- **Axios**: HTTP client

## Project Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with your database connection string:
```
DATABASE_URL="postgresql://username:password@localhost:5432/tododb?schema=public"
PORT=4000
```

4. Set up Prisma and run migrations:
```bash
npx prisma migrate dev
```

5. Start the server:
```bash
npm run dev
```

The server will start running on http://localhost:4000

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will start running on http://localhost:5173

## API Documentation

### Endpoints

#### Todo Endpoints

| Method | Endpoint | Description | Request Body | Query Parameters |
|--------|----------|-------------|-------------|------------------|
| GET | `/api/todos` | Get all todos | - | `filter`: 'all', 'done', 'upcoming'<br>`search`: string<br>`category`: string<br>`priority`: 'LOW', 'MEDIUM', 'HIGH', 'URGENT' |
| GET | `/api/categories` | Get all categories | - | - |
| POST | `/api/todos` | Create a new todo | `name`: string<br>`shortDescription`: string<br>`dateTime`: ISO8601 string<br>`priority`: enum (optional)<br>`category`: string (optional)<br>`tags`: string[] (optional) | - |
| PUT | `/api/todos/:id` | Update a todo | `name`: string (optional)<br>`shortDescription`: string (optional)<br>`dateTime`: ISO8601 string (optional)<br>`isDone`: boolean (optional)<br>`priority`: enum (optional)<br>`category`: string (optional)<br>`tags`: string[] (optional) | - |
| DELETE | `/api/todos/:id` | Delete a todo | - | - |

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

## Frontend Architecture

The frontend is organized into the following components:

- **App.tsx**: Main application component with layout and state management
- **TodoForm**: Component for adding new todos
- **TodoItem**: Component for displaying individual todos
- **TodoEditDialog**: Dialog for editing existing todos
- **TodoFilters**: Component for filtering and searching todos

### State Management

The application uses React's useState and useEffect hooks for state management. The main states include:

- `todos`: Array of todos
- `loading`: Loading states for async operations
- `filters`: Current filter settings
- `categories`: Available categories
- `mode`: Theme mode (light/dark)

### Styling

The application uses Material UI for styling with a custom theme. The theme includes:

- Custom color palette for light and dark modes
- Typography settings
- Component style overrides
- Animation settings

## Project Structure

```
/
├── client/                   # Frontend codebase
│   ├── public/               # Static files
│   └── src/                  # Source files
│       ├── components/       # React components
│       │   ├── TodoForm.tsx
│       │   ├── TodoItem.tsx
│       │   ├── TodoEditDialog.tsx
│       │   └── TodoFilters.tsx
│       ├── api.ts            # API service
│       ├── App.tsx           # Main component
│       └── main.tsx          # Entry point
├── server/                   # Backend codebase
│   ├── prisma/               # Prisma schema and migrations
│   │   └── schema.prisma     # Database schema
│   ├── generated/           # Generated Prisma client
│   └── index.js             # Express server entry point
└── README.md                # This file
```

## Usage

1. **Create a new task**:
   - Fill out the form at the top of the page
   - Add a name, description, and date/time
   - Optionally specify a priority, category, and tags
   - Click "Add Task"

2. **Filter tasks**:
   - Use the toggle buttons to filter by status
   - Use the search bar to find specific tasks
   - Click the filter icon to show/hide advanced filters
   - Filter by category or priority

3. **Edit a task**:
   - Click on the expand icon on a task card
   - Click "Edit" to open the edit dialog
   - Make changes and click "Save Changes"

4. **Complete a task**:
   - Click the checkbox on a task to mark it as complete
   - Complete tasks are visually distinguished with strikethrough text

5. **Delete a task**:
   - Click on the expand icon on a task card
   - Click "Delete" to open the confirmation dialog
   - Confirm deletion by clicking "Delete" again

## Future Enhancements

- User authentication and user-specific todos
- Task sorting options
- Subtasks and task dependencies
- Calendar view for tasks
- Task recurrence options
- Mobile app with offline functionality
- Data export and import options
- Task sharing and collaboration features

## License

MIT

## Acknowledgments

- Material UI for the component library
- Prisma for the excellent ORM
- The open-source community for continuous inspiration

---

Created with ❤️ by [Your Name] 