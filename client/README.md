# Advanced Todo App - Frontend

This is the frontend part of the Advanced Todo Application, a feature-rich task management app built with React, TypeScript, and Material UI.

## Tech Stack

- **React (v19+)**: UI library for building the interface
- **TypeScript**: For type-safe code
- **Material UI (v7+)**: Component library for modern UI design
- **Vite**: Fast and efficient build tool
- **Axios**: HTTP client for API requests

## Features

- **Modern UI with Material Design**
  - Responsive layout works on all devices
  - Dark/light mode with theme persistence
  - Animated components for better user experience
  - Dashboard with statistics and visualizations

- **Advanced Task Management**
  - Create, update, and delete tasks
  - Task categorization and tagging
  - Priority levels (LOW, MEDIUM, HIGH, URGENT)
  - Due dates with visual indicators
  - Dynamic filters and search capabilities

- **User-Friendly Interface**
  - Intuitive drag and drop organization
  - Visual status indicators for tasks
  - Interactive notifications for overdue tasks
  - Category management with quick navigation

## Project Structure

```
client/
├── public/               # Static assets
├── src/                  # Source code
│   ├── components/       # React components
│   │   ├── TodoForm.tsx       # Task creation form
│   │   ├── TodoItem.tsx       # Individual task display
│   │   ├── TodoEditDialog.tsx # Task edit modal
│   │   └── TodoFilters.tsx    # Search and filtering controls
│   ├── api.ts            # API service and TypeScript interfaces
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.js        # Vite configuration
```

## Setup and Installation

1. **Prerequisites**:
   - Node.js (v14+)
   - npm or yarn

2. **Install dependencies**:

```bash
npm install
# or
yarn install
```

3. **Environment setup**:

The frontend expects the backend API to be running on `http://localhost:4000`. If your backend is running on a different URL, you'll need to update the `API_URL` constant in `src/api.ts`.

4. **Start the development server**:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

## Build for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The built files will be available in the `dist` directory.

## TypeScript Types

The application uses TypeScript for type safety. Key types include:

```typescript
// Todo item interface
export interface Todo {
  id: number;
  name: string;
  shortDescription: string;
  dateTime: string;
  isDone: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// For creating new todos
export interface TodoCreate {
  name: string;
  shortDescription: string;
  dateTime: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
  tags?: string[];
}

// For updating existing todos
export interface TodoUpdate {
  name?: string;
  shortDescription?: string;
  dateTime?: string;
  isDone?: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
  tags?: string[];
}

// Filter options
export interface TodoFilter {
  filter?: 'all' | 'done' | 'upcoming';
  search?: string;
  category?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
```

## Component Overview

### App.tsx
The main application component that handles:
- Overall layout and responsive design
- Theme management (dark/light mode)
- State management for todos, filters, etc.

### TodoForm.tsx
Form component for adding new tasks with:
- Input validation
- Dynamic category management
- Tag input system
- Priority selection

### TodoItem.tsx
Displays individual tasks with:
- Visual indicators for priority and status
- Expandable view for more details
- Action buttons for editing and deleting

### TodoEditDialog.tsx
Modal dialog for editing existing tasks with:
- Form fields for all task properties
- Data validation
- Category and tag management

### TodoFilters.tsx
Component for filtering and searching tasks with:
- Status filters (all, done, upcoming)
- Search functionality
- Advanced filters for category and priority

## Theme Customization

The application uses a custom Material UI theme defined in `App.tsx`. The theme includes:

- Custom color palette for light and dark modes
- Typography settings
- Component style overrides
- Animation and transition settings

## API Integration

The frontend communicates with the backend API using Axios. The API service in `api.ts` provides functions for:
- Fetching todos with filters
- Creating new todos
- Updating existing todos
- Deleting todos
- Fetching categories

## Development Guidelines

- Follow TypeScript best practices for type safety
- Use React functional components with hooks
- Maintain component-based architecture
- Follow Material UI design principles
- Keep components modular and reusable

## Known Issues

- None currently documented

## Future Enhancements

- User authentication and profiles
- Task sorting options
- Subtasks and dependencies
- Calendar view
- Drag-and-drop sorting
- Mobile app with offline functionality
- Task sharing and collaboration

## Credits

- Material UI for the component library
- React team for the excellent framework
- TypeScript team for the type system
- Vite team for the build tool
